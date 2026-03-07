<template>
  <v-app-bar
    class="AppBar"
    flat
  >
    <div class="appbar-content">
      <template v-if="isLoggedIn">
        <v-toolbar-title>
          <router-link :to="{ name: 'home' }" class="d-flex align-center ga-2">
            <img src="@/assets/logo_small.svg" style="height: 36px; width: auto;" alt="Top Of The Round" />
            <span class="app-name">TOP OF THE ROUND</span>
          </router-link>
        </v-toolbar-title>

        <router-link :to="{ name: 'encounters' }">
          <v-btn variant="text" rounded class="ml-4 my-2">
            <v-icon start>mdi-sword-cross</v-icon>
            Encounters
          </v-btn>
        </router-link>

        <router-link :to="{ name: 'characters' }">
          <v-btn variant="text" rounded class="my-2">
            <v-icon start>mdi-account-group</v-icon>
            Characters
          </v-btn>
        </router-link>

        <router-link :to="{ name: 'feedback' }">
          <v-btn variant="text" rounded class="my-2">
            <v-icon start>mdi-message-alert</v-icon>
            Feedback
          </v-btn>
        </router-link>

        <v-spacer></v-spacer>

        <v-btn icon variant="text" class="my-2" @click="toggleTheme">
          <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
        </v-btn>

        <router-link :to="{ name: 'userdetails' }">
          <v-btn variant="text" rounded class="my-2">
            <v-icon start>mdi-account-circle</v-icon>
            {{ currentUserString }}
          </v-btn>
        </router-link>

        <a href="#" @click.prevent="logoutUser">
          <v-btn variant="text" rounded class="my-2">
            <v-icon start>mdi-logout-variant</v-icon>
            Logout
          </v-btn>
        </a>
      </template>

      <template v-else>
        <v-toolbar-title>
          <router-link :to="{ name: 'home' }" class="d-flex align-center ga-2">
            <img src="@/assets/logo_small.svg" style="height: 36px; width: auto;" alt="Top Of The Round" />
            <span class="app-name">TOP OF THE ROUND</span>
          </router-link>
        </v-toolbar-title>

        <router-link :to="{ name: 'home' }">
          <v-btn variant="text" rounded class="my-2">
            <v-icon start>mdi-home</v-icon>
            Home
          </v-btn>
        </router-link>

        <router-link :to="{ name: 'demo' }">
          <v-btn variant="text" rounded class="my-2">
            <v-icon start>mdi-play-circle</v-icon>
            Try Demo
          </v-btn>
        </router-link>

        <router-link :to="{ name: 'login' }">
          <v-btn variant="text" rounded class="my-2">
            <v-icon start>mdi-login</v-icon>
            Login
          </v-btn>
        </router-link>
      </template>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import { useUsersStore } from '@/store/useUsersStore'

const usersStore = useUsersStore()
const theme = useTheme()

const currentUserString = computed(() => usersStore.userString || 'ERROR getting username')
const isLoggedIn = computed(() => usersStore.isLoggedIn)
const isDark = computed(() => theme.global.current.value.dark)

function toggleTheme() {
  theme.global.name.value = isDark.value ? 'light' : 'dark'
}

function logoutUser() {
  usersStore.logoutUser()
}
</script>

<style>
header.AppBar {
  background-color: rgba(0, 0, 0, 0.06) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.v-theme--dark header.AppBar {
  background-color: rgba(255, 255, 255, 0.06) !important;
}

header.AppBar a {
  text-decoration: none;
  color: inherit;
}

.appbar-content {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;
}

header.AppBar a.is-active .v-btn,
header.AppBar a.is-activeExact .v-btn {
  background-color: rgba(0, 0, 0, 0.08);
  font-weight: 700;
}

.v-theme--dark header.AppBar a.is-active .v-btn,
.v-theme--dark header.AppBar a.is-activeExact .v-btn {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
