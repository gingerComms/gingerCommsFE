<template>
  <div id="accounts-list" class="template-content">
    <account-create-dialog
      :showDialog="accountCreateDialogOpen"
      @dialogClosed="accountCreateDialogOpen = false;"
      @accountCreated="accountCreated"
    ></account-create-dialog>

    <v-card>
      <v-card-title class="headline">
        <v-row>
          <v-col :cols="11">
            Accounts
          </v-col>
          <v-col :cols="1">
            <v-btn
              color="#55cec7"
              fab
              dark
              small
              @click="accountCreateDialogOpen = true;">
              <v-icon>add</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text>
        <v-card-subtitle>
          Active Account: {{ $store.state.common.activeAccount.title }}
        </v-card-subtitle>

        <v-row dense>
          <v-col
            v-for="account in $store.state.common.userAccounts"
            :key="account.id"
            :cols="6"
          >
            <v-card
              max-width="100%"
              outlined
              :color="account.id == $store.state.common.activeAccount.id ? '#55cec7' : 'white'"
              :dark="account.id == $store.state.common.activeAccount.id"
            >
              <v-card-text>
                <v-menu bottom left class="col">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      v-on="on"
                    >
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>


                  <v-list v-if="userIsAdmin(account)">
                    <v-list-item>
                      <v-list-item-title @click="$router.push('/accounts/'+account.id)">Go to Detail</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>

                <v-row dense style="padding-top: 0;">
                  <v-col :cols="account.id == $store.state.common.activeAccount.id ? 12 : 10">
                    <h5>{{ account.title }}</h5>
                  </v-col>
                  <v-col
                    :cols="2"
                    style="padding-top: 0"
                    v-if="account.id != $store.state.common.activeAccount.id"
                  >
                    <v-btn
                      x-small
                      fab
                      elevation="0"
                      @click="$store.commit('common/updateActiveAccount', account)">
                      <v-icon>check</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import AccountCreateDialog from '@/components/AccountCreateDialog';

  require("../styles/accounts-list.scss");

  export default {
    name: 'accounts-list',
    components: {
      AccountCreateDialog
    },
    methods: {
      accountCreated (account) {
        this.$store.commit('common/userAccountCreated', account);
      },
      userIsAdmin (account) {
        var that = this;
        var isAdmin = false;
        account.admins.forEach(function (admin) {
          if (admin.id == that.$store.state.common.user.id) {
            isAdmin = true;
          }
        })
        return isAdmin;
      }
    },
    data () {
      return {
        accountCreateDialogOpen: false
      }
    }
  }
</script>