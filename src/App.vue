<template>
  <v-app>
    <AppBar />

    <v-main class="grey lighten-5">
      <v-container :fluid="$route.meta?.isFullWidth">
        <router-view></router-view>
        <confirm ref="confirm"></confirm>
      </v-container>
    </v-main>
  </v-app>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { readGetNpcs, dispatchFetchNpcs } from '@/store/npcsModule';
import AppBar from '@/components/AppBar.vue';
import Confirm from '@/components/common/Confirm.vue';

@Component({
  components: { AppBar, Confirm },
})
class App extends Vue {

  get monsters() {
    return readGetNpcs(this.$store);
  }

  public async mounted() {
    this.$root.$confirm = (this.$refs.confirm as InstanceType<typeof Confirm>)?.open;

    if (this.monsters.length < 1) {
      await dispatchFetchNpcs(this.$store);
    }
  }
}

export default App;
</script>
