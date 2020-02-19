<template>
  <div id="account-detail" class="template-content">
    <v-card v-if="account != null">
      <v-card-title class="headline">
        <v-row no-gutters>
          <v-col
            :md="2"
            :sm="1"
          >
            <v-hover v-slot:default="{ hover }">
              <v-img
                :src="account.avatarLink == null ? require('../assets/images/user-placeholder-sm.png') : account.avatarLink"

              >
                <v-expand-transition>
                  <div
                    v-if="hover"
                    class="d-flex align-center justify-center transition-fast-in-fast-out orange darken-2 v-card--reveal  white--text"
                    style="height: 100%; border-radius: 50%; opacity: 0.7; cursor: pointer;"
                    @click="touchAvatarInput()"
                  >
                    Edit
                  </div>
                </v-expand-transition>

                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </v-hover>
            <input
              name="account-avatar"
              ref="avatarUpload"
              style="display: none;"
              type="file"
              @change="avatarUploaded"
              accept="image/*"
            />
          </v-col>
          <v-col
            :cols="4"
            :md="10"
            :sm="4"
            class="mr-auto"
            @click="inputFieldClicked()"
          >
            <v-text-field
              single-line
              filled
              v-model="account.title"
              :disabled="!editingTitle"
              ref="titleField"
              width="100px"
              class="account-title-input justify-center"
              v-on:keyup.enter="titleChanged(account)"
            >
            </v-text-field>
          </v-col>
        </v-row>
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

  require("../styles/account-detail.scss")

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
      inputFieldClicked () {
        if (!this.editingTitle) {
          this.editingTitle = true;
        }
      },
      adminAdded (admin) {
        this.account.admins.push(admin);
      },
      titleChanged (changedAccount) {
        this.editingTitle = false;
        var that = this;
        var apiUrl = process.env.VUE_APP_API_URL + '/auth/account/'+changedAccount.id;
        var formdata = { title: changedAccount.title };
        this.$http.put(apiUrl, formdata).then(response => {
          if (response.status == 200) {
            that.account.title = response.body.title;
            that.$store.commit('common/accountChanged', response.body);
          }
        })
      },
      touchAvatarInput () {
        this.$refs.avatarUpload.click();
        console.log(this.$refs.avatarUpload)
      },
      avatarUploaded (e) {
        var files = e.target.files;
        if (files.length <= 0) {
          return;
        }
        var that = this;
        var file = files[0];
        var form = new FormData();
        form.append('file', file);
        var apiUrl = process.env.VUE_APP_API_URL + '/auth/account/'+this.account.id+'/avatar';
        this.$http.put(apiUrl, form, { headers: {'Content-Type': 'multipart/form-data'} })
          .then(response => {
            console.log(response.body);
            that.$refs.avatarUpload.value = '';
            that.account.avatarLink = response.body.avatarLink;
            that.$store.commit('common/accountChanged', response.body);
          })
      }
    },
    data () {
      return {
        account: null,
        tab: null,
        editingTitle: false
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
