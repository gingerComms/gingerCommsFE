<template>
  <div id="account-admins-list">
    <add-admin-dialog
      :accountId="accountId"
      :showDialog="showDialog"
      @dialogClosed="showDialog = false;"
      @adminAdded="adminAdded"
    ></add-admin-dialog>

    <ListTabView
      :objects="listTabViewFormattedData"
      :mode="'list'"
      :headers="listHeaders"
      :isLoading="false"
      :isDraggable="false"
    >
      <template v-slot:listTopContent>
        <v-card flat>
          <v-card-text>
            <v-btn
              color="#55cec7"
              raised
              dark
              @click="showDialog = true;"
            >Add Admin</v-btn>
          </v-card-text>
        </v-card>
      </template>

      <template v-slot:listUtils="{ object }">
        <v-btn
          icon
          v-if="object.id !== $store.state.common.user.id"
          @click="removeAdmin(object.id)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </ListTabView>
  </div>
</template>

<script>
  import ListTabView from './ListTabView';
  import AddAdminDialog from './AddAdminDialog';

  export default {
    name: 'account-admins-list',
    components: {
      ListTabView,
      AddAdminDialog
    },
    props: {
      'accountId': String,
      'admins': Array
    },
    computed: {
      listTabViewFormattedData () {
        var objects = [];
        this.admins.forEach(function (admin) {
          var listData = {
            fullName: admin.fullName,
            email: admin.email,
            id: admin.id
          }
          objects.push({
            id: admin.id,
            route: null,
            tabsData: {},
            listData
          })
        })
        return objects;
      }
    },
    methods: {
      removeAdmin (adminId) {
        var index = this.admins.indexOf(
          this.admins.filter(admin => admin.id == adminId)[0]
        );
        var apiUrl = process.env.VUE_APP_API_URL+'/auth/account/'+this.accountId+'/admins';
        var formdata = { user: adminId };
        var that = this;
        this.$http.delete(apiUrl, {body: formdata}).then(response => {
          if (response.status == 200) {
            that.admins.splice(index, 1);
          }
        })
      },
      adminAdded (admin) {
        this.$emit('adminAdded', admin);
      }
    },
    data () {
      return {
        listHeaders: [
          { text: 'Full Name', value: 'fullName' },
          { text: 'Email', value: 'email' },
          { text: 'Utils', value: 'utils' }
        ],
        showDialog: false
      }
    }
  }
</script>
