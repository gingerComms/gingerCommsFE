<template>
  <v-dialog
    v-model="dialogOpen"
    max-width="500"
  >
    <v-card>
      <v-card-title class="headline">Create Team</v-card-title>

      <ValidationObserver v-slot="{ valid }">
        <v-card-text>
          <div class="form-control">
            <ValidationProvider
              rules="required"
              v-slot="{ errors }"
              name="Name"
            >
              <label for="name">Name</label>
              <input type="text" placeholder="Team Name" name="name" v-model="formdata.name" required>
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>

          <div class="form-control">
            <ValidationProvider
              rules="required"
              v-slot="{ errors }"
              name="Password"
            >
              <label for="password">Password</label>
              <input type="password" placeholder="Team Level Password" name="password" v-model="formdata.password" required>
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
            v-on:click="createTeam"
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
    name: 'create-team-dialog',
    props: ['showDialog'],
    computed: {
      dialogOpen: {
        get () {
          return this.showDialog
        },
        // eslint-disable-next-line
        set (newValue) {
          this.$emit('dialogToggled', newValue)
        }
      },
      activeAccount () {
        return this.$store.state.common.activeAccount
      }
    },
    methods: {
      createTeam () {
        var apiUrl = process.env.VUE_APP_API_URL + '/account/'+this.activeAccount.id+'/teams';
        this.$http.post(apiUrl, this.formdata).then(response => {
          if (response.status === 201) {
            this.$emit('teamCreated', response.body);
            this.dialogOpen = false;
          }
          this.formdata = {};
        }, response => {
          this.$store.commit('common/errorUpdate', { message: response.statusText, show: true })
          this.formdata = {};
        })
      }
    },
    data () {
      return {
        formdata: {
          name: '',
          password: ''
        }
      }
    }
  }
</script>
