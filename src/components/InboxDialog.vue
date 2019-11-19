<template>
  <v-dialog
    v-model="dialogOpen"
    max-width="75vw"
    id="inbox-dialog"
  >
    <v-card>
      <v-toolbar flat>
        <v-toolbar-title>Inbox</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon @click="dialogOpen = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-data-table
          hide-default-header
          hide-default-footer
          class="elevation-1"
          :headers="headers"
          :items="chatNodes"
          id="inbox-table"
        >
          <template v-slot:body="{ items }">
            <tbody>
              <tr v-for="item in items" :key="item.id">
                <td>
                  <router-link :to="getNodeLink(item)">
                    {{ item.name }}
                  </router-link>
                </td>
                
                <td>
                  <v-chip
                    :color="item.template.pillBackgroundColor"
                    small
                    :style="{ 'color': item.template.pillForegroundColor }"
                  >{{ item.template.name }}</v-chip>
                </td>
                
                <td
                  v-if="item.last_message"
                  v-bind:class="{ 'bold': messageIsUnread(item.last_message, item.last_seen_time) }"
                  >
                  {{ item.last_message.text.slice(0, 65) }}</td>
                <td v-if="!item.last_message"></td>

                <td v-if="item.last_message">{{ item.last_message.sent_at }}</td>
                <td v-if="!item.last_message"></td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'inbox-dialog',
    props: {
      showDialog: Boolean
    },
    computed: {
      dialogOpen: {
        get () {
          return this.showDialog;
        },
        set (newValue) {
          this.$emit('closeInbox', newValue);
        }
      },
      apiUrl () {
        return process.env.VUE_APP_API_URL + '/inbox_nodes';
      }
    },
    methods: {
      getInboxNodes () {
        this.$http.get(this.apiUrl).then(response => {
          this.chatNodes = response.body;
        })
      },
      getNodeLink (node) {
        console.log(node)
        if (node.nodeType == 'team') {
          return '/teams/'+node.id;
        } else {
          return '/teams/'+node.parentId+'/'+node.id;
        }
      },
      messageIsUnread (message, lastSeenTime) {
        if (lastSeenTime == null) {
          return true;
        }

        if (Date.parse(message.sent_at) > Date.parse(lastSeenTime)) {
          return true;
        }

        return false;
      }
    },
    data () {
      return {
        chatNodes: [],
        headers: [
          { text: 'Name', value: 'name' },
          { text: 'Template', value: 'template.name' },
          { text: 'Last Message', value: 'lastMessage.text' },
          { text: 'Sent At', value: 'lastMessage.sent_at' }
        ]
      }
    },
    created () {
      this.getInboxNodes();
    }
  }
</script>