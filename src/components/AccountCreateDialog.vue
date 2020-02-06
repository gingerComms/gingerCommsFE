<template>
  <v-dialog
    v-model="dialogOpen"
    max-width="500"
    id="account-create-dialog"
  >
    <v-card>
      <v-card-title class="headline">Create Account</v-card-title>

      <ValidationObserver v-slot="{ valid }">
        <v-card-text>
          <div class="form-control">
            <ValidationProvider
              rules="required"
              v-slot="{ errors }"
              name="Title"
            >
              <label for="title">Title</label>
              <input type="text" placeholder="Account Title" name="title" v-model="formdata.title" required>
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="dialogOpen=false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            v-on:click="createAccount"
            :disabled="!valid"
          >
            Create
          </v-btn>
        </v-card-actions>
      </ValidationObserver>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'account-create-dialog',
    props: {
      showDialog: Boolean
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
      createAccount () {
        var apiUrl = process.env.VUE_APP_API_URL + '/auth/accounts/';
        this.$http.post(apiUrl, this.formdata).then(function (response) {
          this.$emit('accountCreated', response.body);
          this.formdata = {};
          this.dialogOpen = false;
        })
      }
    },
    data () {
      return {
        formdata: {}
      }
    }
  }
</script>