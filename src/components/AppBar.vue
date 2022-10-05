<template>
  <v-app-bar
    app
    color="primary lighten-1"
    flat
    class="AppBar"
  >
    <template v-if="isLoggedIn">

      <v-toolbar-title><router-link :to="{ name: 'home' }">YAIT</router-link></v-toolbar-title>

      <router-link :to="{ name: 'encounters' }">
        <v-btn
          color="white"
          text
          rounded
          class="ml-4 my-2"
        >
          <v-icon>mdi-format-list-bulleted-square</v-icon>
          Encounters
        </v-btn>
      </router-link>

      <router-link :to="{ name: 'characters' }">
        <v-btn
          color="white"
          text
          rounded
          class="my-2"
        >
          <v-icon>mdi-account-group</v-icon>
          Characters
        </v-btn>
      </router-link>

      <router-link :to="{ name: 'feedback' }">
        <v-btn
          color="white"
          text
          rounded
          class="my-2"
        >
          <v-icon>mdi-message-alert</v-icon>
          Feedback
        </v-btn>
      </router-link>

      <v-spacer></v-spacer>

      <router-link :to="{ name: 'userdetails' }">
        <v-btn
          color="white"
          text
          rounded
          class="my-2"
        >
          <v-icon>mdi-account-circle</v-icon>
          {{ currentUserString }}
        </v-btn>
      </router-link>

      <a href="#" @click="logoutUser">
        <v-btn
          color="white"
          text
          rounded
          class="my-2"
        >
          <v-icon>mdi-logout-variant</v-icon>
          Logout
        </v-btn>
      </a>

    </template>

    <template v-else>
      <router-link :to="{ name: 'home' }">
        <v-btn
          color="white"
          text
          rounded
          class="my-2"
        >
          <v-icon>mdi-home</v-icon>
          Home
        </v-btn>
      </router-link>

      <router-link :to="{ name: 'login' }">
        <v-btn
          color="white"
          text
          rounded
          class="my-2"
        >
          <v-icon>mdi-login</v-icon>
          Login
        </v-btn>
      </router-link>

    </template>
  </v-app-bar>
</template>

<script lang="ts">
import { dispatchLogoutUser, readIsLoggedIn, readUserString } from '@/store/usersModule';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class App extends Vue {

  get currentUserString(): string|null {
    return readUserString(this.$store) || 'ERROR getting username';
  }

  get isLoggedIn(): boolean {
    return readIsLoggedIn(this.$store);
  }

  public logoutUser() {
    dispatchLogoutUser(this.$store);
  }
}
</script>

<style>
header.AppBar a {
  text-decoration: none;
  color: white;
}
</style>
