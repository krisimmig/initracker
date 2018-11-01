import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { firebase } from "./store/vuex-easy-firestore";

const unsubscribe = firebase.auth().onAuthStateChanged(firebaseUser => {
  new Vue({
    el: "#app",
    router,
    store,
    render: h => h(App),
    created() {
      if (firebaseUser) {
        this.$store.dispatch("loginUser", firebaseUser);
      }
    }
  });
  unsubscribe();
});
