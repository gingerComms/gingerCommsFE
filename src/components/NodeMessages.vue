<template>
  <v-card
    outlined
    id="node-messages">
    <v-card-text>
      <div id="messages-list" v-scroll="messagesScrolled">
        <div class="message" v-for="message in messages" v-scroll:#messages-list="messagesScrolled" v-bind:key="message.id">
          <div class="msgDetails">
            <div class="author">
              {{ message.author.fullName }}
            </div>
            <div class="sentAt">
              {{ message.sent_at }}
            </div>
          </div>
          <div class="text">
            {{ message.text }}
          </div>
        </div>
      </div>

      <v-text-field
        id="message-input"
        v-model="messageText"
        outlined
        append-icon="mdi-send"
        placeholder="Type your message and press Enter to submit"
        @click:append="sendMessage"
        v-on:keyup.enter="sendMessage"
      ></v-text-field>
    </v-card-text>
  </v-card>
</template>

<script>
  require("../styles/node-messages.scss");

  export default {
    name: 'node-messages',
    props: {
      nodeType: String,
      nodeId: String
    },
    computed: {
      apiUrl () {
        var url = process.env.VUE_APP_API_URL + '/' + this.nodeType + '/' + this.nodeId + '/messages';
        return url;
      }
    },
    methods: {
      getMessages (loadType, timestamp) {
        var url = this.apiUrl;
        
        console.log(url);
        if (loadType !== undefined && timestamp !== undefined) {
          url += '?' + loadType + '=' + timestamp;
        }

        this.$http.get(url).then(response => {
          if (response.status == 200) {
            if (!loadType) {
              this.messages = response.body;
            } else {
              if (loadType == 'before') {
                this.messages = response.body.concat(this.messages);
              } else {
                this.messages = this.messages.concat(response.body);
              }
            }
          }
        })
      },
      sendMessage () {
        if (this.messageText.length <= 0) {
          return;
        }

        var formdata = { text: this.messageText };
        this.$http.post(this.apiUrl, formdata).then(response => {
          if (response.status == 201) {
            this.messages.push(response.body);
            this.messageText = '';
          }
        })
      },
      messagesScrolled (e) {
        var scrollTop, scrollHeight, offsetHeight;
        if (e.target.scrollingElement) {
          scrollTop = e.target.scrollingElement.scrollTop;
          scrollHeight = e.target.scrollingElement.scrollHeight;
          offsetHeight = e.target.scrollingElement.offsetHeight;
        } else {
          scrollTop = e.target.scrollTop;
          scrollHeight = e.target.scrollHeight;
          offsetHeight = e.target.offsetHeight;
        }
        console.log(scrollTop, (scrollHeight-offsetHeight))
        if (scrollTop == 0) {
          this.getMessages("before", this.messages[0].sent_at);
        } else if (scrollTop >= (scrollHeight - offsetHeight)) {
          this.getMessages("after", this.messages[this.messages.length-1].sent_at);
        }
      }
    },
    data () {
      return {
        messages: [],
        messageText: ''
      }
    },
    created () {
      this.getMessages();
    }
  }
</script>
