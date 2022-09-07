<template>
  <div class="flex mx-4">
    <div class="EncounterDetails-sideColumn flex flex-col">
      <div class="EncounterDetails-sideBarTitles">
        <p class="EncounterDetails-tab is-active">
          Active character
        </p>
      </div>

      <div class="EncounterDetails-npcsList">
        <div class="u-scrollBoxParent shadow bg-white">
          <div class="u-scrollBoxChild">
            <CharacterDetails v-if="activeCharacter" :characterData="activeCharacter"/>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col flex-grow mx-3">
      <EncounterList :id="$route.params.encounterId" />
      <button @click="showCharacterLibrary = true">Add</button>
      <DialogueBox
          v-if="showCharacterLibrary"
          @cancel="showCharacterLibrary = false"
          title="Add Character"
          is-wide
      >
        <template v-slot:content>
          <CharacterLibrary
              :encounterId="$route.params.encounterId"
              @characterClicked="handleCharClicked"
              buttonText="Add"
          />
        </template>
      </DialogueBox>
    </div>

    <div class="EncounterDetails-sideColumn flex flex-col">
      <div class="EncounterDetails-sideBarTitles">
        <p class="EncounterDetails-tab is-active">
          Selected character
        </p>
      </div>

      <div class="">
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
import DialogueBox from "@/components/common/DialogueBox.vue";

@Component({
  components: {
    EncounterList,
    CharacterLibrary,
    CharacterDetails,
    DialogueBox,
  },
})
export default class EncounterDetails extends Vue {
  public showCharacterLibrary: boolean = false;

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
    bg-gray-100
    bg-gray-600
    mr-1
    mb-0
    text-xs
    uppercase
    inline-block;
  border-bottom: 0;
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
  padding: 4px 16px;
}

.EncounterDetails-tab:hover,
.EncounterDetails-tab.is-active {
  @apply text-gray-500 bg-gray-100;
}

.EncounterDetails-npcsList .CharactersLibrary-scrollBox {
  height: calc(100vh - 276px);
}
</style>
