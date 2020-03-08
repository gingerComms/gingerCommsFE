<template>
  <v-navigation-drawer
    v-model="drawer"
    permanent
    absolute
    expand-on-hover
  >
    <v-list-item class="px-2">
      <v-list-item-avatar>
        <v-img :src="require('../assets/images/logo.png')" height="20px" width="50px" contain></v-img>
      </v-list-item-avatar>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense>
      <v-list-item
        v-for="item in items"
        :key="item.title"
        link
        :to="item.url"
        @click="item.onclick"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        link
        @click="logout"
        v-if="$store.state.common.authToken.length > 0"
      >
        <v-list-item-icon>
          <v-icon>mdi-logout</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        link
        to="/login"
        v-if="$store.state.common.authToken.length == 0"
      >
        <v-list-item-icon>
          <v-icon>mdi-login</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>Login</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  <!--
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
            <a>
              <i class="material-icons md-36" v-on="on"
                @click="showInbox">mail</i>
            </a>
          </template>
          <span>Inbox</span>
        </v-tooltip>
      </li>

      <li v-if="isAuthenticated">
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <router-link to="/accounts">
              <i class="material-icons md-36" v-on="on">account_box</i>
            </router-link>
          </template>
          <span>Accounts List</span>
        </v-tooltip>
      </li>

      <li v-if="isAuthenticated">
        <account-switch ref="accountSwitch"></account-switch>
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
  -->
  </v-navigation-drawer>
</template>

<script>
  import AccountSwitch from '@/components/AccountSwitch';
  

  export default {
    name: "side-nav",
    components: {
      'account-switch': AccountSwitch,  // Unused at the moment
    },
    computed: {
      isAuthenticated () {
        return this.$store.getters['common/isAuthenticated'];
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
        title: 'VPMO',
        drawer: true,
        mini: true,
        items: [
          { title: 'Dashboard', icon: 'mdi-home-city', url: '/dashboard' },
          { title: 'Inbox', icon: 'mdi-mail', onclick: this.showInbox },
          { title: 'Accounts', icon: 'mdi-account-multiple', url: '/accounts' }
        ]
      }
    }
  }
</script>
