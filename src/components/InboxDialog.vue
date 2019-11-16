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
                <td>{{ item.name }}</td>
                <td>
                  <v-chip
                    :color="item.template.pillBackgroundColor"
                    small
                    :style="{ 'color': item.template.pillForegroundColor }"
                  >{{ item.template.name }}</v-chip>
                </td>
                <td>{{ item.lastMessage.text.slice(0, 65) }}</td>
                <td>{{ item.lastMessage.sent_at }}</td>
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
      }
    },
    methods: {
      getInboxNodes () {
        // todo
      }
    },
    data () {
      return {
        chatNodes: [
          {
            id: 'test',
            name: 'Node',
            nodeType: 'Team',
            template: {
              id: "template",
              name: 'Deliverable',
              pillForegroundColor: "#fff",
              pillBackgroundColor: "#000000"
            },
            lastMessage: {
              text: 'Whats up',
              sent_at: '10:55 PM'
            }
          },
          {
            id: 'test2',
            name: 'Node',
            nodeType: 'Team',
            template: {
              id: "template",
              name: 'Deliverable',
              pillForegroundColor: "#fff",
              pillBackgroundColor: "#000000"
            },
            lastMessage: {
              text: 'loremsdofi aodwif uawoieu hawoif nawkefjhawejkfhab wjef hbawwekjfh waiefjh kj',
              sent_at: '10:55 PM'
            }
          }
        ],
        headers: [
          { text: 'Name', value: 'name' },
          { text: 'Template', value: 'template.name' },
          { text: 'Last Message', value: 'lastMessage.text' },
          { text: 'Sent At', value: 'lastMessage.sent_at' }
        ]
      }
    }
  }
</script>