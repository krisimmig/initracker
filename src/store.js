import Vue from "vue";
import Vuex from "vuex";

import { easyFirestore } from "./store/vuex-easy-firestore";

Vue.use(Vuex);

const store = new Vuex.Store({
  // Include as PLUGIN in your vuex store:
  plugins: [easyFirestore]
});

// Open channels to the firestore.
store.dispatch("npcsData/openDBChannel");
store.dispatch("usersData/openDBChannel");

export default store;
