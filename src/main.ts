import 'normalize.css';
import './class-component-hooks';
import Vue from 'vue';
import VTooltip from 'v-tooltip';
import VuetifyToast from 'vuetify-toast-snackbar-ng';
import PerfectScrollbar from 'vue2-perfect-scrollbar'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'

import '@/instance-props';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import vuetify from './plugins/vuetify';
import { firebase } from '@/store/firebase';
import { dispatchLoginUser } from '@/store/usersModule';

Vue.config.productionTip = false;

Vue.use(PerfectScrollbar)
Vue.use(VTooltip);
Vue.use(VuetifyToast);

// Vue.prototype.$fireLoginUi = null;

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    dispatchLoginUser(store, user);
  }

  new Vue({
    el: '#app',
    router,
    store,
    vuetify,
    render: (h) => h(App)
  });
});
