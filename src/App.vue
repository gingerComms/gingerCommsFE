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
        @closeInbox="showInboxToggled"
      ></inbox-dialog>
    </v-app>
  </div>
</template>

<script>
import { VSnackbar, VApp } from 'vuetify/lib';
import InboxDialog from './components/InboxDialog';

export default {
  name: 'app',
  components: {
    'v-snackbar': VSnackbar,
    'v-app': VApp,
    InboxDialog
  },
  data () {
    return {
      snackbarTimeout: 2000,
      showInbox: false
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
      this.showInbox = value;
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
