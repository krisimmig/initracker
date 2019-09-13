import Vue from 'vue';
import VTooltip from 'v-tooltip';

import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.use(VTooltip);

import { firebase } from './store/firebase';
import { dispatchLoginUser } from './store/usersModule';

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
