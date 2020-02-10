<template>
  <div id="account-detail" class="template-content">
    <v-card v-if="account != null">
      <v-card-title class="headline">
        Account:&nbsp;<strong>{{ account.title }}</strong>
      </v-card-title>

      <v-card-text>
        <v-tabs
          v-model="tab"
          background-color="transparent"
          color="#55cec7"
          left
          flat
          icons-and-text
        >
          <v-tabs-slider></v-tabs-slider>

          <v-tab href="#teams">
            Teams
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-tab>

          <v-tab href="#admins">
            Admins
            <v-icon>mdi-account-group</v-icon>
          </v-tab>

          <v-tabs-items v-model="tab">
            <v-tab-item value="teams">
              <v-card flat>
                <account-teams-list
                  :containerDisplayMode="'list'"
                  :accountId="this.account.id"
                ></account-teams-list>
              </v-card>
            </v-tab-item>

            <v-tab-item value="admins">
              <v-card flat>
                <account-admins-list
                  :admins="account.admins"
                  :accountId="account.id"
                  @adminAdded="adminAdded"
                ></account-admins-list>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import AccountTeamsList from '@/components/AccountTeamsList';
  import AccountAdminsList from '@/components/AccountAdminsList';

  export default {
    name: 'account-detail',
    components: {
      AccountTeamsList,
      AccountAdminsList
    },
    computed: {
      apiUrl () {
        var apiUrl = process.env.VUE_APP_API_URL;
        apiUrl += '/auth/account/'+this.$route.params.accountId+'/admins';
        return apiUrl;
      }
    },
    methods: {
      loadAccount () {
        var that = this;
        this.$http.get(this.apiUrl).then(response => {
          if (response.status == 200) {
            that.account = response.body;
          }
        })
      },
      adminAdded (admin) {
        this.account.admins.push(admin);
      }
    },
    data () {
      return {
        account: null,
        tab: null
      }
    },
    mounted () {
      var that = this;
      this.$store.state.common.userAccounts.forEach(function (account) {
        if (account.id == that.$route.params.accountId) {
          that.account = account;
          return;
        }
      })
      if (this.account == null) {
        that.loadAccount();
      }
    }
  }
</script>
