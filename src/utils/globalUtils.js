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
    },
    // Creates a copy of the given object
    clone(obj) {
        if (obj === null || typeof (obj) !== 'object' || 'isActiveClone' in obj)
            return obj;

        var temp;
        if (obj instanceof Date)
            temp = new obj.constructor(); //or new Date(obj);
        else
            temp = obj.constructor();

        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                obj['isActiveClone'] = null;
                temp[key] = this.clone(obj[key]);
                delete obj['isActiveClone'];
            }
        }
        return temp;
    }
  }
})

export default { }
