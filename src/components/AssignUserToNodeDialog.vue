<template>
  <v-dialog
    v-model="dialogOpen"
    max-width="500"
    id="assign-user-to-node-dialog"
  >
    <v-card>
      <v-card-title class="headline">
        Add Member
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="formdata.user"
          label="Email"
          placeholder="Email"
          type="email"
          filled
          :rules="[rules.email]"
        ></v-text-field>

        <v-select
          v-model="formdata.role"
          :items="roleOptions"
          item-text="text"
          item-value="value"
          filled
          label="Role"
          single-line
        ></v-select>
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn
          color="green darken-1"
          text
          v-on:click="dialogOpen = false"
        >
          Cancel
        </v-btn>
        <v-btn
          color="green darken-1"
          text
          v-on:click="addAssignee"
          :disabled="!formdata.user || !formdata.role"
        >
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'assign-user-to-node-dialog',
    props: {
      'nodeId': String,
      'nodeType': String,
      'showDialog': Boolean,
      'roleOptions': Array,
      'apiUrl': String
    },
    computed: {
      dialogOpen: {
        get () {
          return this.showDialog;
        },
        set (newValue) {
          this.formdata = {
            user: '',
            role: ''
          }
          this.$emit('dialogToggled', newValue);
        }
      }
    },
    methods: {
      addAssignee () {
        this.$http.post(this.apiUrl, this.formdata).then(response => {
          if (response.status == 201) {
            this.$emit('assigneeAdded', response.body);
            this.dialogOpen = false;
          }
        })
      }
    },
    data () {
      return {
        formdata: {
          user: '',
          role: ''
        },
        rules: {
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          },
        }
      }
    }
  }
</script>