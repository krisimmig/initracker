<template>
  <div>
    <MainMenu />
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { readIsLoggedIn, dispatchLogoutUser } from './store/usersModule';
import * as npcsModule from './store/npcsModule';
import * as encountersModule from './store/encountersModule';

import MainMenu from './components/MainMenu.vue';

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
}
</script>


<style lang="scss">
@import './scss/helper-classes.scss';
@import './scss/popover.scss';

ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
