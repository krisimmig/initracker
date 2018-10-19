<template>
  <div id="app">
    <div id="nav">
      <router-link :to="{ name: 'home' }">Home</router-link> |
      <router-link :to="{ name: 'encounter' }">Encounter</router-link> |
      <router-link :to="{ name: 'login' }">Login</router-link> |
      <router-link :to="{ name: 'register' }">Register</router-link> |
      <router-link :to="{ name: 'about' }">About</router-link> |
      <button @click="logout">Logout</button>
    </div>
    <router-view/>
  </div>
</template>

<script>
import { firebase } from "./store/vuex-easy-firestore";

export default {
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => this.$router.push({ name: "home" }))
        .catch(error => console.log("error logging out.", error));
    }
  }
};
</script>

<style lang="scss">
</style>
