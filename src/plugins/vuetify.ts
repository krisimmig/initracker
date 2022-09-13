import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import { VBtn, VIcon, VSnackbar } from "vuetify/lib";

Vue.use(Vuetify, {
  components: {
    VSnackbar,
    VBtn,
    VIcon
  }
});

export default new Vuetify({
});
