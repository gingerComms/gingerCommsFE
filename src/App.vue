<template>
  <div id="app">
    <v-snackbar
      v-model="snackbarError.show"
      :timeout="snackbarTimeout"
    >
      {{ snackbarError.message }}
      <v-btn
        color="blue"
        text
        @click="closeSnackbar"
      >
        Close
      </v-btn>
    </v-snackbar>

    <v-app>
      <router-view :key="$route.fullPath"></router-view>
      <side-nav
        @click="errorSnackbar=true"
        @showInbox="showInboxToggled"></side-nav>
      <inbox-dialog
        v-if="isAuthenticated"
        :showDialog="showInbox"
        :key="inboxKey"
        @closeInbox="showInboxToggled"
      ></inbox-dialog>
      <team-authentication-dialog
        :showDialog="showTeamPasswordDialog"
        @dialogClosed="showTeamPasswordDialog = false"
      ></team-authentication-dialog>
    </v-app>
  </div>
</template>

<script>
import { VSnackbar, VApp } from 'vuetify/lib';
import InboxDialog from './components/InboxDialog';
import TeamAuthenticationDialog from './components/TeamAuthenticationDialog';

export default {
  name: 'app',
  components: {
    'v-snackbar': VSnackbar,
    'v-app': VApp,
    InboxDialog,
    TeamAuthenticationDialog
  },
  data () {
    return {
      snackbarTimeout: 2000,
      showInbox: false,
      inboxKey: 1,
      showTeamPasswordDialog: false
    }
  },
  computed: {
    snackbarError () {
      return this.$store.state.common.snackbarError
    },
    isAuthenticated () {
      return this.$store.getters['common/isAuthenticated']
    }
  },
  methods: {
    closeSnackbar () {
      this.$store.commit('common/errorUpdate', { message: '', show: false })
    },
    showInboxToggled (value) {
      if (value === true) {
        this.inboxKey += 1;
      }
      this.showInbox = value;
    }
  },
  mounted () {
    if (this.isAuthenticated) {
      this.getUserAccounts();
    }
  }
}
</script>

<style lang="scss">
  @import "./assets/css/vendor/bootstrap-reboot.css";
  @import "./assets/css/vendor/bootstrap.css";
</style>

<style lang="scss">
  @import "./styles/main.scss";
</style>
