<template>
  <v-app-bar
    app
    color="primary lighten-1"
    flat
    class="AppBar"
  >
    <template v-if="isLoggedIn">

      <v-toolbar-title><router-link :to="{ name: 'home' }">
        <div style="width: 50px; line-height: 1;">
          <svg viewBox="0 0 92 77" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor" fill-rule="nonzero"><path d="M73.554 32.583s0-6.338 5.856-6.338h8.787v-3.17s0-6.338-5.858-6.338H67.694c-5.86 0-5.86-3.171-5.86-3.171v63.348h20.505s5.858 0 5.858-6.339V32.583c0-3.169 2.93-3.169 2.93-3.169H79.41c-2.93 0-2.93 3.17-2.93 3.17v31.653c0 3.168-2.926 3.168-2.926 0V32.583ZM64.766.887c-2.931 0-2.931 3.17-2.931 3.17v3.171c0 6.339 5.86 6.339 5.86 6.339H82.34s5.858 0 5.858 3.17V7.227C88.198.887 82.34.887 82.34.887H64.766ZM47.19 32.583s0-6.338-5.861-6.338h-8.784v-3.17s0-6.338 5.856-6.338h14.646c5.858 0 5.858-3.171 5.858-3.171v63.348H38.4s-5.856 0-5.856-6.339V32.583c0-3.169-2.93-3.169-2.93-3.169h11.714c2.932 0 2.932 3.17 2.932 3.17v31.653c0 3.168 2.93 3.168 2.93 0V32.583ZM55.979.887c2.926 0 2.926 3.17 2.926 3.17v3.171c0 6.339-5.857 6.339-5.857 6.339H38.4s-5.856 0-5.856 3.17V7.227C32.544.887 38.4.887 38.4.887h17.579Z"/><path d="M29.615 4.057c0-3.17 2.929-3.17 2.929-3.17H20.827s-2.93 0-2.93 3.17v15.849c0 3.17-2.928 3.17-2.928 3.17V7.226c0-6.34-5.857-6.34-5.857-6.34H.322c2.93 0 2.93 3.17 2.93 3.17v72.857h11.717V35.753c2.928 0 2.928 3.169 2.928 3.169v34.823s0 3.169 2.93 3.169h11.717s-2.93 0-2.93-3.17V35.754c0-6.339-5.86-6.339-5.86-6.339s5.86 0 5.86-6.339V4.057Z"/></g></svg>
        </div>
      </router-link></v-toolbar-title>

      <router-link :to="{ name: 'encounters' }">
        <v-btn
          color="white"
          text
          rounded
          class="ml-4 my-2"
        >
          <v-icon left>mdi-format-list-bulleted-square</v-icon>
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
          <v-icon left>mdi-account-group</v-icon>
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
          <v-icon left>mdi-message-alert</v-icon>
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
          <v-icon left>mdi-account-circle</v-icon>
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
          <v-icon left>mdi-logout-variant</v-icon>
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
          <v-icon left>mdi-home</v-icon>
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
          <v-icon left>mdi-login</v-icon>
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
