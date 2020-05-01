<template>
  <div class="flex flex-col h-screen">
    <MainMenu />
    <div class="u-container-fluid">
      <router-view />
    </div>
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


<style lang="scss">
/* purgecss start ignore */
@tailwind  base;
@tailwind  components;
/* purgecss end ignore */
@import 'scss/base.scss';

@tailwind  utilities;

@import 'scss/variables.scss';
@import 'scss/utilities.scss';
@import 'scss/form.scss';
@import 'scss/buttons.scss';

.Content {
  margin: 0 0.5rem;
}
</style>
