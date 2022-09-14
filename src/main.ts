import Vue from 'vue';
import VTooltip from 'v-tooltip';
import VuetifyToast from 'vuetify-toast-snackbar-ng';
import 'normalize.css';

import '@/instance-props';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import { firebase } from '@/store/firebase';

import { dispatchLoginUser } from '@/store/usersModule';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

Vue.use(VTooltip);
Vue.use(VuetifyToast, {
  closeIcon: 'mdi-close',
});

Vue.prototype.$fireLoginUi = null;

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    dispatchLoginUser(store, user);
  }

  const vueApp = new Vue({
    el: '#app',
    router,
    store,
    vuetify,
    render: (h) => h(App)
  });
});
