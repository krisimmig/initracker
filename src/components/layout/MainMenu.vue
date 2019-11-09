<template>
  <div class="MainMenu-wrapper">

    <div class="u-maxWidth">
      <div class="MainMenu">
        <template v-if="isLoggedIn">
          <div class="MainMenu-left">
            <router-link class="MainMenu-link MainMenu-link--iconWrapper" :to="{ name: 'home' }">
              <SvgIcon name="logo" class="MainMenu-link--icon" /><b>BETTER INITIATIVE</b>
            </router-link>
            <router-link class="MainMenu-link" :to="{ name: 'characters' }">Characters</router-link>
            <router-link class="MainMenu-link" :to="{ name: 'encounters' }">Encounters</router-link>
          </div>

          <div class="MainMenu-right">
            <router-link class="MainMenu-link" :to="{ name: 'home' }">{{ currentUserString }}</router-link>
            <a class="MainMenu-link" href="#" @click="logoutUser">Logout</a>
          </div>
        </template>

        <template v-else>
          <div class="MainMenu-left">
            <router-link class="MainMenu-link" :to="{ name: 'home' }">Home</router-link>
            <router-link class="MainMenu-link" :to="{ name: 'register' }">Register</router-link>
          </div>
          <div class="MainMenu-right">
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
import SvgIcon from '@/components/SvgIcon.vue';

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
@import '@/scss/variables.scss';

.MainMenu-wrapper {
  background-color: $color-black;
}

.MainMenu {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.MainMenu-left {
  display: flex;
  align-items: center;
}

.MainMenu-link {
  border-bottom: 1px solid transparent;
  padding: 3px 0 2px;
}

.MainMenu-link.is-active:not(.MainMenu-link--iconWrapper) {
  border-bottom: 1px solid currentColor;
}

.MainMenu-link--iconWrapper {
  display: inline-flex;
  align-items: center;
}

.MainMenu-link--icon {
  color: $color-2;
  font-size: 1.5em;
  margin-right: 0.4em;
}

.MainMenu-left .MainMenu-link {
  margin-right: 1rem;
}

.MainMenu-left .MainMenu-link--iconWrapper {
  margin-right: 2em;
}

.MainMenu-right .MainMenu-link {
  margin-left: 1rem;
}

</style>
