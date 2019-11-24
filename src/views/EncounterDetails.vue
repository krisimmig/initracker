<template>
  <div class="EncounterDetails">
    <div class="EncounterDetails-sideBar EncounterDetails-sideBar--left">
      <div class="EncounterDetails-sideBarTitles">
        <p class="EncounterDetails-tab" :class="{ 'is-active': !showSearch }" @click="showSearch = false">Selected character</p>
        <p class="EncounterDetails-tab" :class="{ 'is-active': showSearch }" @click="showSearch = true">Library</p>
      </div>

      <div class="EncounterDetails-npcsList">
        <template v-if="showSearch">
          <NpcsList :encounterId="$route.params.encounterId" />
        </template>
        <template v-else>
          <div class="u-scrollBoxParent">
            <div class="u-scrollBoxChild">
              <div class="EncounterDetails-activeCharacterWrapper">
                <NpcDetails v-if="selectedNpc" :npcData="selectedNpc" />
                <p v-else>Click on a character name to see details here.</p>
              </div>
            </div>
          </div>
        </template>
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
        <p class="EncounterDetails-tab is-active is-disabled">Active character</p>
      </div>
      <div>
        <div class="u-scrollBoxParent">
          <div class="u-scrollBoxChild">
            <NpcDetails v-if="activeNpc" :npcData="activeNpc" />
          </div>
        </div>
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
$sideContentWidth: 27%;

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

.EncounterDetails-sideBarTitles {
  margin-top: 2.9rem;
  margin-bottom: 0.8rem;
  display: flex;
}

.EncounterDetails-tab {
  margin-bottom: 0.5rem;
  border-bottom: 1px solid transparent;
  margin-right: 1.3rem;
  cursor: pointer;
}

.EncounterDetails-tab.is-active {
  border-bottom-color: currentColor;
  font-weight: 700;
}

.EncounterDetails-tab.is-disabled {
  cursor: initial;
}
</style>
