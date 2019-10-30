<template>
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
    <router-link :to="{ name: 'about' }">About</router-link> | 
    <span v-if="currentUserString">
      Logged in as: <strong>{{ currentUserString }}</strong>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { readUserString, readIsLoggedIn, dispatchLogoutUser } from '../../store/usersModule';

@Component
export default class MainMenu extends Vue {

  public logoutUser() {
    dispatchLogoutUser(this.$store);
  }

  get isLoggedIn(): boolean {
    return readIsLoggedIn(this.$store);
  }

  get currentUserString(): string|boolean {
    return readUserString(this.$store);
  }
}
</script>


<style lang="scss">
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
