<template>
  <div id="account-switch">
    <div id="accounts-container">
      <div @click="accountSwitched(account)" class="img-container" v-for="account in $store.state.common.userAccounts" v-bind:key="account.id">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <img v-on="on" :src="account.avatarLink == null ? require('../assets/images/user-placeholder-sm.png') : account.avatarLink" :title="account.title"> <!-- TODO: Add IMG to accounts -->
          </template>
          <span>{{ account.title }}</span>
        </v-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'account-switch',
    props: [],
    methods: {
      accountSwitched (account) {
        // Move on if the first account is clicked - since that's currently active anyways
        if (account === this.accounts[0]) {
          return;
        }
        this.accounts.splice(this.accounts.indexOf(account), 1);
        this.accounts.unshift(account);
        this.$store.commit('common/updateActiveAccount', account);
      },
      accountCreated (account) {
        // Created account passed down by the side-nav
        this.$store.commit('common/userAccountCreated', account);
      }
    },
    data () {
      return {
        accounts: []
      }
    }
  }
</script>