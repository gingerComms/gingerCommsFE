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
    },
    // Retrieves all accounts for the authenticated user
    getUserAccounts (page) {
      if (!page) page = 1;

      if (this.$store.state.common.authToken) {
        this.$http.get(
          process.env.VUE_APP_API_URL + '/auth/accounts/'
        ).then(response => {
          if (response.status == 200) {
            this.$store.commit('common/updateUserAccounts', response.body);
            this.$store.commit('common/updateActiveAccount', response.body[0]);
          }
        })
      }
    }
  }
})

Vue.filter('humanizeDate', function (date, moment) {
    date = moment(date)
    var diff = date.diff(moment(new Date()), 'hours')
    console.log('filter', diff)
    if (diff > -20) {
        return moment.duration(date - moment(new Date())).humanize(true);
    } else if (diff <= -20 && diff > -44) {
        return "Yesterday at " + date.format("HH:MM");
    } else if (diff <= -44) {
        return moment(date).format("MMM DD, YYYY") + " at " + moment(date).format("HH:MM A")
    }
})

export default { }
