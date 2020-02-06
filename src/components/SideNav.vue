<template>
  <div id="side-nav">
    <router-link to="/"><img src="../assets/images/logo.png"></router-link>
    <account-create-dialog
      :showDialog="accountCreateDialogOpen"
      @dialogClosed="accountCreateDialogOpen = false;"
      @accountCreated="accountCreated"
    ></account-create-dialog>

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

      <li v-if="isAuthenticated && $route.path == '/dashboard'">
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <a>
              <i class="material-icons md-36" v-on="on"
                @click="accountCreateDialogOpen = true;">add_box</i>
            </a>
          </template>
          <span>Create Account</span>
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
</template>

<script>
  import AccountSwitch from '@/components/AccountSwitch';
  import AccountCreateDialog from '@/components/AccountCreateDialog';

  export default {
    name: "side-nav",
    components: {
      'account-switch': AccountSwitch,
      AccountCreateDialog
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
      },
      accountCreated (account) {
        this.$refs.accountSwitch.accountCreated(account);
      }
    },
    data () {
      return {
        title: 'VPMO',
        accountCreateDialogOpen: false
      }
    }
  }
</script>
