import Vue from 'vue';
import { 
    ValidationProvider,
    ValidationObserver,
    setInteractionMode,
    extend
} from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';
import en from 'vee-validate/dist/locale/en';

// Vuetify Implementation before App import to order styles
import vuetify from './plugins/vuetify';
import App from './App.vue';
import router from './router/router';
import store from './store';
import SideNav from './components/SideNav.vue';
import networking from './networking/interceptors';
import './utils/globalUtils';

networking.addInterceptors();

Vue.config.productionTip = false

// Validation Provider
for (let rule in rules) {
  // Adding all of the in built rules in
  extend(rule, {
    ...rules[rule], // add the rule
    message: en.messages[rule] // add its message
  });
}
setInteractionMode('aggressive')
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver)

// Global Components
Vue.component('side-nav', SideNav)

new Vue({
  router: router,
  store: store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
