<template>
  <div>
    <PageTitle
        title="Login"
        subtitle="use one of these methods to login."
    />
    <div class="u-container-fluid max-w-3xl">
      <div class="card card--rounded card--shadow">
        <p>To create a new account or login to an existing one, click one of the methods below.</p>
        <div id="firebaseui-auth-container"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PageTitle from '@/components/common/PageTitle.vue';

// tslint:disable-next-line:no-var-requires
const firebaseui = require('firebaseui');
// tslint:disable-next-line:no-var-requires
const firebase = require('firebase');


@Component({
  components: {
    PageTitle,
  },
})
export default class Npc extends Vue {
  public mounted() {
    const uiConfig = {
      signInSuccessUrl: '/',
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      ],
    };

    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());

    ui.start('#firebaseui-auth-container', uiConfig);
  }
}
</script>
