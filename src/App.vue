<template>
  <div class="flex flex-col h-screen bg-gray-200">
    <MainMenu />
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { readIsLoggedIn, dispatchLogoutUser } from '@/store/usersModule';
import { readGetNpcs, dispatchFetchNpcs } from '@/store/npcsModule';
import MainMenu from '@/components/layout/MainMenu.vue';

@Component({
  components: { MainMenu },
})
export default class App extends Vue {

  public logoutUser() {
    dispatchLogoutUser(this.$store);
  }

  get isLoggedIn(): boolean {
    return readIsLoggedIn(this.$store);
  }

  get monsters() {
    return readGetNpcs(this.$store);
  }

  public async mounted() {
    if (this.monsters.length < 1) {
      await dispatchFetchNpcs(this.$store);
    }
  }
}
</script>


<style>
/* purgecss start ignore */
@tailwind  base;
@tailwind  components;
/* purgecss end ignore */

@tailwind  utilities;

@import 'css/base.css';
@import 'css/utilities.css';
@import 'css/form.css';
@import 'css/card.css';
</style>
