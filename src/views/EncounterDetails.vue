<template>
  <div class="flex mx-4">
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
          <CharacterLibrary
              :encounterId="$route.params.encounterId"
              @characterClicked="handleCharClicked"
              buttonText="Add"
          />
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
      <div class="mt-4">
        <div class="u-scrollBoxParent bg-white shadow">
          <div class="u-scrollBoxChild">
            <CharacterDetails v-if="selectedCharacter" :characterData="selectedCharacter" />
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
  dispatchFetchEncounterById, dispatchAddNpcToEncounter,
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

  public handleCharClicked(npcData) {
    if (!this.$route.params.encounterId) { return; }
    dispatchAddNpcToEncounter(this.$store, {
      npcData: Object.assign({}, npcData),
      encounterId: this.$route.params.encounterId,
    });
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
  @apply flex mt-4;
}

.EncounterDetails-tab {
  @apply
    bg-blue-300
    text-blue-600
    cursor-pointer
    transition
    duration-200
    mr-1
    mb-0
    text-xs
    uppercase
    font-semibold
    inline-block;
  border: 1px solid theme('colors.blue.400');
  border-bottom: 0;
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
  padding: 4px 16px;
}

.EncounterDetails-tab:hover,
.EncounterDetails-tab.is-active {
  @apply text-blue-100 bg-blue-600;
}
</style>
