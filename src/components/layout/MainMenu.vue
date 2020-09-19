<template>

  <div class="MainMenu bg-gray-600">
    <div class="u-container-fluid">
      <div class="justify-between items-center flex h-12 text-gray-100">
        <template v-if="isLoggedIn">
          <div class="flex items-center">
            <router-link class="" :to="{ name: 'home' }">
              <div class="flex items-center mr-3">
                <SvgIcon name="logo" class="text-red-600" /><p class="ml-2 font-bold MainMenu-link mb-0">BETTER INITIATIVE</p>
              </div>
            </router-link>
            <router-link class="MainMenu-link" :to="{ name: 'encounters' }">Encounters</router-link>
            <router-link class="MainMenu-link" :to="{ name: 'characters' }">Characters</router-link>
          </div>

          <div class="ml-auto">
            <router-link class="MainMenu-link" :to="{ name: 'userdetails' }">{{ currentUserString }}</router-link>
            <a class="MainMenu-link" href="#" @click="logoutUser">Logout</a>
          </div>
        </template>

        <template v-else>
          <div class="flex items-center">
            <router-link class="MainMenu-link" :to="{ name: 'home' }">Home</router-link>
            <router-link class="MainMenu-link" :to="{ name: 'register' }">Register</router-link>
          </div>
          <div>
            <router-link class="MainMenu-link" :to="{ name: 'login' }">Login</router-link>
          </div>
        </template>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { readUserString, readIsLoggedIn, dispatchLogoutUser } from '@/store/usersModule';
import SvgIcon from '@/components/common/SvgIcon.vue';

@Component({
  components: { SvgIcon },
})
export default class MainMenu extends Vue {

  public logoutUser() {
    dispatchLogoutUser(this.$store);
  }

  get isLoggedIn(): boolean {
    return readIsLoggedIn(this.$store);
  }

  get currentUserString(): string|null {
    return readUserString(this.$store) || 'ERROR getting username';
  }
}
</script>

<style lang="scss">
  .MainMenu-link {
    @apply ml-2;
  }

  .MainMenu-link:hover {
    @apply underline;
  }

  .MainMenu a {
    text-decoration: none;
  }
</style>
