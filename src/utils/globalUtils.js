import Vue from 'vue';

Vue.mixin({
  methods: {
    // Receives a property name as input and converts it to CamelCase
    // for usage by all other methods
    valuefyProperty (propertyName) {
      return propertyName.replace(/[^a-zA-Z0-9]/g, "");
    },
    // Filters out any special characters in the string
    filterSpecialCharacters (string) {
      let re = /[^A-Z0-9]/gi;
      return string.replace(re, '');
    }
  }
})

export default { }
