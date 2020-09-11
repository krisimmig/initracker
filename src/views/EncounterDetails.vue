<template>
  <div class="flex">
    <div class="EncounterDetails-sideColumn flex flex-col">
      <div class="EncounterDetails-sideBarTitles">
        <p
          class="EncounterDetails-tab"
          :class="{ 'is-active': !showSearch }"
          @click="showSearch = false"
        >
          Active character
        </p>
        <p
          class="EncounterDetails-tab"
          :class="{ 'is-active': showSearch }"
          @click="showSearch = true"
        >
          Library
        </p>
      </div>

      <div class="EncounterDetails-npcsList">
        <template v-if="showSearch">
          <CharacterLibrary :encounterId="$route.params.encounterId" />
        </template>
        <template v-else>
          <div class="u-scrollBoxParent shadow bg-white">
            <div class="u-scrollBoxChild">
              <CharacterDetails v-if="activeCharacter" :characterData="activeCharacter"/>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="flex flex-col flex-grow mx-3">
      <EncounterList :id="$route.params.encounterId" />
    </div>

    <div class="EncounterDetails-sideColumn flex flex-col">
      <div class="EncounterDetails-sideBarTitles">
        <p class="EncounterDetails-tab">Selected character</p>
      </div>
      <div>
        <div class="u-scrollBoxParent bg-white shadow">
          <div class="u-scrollBoxChild">
            <CharacterDetails v-if="selectedCharacter" :characterData="selectedCharacter"/>
            <p class="u-tip" v-else>Click on a character name to see details here.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';

import {
  readGetNpcInDetail,
  readGetEncountersActiveNpc,
  dispatchFetchEncounterById,
} from '@/store/encountersModule';
import EncounterList from '@/components/encounters/EncounterList.vue';
import CharacterLibrary from '@/components/characters/CharacterLibrary.vue';
import CharacterDetails from '@/components/characters/CharacterDetails.vue';

@Component({
  components: {
    EncounterList,
    CharacterLibrary,
    CharacterDetails,
  },
})
export default class EncounterDetails extends Vue {
  public showSearch: boolean = true;

  get selectedCharacter() {
    return readGetNpcInDetail(this.$store);
  }

  get activeCharacter() {
    return readGetEncountersActiveNpc(this.$store);
  }

  public mounted() {
    dispatchFetchEncounterById(this.$store, { encounterId: this.$route.params.encounterId });
  }
}
</script>

<style lang="scss">
.EncounterDetails-sideColumn {
  width: 28%;
}

.EncounterDetails-sideBarTitles {
  @apply mb-1 flex;
  margin-top: 3.6rem;
}

.EncounterDetails-tab {
  @apply mb-2 mr-4 cursor-pointer text-gray-600 border-b border-transparent transition duration-200;
}

.EncounterDetails-tab:hover,
.EncounterDetails-tab.is-active {
  @apply text-black border-current;
}
</style>
