<template>
  <div>
    <h1>Encounter Details</h1>
    <p class="IT-Button" @click="showSearch = !showSearch">Monster List</p>
    <div class="IT-Flex">

      <div class="IT-Flex-20" v-if="showSearch">
        <NpcsList :encounterId="$route.params.encounterId"  />
      </div>

      <div class="IT-Flex-grow">
        <Encounter
          :id="$route.params.encounterId"
          @npcSelected="npcSelected(npcData)"
        />
      </div>

      <div class="IT-Flex-30">
        <NpcDetails v-if="selectedNpc" :npcData="selectedNpc" />
        <p v-else>Click on a character name to see details here.</p>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';

import * as encountersModule from '../store/encountersModule';
import Encounter from '../components/encounters/Encounter.vue';
import NpcsList from '../components/npcs/NpcsList.vue';
import NpcDetails from '../components/npcs/NpcDetails.vue';

@Component({
  components: { Encounter, NpcsList, NpcDetails },
})
export default class EncounterDetails extends Vue {
  public showSearch: boolean = false;

  get selectedNpc() {
    return encountersModule.readGetNpcInDetail(this.$store);
  }

  public mounted() {
    encountersModule.dispatchFetchEncounterById(this.$store, { encounterId: this.$route.params.encounterId });
  }
}
</script>

<style>
</style>
