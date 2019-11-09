<template>
  <div class="EncounterDetails">
    <div class="EncounterDetails-sideBar EncounterDetails-sideBar--left">
      <div class="EncounterDetails-sideBarTitles">
        <p @click="showSearch = false">Selected character</p>
        <p @click="showSearch = true">Library</p>
      </div>

      <div class="EncounterDetails-npcsList" v-if="showSearch">
        <NpcsList :encounterId="$route.params.encounterId"  />
      </div>
      <div class="EncounterDetails-activeCharacterWrapper" v-else>
        <NpcDetails v-if="selectedNpc" :npcData="selectedNpc" />
        <p v-else>Click on a character name to see details here.</p>
      </div>
    </div>

    <div class="EncounterDetails-mainContent">
      <Encounter
        :id="$route.params.encounterId"
        @npcSelected="npcSelected(npcData)"
      />
    </div>

    <div class="EncounterDetails-sideBar EncounterDetails-sideBar--right">
      <div class="EncounterDetails-sideBarTitles">
        <p>Active character</p>
        <NpcDetails v-if="activeNpc" :npcData="activeNpc" />
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

  get activeNpc() {
    return encountersModule.readGetEncountersActiveNpc(this.$store);
  }

  public mounted() {
    encountersModule.dispatchFetchEncounterById(this.$store, { encounterId: this.$route.params.encounterId });
  }
}
</script>

<style lang="scss">
$sideContentWidth: 25%;

.EncounterDetails {
  display: flex;
}

.EncounterDetails-mainContent {
  flex-grow: 1;
  margin: 0 1rem;
}

.EncounterDetails-sideBar {
  display: flex;
  flex-basis: $sideContentWidth;
  flex-direction: column;
}
</style>
