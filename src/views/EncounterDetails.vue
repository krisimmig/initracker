<template>
  <div class="flex">
    <div class="flex flex-col w-3/12">
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
          <div class="u-scrollBoxParent">
            <div class="u-scrollBoxChild">
              <div class="EncounterDetails-activeCharacterWrapper">
                <CharacterDetails v-if="activeCharacter" :characterData="activeCharacter"/>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="flex flex-col flex-grow mx-6">
      <Encounter :id="$route.params.encounterId" />
    </div>

    <div class="flex flex-col w-3/12">
      <div class="EncounterDetails-sideBarTitles">
        <p class="EncounterDetails-tab is-active is-disabled">Selected character</p>
      </div>
      <div>
        <div class="u-scrollBoxParent">
          <div class="u-scrollBoxChild">
            <CharacterDetails v-if="selectedCharacter" :characterData="selectedCharacter"/>
            <p v-else>Click on a character name to see details here.</p>
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
import Encounter from '@/components/encounters/Encounter.vue';
import CharacterLibrary from '@/components/characters/CharacterLibrary.vue';
import CharacterDetails from '@/components/characters/CharacterDetails.vue';

@Component({
  components: {
    Encounter,
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
$sideContentWidth: 27%;

.EncounterDetails-sideBarTitles {
  @apply mt-8 mb-1 flex;
}

.EncounterDetails-tab {
  @apply mb-2 mr-4 cursor-pointer text-gray-600;
  border-bottom: 1px solid transparent;
}

.EncounterDetails-tab:hover {
  @apply text-black;
  border-bottom: 1px solid transparent;
}

.EncounterDetails-tab.is-active {
  @apply text-black;
  border-bottom-color: currentColor;
}
</style>
