import common from "./common";
import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';

// For Localstore/Cookies persistence
const vuexPersist = new VuexPersistence({
  key: 'gingercomms',
  storage: window.localStorage,
  modules: ['common']
})

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        common
    },
    plugins: [vuexPersist.plugin]
})