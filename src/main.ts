import Vue from 'vue';
import VTooltip from 'v-tooltip';

import './instance-props';
import App from './App.vue';
import router from './router';
import store from './store';
import { firebase } from './store/firebase';

import { dispatchLoginUser } from './store/usersModule';

Vue.config.productionTip = false;

Vue.use(VTooltip);

Vue.prototype.$fireLoginUi = null;

// tslint:disable-next-line:no-unused-expression
new Vue({
  el: '#app',
  router,
  store,
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatchLoginUser(this.$store, user);
      } else {
        this.$router.push('/login');
      }
     });
    },
  render: (h) => h(App),
});
