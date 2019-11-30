import Vue from 'vue';
import VTooltip from 'v-tooltip';
import 'normalize.css';

import '@/instance-props';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import { firebase } from '@/store/firebase';

import { dispatchLoginUser } from '@/store/usersModule';

Vue.config.productionTip = false;

Vue.use(VTooltip);

Vue.prototype.$fireLoginUi = null;

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    dispatchLoginUser(store, user);
  } else {
    router.push('/login');
  }

  const vueApp = new Vue({
    el: '#app',
    router,
    store,
    render: (h) => h(App),
  });
});
