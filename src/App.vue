<template>
  <v-app>
    <AppBar />

    <v-main class="grey lighten-5">
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { readGetNpcs, dispatchFetchNpcs } from '@/store/npcsModule';
import AppBar from '@/components/AppBar.vue';

@Component({
  components: { AppBar },
})
export default class App extends Vue {

  get monsters() {
    return readGetNpcs(this.$store);
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
