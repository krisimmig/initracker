import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

import { firebase } from './store/firebase';
import { dispatchLoginUser } from './store/userModule';

const unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
  // tslint:disable-next-line:no-unused-expression
  new Vue({
    el: '#app',
    router,
    store,
    render: (h) => h(App),
    created() {
      if (firebaseUser) {
        dispatchLoginUser(this.$store, firebaseUser);
      }
    },
  });
  unsubscribe();
});
