<template>
  <div class="Main">
    <MainMenu />
    <div class="Content">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { readIsLoggedIn, dispatchLogoutUser } from '@/store/usersModule';
import { readGetNpcs, dispatchFetchNpcs } from '@/store/npcsModule';
import { dispatchFetchCharacters } from '@/store/charactersModule';
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

  public async mounted() {
    if (this.monsters.length < 1) {
      await dispatchFetchNpcs(this.$store);
    }

    // dispatchFetchCharacters(this.$store);
  }
}
</script>


<style lang="scss">
@import '@/scss/variables.scss';
@import '@/scss/typography.scss';
@import '@/scss/utilities.scss';
@import '@/scss/base.scss';
@import '@/scss/form.scss';
@import '@/scss/buttons.scss';

@import '@/scss/popover.scss';

.Content {
  margin: 0 0.5rem;
}
</style>
