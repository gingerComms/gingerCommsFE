<template>
  <div id="side-nav">
    <router-link to="/"><img src="../assets/images/logo.png"></router-link>

    <ul class="mr-auto">
      <li v-if="isAuthenticated">
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <router-link to="/dashboard">
              <i class="material-icons md-36" v-on="on">home</i>
            </router-link>
          </template>
          <span>Dashboard</span>
        </v-tooltip>
      </li>

      <li v-if="isAuthenticated">
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <i
              class="material-icons md-36"
              style="color: white; cursor: pointer;"
              v-on="on"
              @click="showInbox">mail</i>
          </template>
          <span>Inbox</span>
        </v-tooltip>
      </li>

      <li v-if="isAuthenticated">
        <account-switch></account-switch>
      </li>

      

      <li v-if="!isAuthenticated" class="end">
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <router-link to="/login">
              <i class="material-icons md-36" v-on="on">vpn_key</i>
            </router-link>
          </template>
          <span>Login</span>
        </v-tooltip>
      </li>


      <li v-if="isAuthenticated" class="end">
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <a @click="logout()">
              <i class="material-icons md-36" style="cursor: pointer;" v-on="on">exit_to_app</i>
            </a>
          </template>
          <span>Logout</span>
        </v-tooltip>
      </li>
    </ul>
  </div>
</template>

<script>
  import AccountSwitch from '@/components/AccountSwitch';

  export default {
    name: "side-nav",
    components: {
      'account-switch': AccountSwitch
    },
    computed: {
      isAuthenticated () {
        return this.$store.getters['common/isAuthenticated']
      }
    },
    methods: {
      logout () {
        this.$store.commit('common/resetStore');
        this.$router.push('/logout')
      },
      showInbox () {
        this.$emit('showInbox', true);
      }
    },
    data () {
      return {
        title: 'VPMO'
      }
    }
  }
</script>