<template>
  <div id="firebaseui-auth-container"></div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

// tslint:disable-next-line:no-var-requires
const firebaseui = require('firebaseui');
// tslint:disable-next-line:no-var-requires
const firebase = require('firebase');


@Component
export default class Npc extends Vue {
  public mounted() {
    const uiConfig = {
      signInSuccessUrl: '/about',
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
