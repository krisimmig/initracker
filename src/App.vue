<template>
  <div>
    <MainMenu />
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { readIsLoggedIn, dispatchLogoutUser } from './store/usersModule';
import { readGetNpcs, dispatchFetchNpcs } from './store/npcsModule';

import MainMenu from './components/layout/MainMenu.vue';

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
@import './scss/helper-classes.scss';
@import './scss/popover.scss';
@import './scss/form.scss';

ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
