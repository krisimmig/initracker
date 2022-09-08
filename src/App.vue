<template>
  <v-app>
    <v-app-bar
      app
      color="primary lighten-1"
      flat
      class="MainMenu"
    >
        <template v-if="isLoggedIn">

          <v-toolbar-title><router-link :to="{ name: 'home' }">YAIT</router-link></v-toolbar-title>

          <v-btn
              color="white"
              text
              rounded
              class="ml-4 my-2"
          >
            <router-link :to="{ name: 'encounters' }">Encounters</router-link>
          </v-btn>

          <v-btn
              color="white"
              text
              rounded
              class="my-2"
          >
            <router-link :to="{ name: 'characters' }">Characters</router-link>
          </v-btn>

          <v-btn
              color="white"
              text
              rounded
              class="my-2"
          >
            <router-link :to="{ name: 'feedback' }">Feedback</router-link>
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn
              color="white"
              text
              rounded
              class="my-2"
          >
            <router-link :to="{ name: 'userdetails' }">{{ currentUserString }}</router-link>
          </v-btn>

          <v-btn
              color="white"
              text
              rounded
              class="my-2"
          >
            <a class="" href="#" @click="logoutUser">Logout</a>
          </v-btn>

        </template>

        <template v-else>
          <v-btn
              color="white"
              text
              rounded
              class="my-2"
          >
            <router-link :to="{ name: 'home' }">Home</router-link>
          </v-btn>

          <v-btn
              color="white"
              text
              rounded
              class="my-2"
          >
            <router-link :to="{ name: 'login' }">Login</router-link>
          </v-btn>

        </template>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import {readIsLoggedIn, dispatchLogoutUser, readUserString} from '@/store/usersModule';
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

  get currentUserString(): string|null {
    return readUserString(this.$store) || 'ERROR getting username';
  }

  public async mounted() {
    if (this.monsters.length < 1) {
      await dispatchFetchNpcs(this.$store);
    }
  }
}
</script>

<style>
header.MainMenu a {
  text-decoration: none;
  color: white;
}
</style>
