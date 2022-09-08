<template>
<div class="MainMenu">
  <template v-if="isLoggedIn">
      <router-link class="" :to="{ name: 'home' }">
        <div class="flex items-center mr-3">
          <SvgIcon name="logo" class="text-red-600" /><p class="ml-2 font-bold MainMenu-link mb-0">YAIT</p>
        </div>
      </router-link>
      <router-link :to="{ name: 'encounters' }">Encounters</router-link>
      <router-link :to="{ name: 'characters' }">Characters</router-link>
      <router-link :to="{ name: 'feedback' }">Feedback</router-link>

      <router-link :to="{ name: 'userdetails' }">{{ currentUserString }}</router-link>
      <a class="" href="#" @click="logoutUser">Logout</a>
  </template>

  <template v-else>
    <router-link :to="{ name: 'home' }">Home</router-link>
    <router-link :to="{ name: 'login' }">Login</router-link>
  </template>
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

</style>
