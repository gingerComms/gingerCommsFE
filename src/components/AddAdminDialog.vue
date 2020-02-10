<template>
  <v-dialog
    v-model="dialogOpen"
    max-width="500"
    id="add-admin-dialog"
  >
    <v-card>
      <v-card-title class="headline">
        Add Admin
      </v-card-title>

      <v-card-text>
        <user-search-field
          v-model="userField"
          :users="[]"
          :label="'Fullname'"
          :disabled="false"
          :allowAPISearch="true"
        ></user-search-field>
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
          v-on:click="addAdmin"
          :disabled="!formdata.user"
        >
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import UserSearchField from './UserSearchField';

  export default {
    name: 'add-admin-dialog',
    components: {
      UserSearchField
    },
    props: {
      showDialog: Boolean,
      accountId: String
    },
    computed: {
      dialogOpen: {
        get () {
          return this.showDialog;
        },
        set () {
          this.$emit('dialogClosed', true);
        }
      }
    },
    methods: {
      addAdmin () {
        if (!this.formdata.user) return;

        var that = this;
        var apiUrl = process.env.VUE_APP_API_URL + '/auth/account/'+this.accountId+'/admins';
        this.$http.post(apiUrl, this.formdata).then(response => {
          that.$emit('adminAdded', response.body);
          that.formdata = { user: '' };
          that.dialogOpen = false;
        })
      }
    },
    watch: {
      userField (val) {
        if (typeof(val) == "object") {
          this.formdata.user = val.value;
          this.userField = val.text;
        } else {
          this.userfield = val;
        }
      }
    },
    data () {
      return {
        formdata: {
          user: '',
        },
        userField: ''
      }
    }
  }
</script>
