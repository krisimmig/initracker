<template>
  <div>
    <div id="nav">
      <router-link :to="{ name: 'home' }">Home</router-link> |
      <template v-if="isLoggedIn">
        <router-link :to="{ name: 'dashboard' }">Dashboard</router-link> |
        <router-link :to="{ name: 'characters' }">Characters</router-link> |
        <router-link :to="{ name: 'encounters' }">Encounters</router-link> |
        <a href="#" @click="logoutUser">Logout</a> | 
      </template>
      <template v-else>
        <router-link :to="{ name: 'login' }">Login</router-link> |
        <router-link :to="{ name: 'register' }">Register</router-link> |
      </template>
      <router-link :to="{ name: 'about' }">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { readIsLoggedIn, dispatchLogoutUser } from './store/usersModule';
import * as npcsModule from './store/npcsModule';
import * as encountersModule from './store/encountersModule';

@Component
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
