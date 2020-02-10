<template>
  <div>
    <v-autocomplete
      v-model="selectedUser"
      :value="selectedUser"
      :label="label"
      :items="userItems"
      :disabled="disabled"
      :search-input.sync="search"
      :loading="isLoading"
      dense
      return-object
      color="green darken-1"
      filled
      rounded
      background-color="#f7f9fc"
    ></v-autocomplete>
  </div>
</template>

<script>
  export default {
    name: 'user-search-field',
    props: {
      value: String,
      users: Array,
      label: String,
      disabled: Boolean,
      allowAPISearch: Boolean
    },
    computed: {
      userItems () {
        var items = [];
        this.users.forEach(function (user) {
          items.push({
            value: user.id,
            text: user.fullName
          });
        })
        return items;
      },
      selectedUser: {
        get () {
          return this.value;
        },
        set (newValue) {
          this.$emit('input', newValue);
        }
      }
    },
    watch: {
      search (val) {
        if (val == null) {
          this.search = this.selectedUser;
          return
        }
        if (val == this.selectedUser) {
          return;
        }
        if (val.length < 3) return

        // Making sure that searching the backend is allowed
        if (!this.allowAPISearch) return

        // Items have already been requested
        if (this.isLoading) return

        this.isLoading = true
        this.$http.get(process.env.VUE_APP_API_URL+'/auth/users?fullName='+val).then(response => {
          this.users = response.body;
          this.isLoading = false;
        })
      }
    },
    data () {
      return {
        search: null,
        isLoading: false
      }
    }
  }
</script>
