<template>
  <v-autocomplete
    v-model="selectedUser"
    
    :items="userItems"
    :disabled="disabled"
    dense
    color="green darken-1"
    filled
    dense
    rounded
    background-color="#f7f9fc"
  ></v-autocomplete>
</template>

<script>
  export default {
    name: 'user-search-field',
    props: {
      value: String,
      users: Array,
      label: String,
      disabled: Boolean
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
    data () {
      return {
      }
    }
  }
</script>
