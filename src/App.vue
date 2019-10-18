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
      <router-view></router-view>
      <side-nav @click="errorSnackbar=true"></side-nav>
    </v-app>
  </div>
</template>

<script>
import { VSnackbar, VApp } from 'vuetify/lib';

export default {
  name: 'app',
  components: {
    'v-snackbar': VSnackbar,
    'v-app': VApp
  },
  data () {
    return {
      snackbarTimeout: 2000
    }
  },
  computed: {
    snackbarError () {
      return this.$store.state.common.snackbarError
    }
  },
  methods: {
    closeSnackbar () {
      this.$store.commit('common/errorUpdate', { message: '', show: false })
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
