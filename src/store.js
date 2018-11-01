import Vue from "vue";
import Vuex from "vuex";

import { easyFirestore, firebase } from "./store/vuex-easy-firestore";
import router from "./router";

Vue.use(Vuex);

const store = new Vuex.Store({
  // Include as PLUGIN in your vuex store:
  plugins: [easyFirestore],

  state: {
    user: null
  },

  mutations: {
    setUser(state, user) {
      console.log(user);
      state.user = user;
    }
  },

  actions: {
    validateUser({ commit, dispatch }, user) {
      firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then(
          response => {
            commit("setUser", response.user);
            dispatch("openFirbaseChannels");
            router.push({ name: "home" });
          },
          error => console.error(error)
        );
    },

    loginUser({ commit, dispatch }, user) {
      commit("setUser", user);
      dispatch("openFirbaseChannels");
    },

    openFirbaseChannels({ dispatch }) {
      dispatch("npcsData/openDBChannel");
      dispatch("usersData/openDBChannel");
      dispatch("charactersData/openDBChannel");
    },

    closeFirbaseChannels({ dispatch }) {
      dispatch("npcsData/closeDBChannel", { clearModule: true });
      dispatch("usersData/closeDBChannel", { clearModule: true });
      dispatch("charactersData/closeDBChannel", { clearModule: true });
    },

    logoutUser({ commit, dispatch }) {
      firebase
        .auth()
        .signOut()
        .then(() => {
          dispatch("closeFirbaseChannels");
          commit("setUser", null);
          router.push({ name: "home" });
        })
        .catch(error => console.log("error logging out.", error));
    }
  },

  getters: {
    isLoggedIn(state) {
      return state.user !== null;
    }
  }
});

export default store;
