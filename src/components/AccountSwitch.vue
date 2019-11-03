<template>
  <div id="account-switch">
    <div id="accounts-container">
      <div @click="accountSwitched(account)" class="img-container" v-for="account in accounts" v-bind:key="account.id">
        <img src="../assets/images/user-placeholder-sm.png" :title="account.title"> <!-- TODO: Add IMG to accounts -->
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
        this.$store.state.common.activeAccount = account;
      },
      loadAccounts (page) {
        if (!page) page = 1;

        this.$http.get(
          process.env.VUE_APP_API_URL + '/auth/accounts/'
        ).then(response => {
          if (response.status == 200) {
            this.accounts = response.body;
            this.$store.commit('common/updateActiveAccount', this.accounts[0]);
          }
        })
      }
    },
    data () {
      return {
        accounts: []
      }
    },
    created () {
      this.loadAccounts();
    }
  }
</script>