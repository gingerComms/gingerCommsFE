<template>
  <v-dialog
    v-model="dialogOpen"
    max-width="50vw"
    id="team-authentication-dialog"
    :persistent="true"
  >
    <v-card>
      <v-card-title class="headline">
        Team Login
      </v-card-title>

      <v-card-text class="mt-5">
        <v-text-field
          v-model="formdata.password"
          filled
          label="Password"
          type="password"
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn
          color="green"
          v-on:click="loginTeam"
          :disabled="!formdata.password"
          class="mr-3"
        >
          Login
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'team-authentication-dialog',
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
      },
      apiUrl () {
        return process.env.VUE_APP_API_URL + '/team/' + this.$route.params.teamId + '/authorize';
      }
    },
    methods: {
      loginTeam () {
        var that = this;
        this.$http.post(this.apiUrl, this.formdata).then(response => {
          if (response.status == 200) {
            that.$store.commit('common/updateActiveTeamPassword', {
              teamId: that.$route.params.teamId,
              password: that.formdata.password
            })
            that.formdata = { password: '' };
            this.dialogOpen = false;
          }
        })
      }
    },
    data () {
      return {
        formdata: {
          password: ''
        }
      };
    }
  }
</script>