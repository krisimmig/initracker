<template>
  <v-row>
    <v-col>
      <CharacterDetails v-if="activeCharacter" :characterData="activeCharacter"/>
    </v-col>

    <v-col cols="6">
      <EncounterList :id="$route.params.encounterId" />
    </v-col>

    <v-col>
      <CharacterDetails v-if="selectedCharacter" :characterData="selectedCharacter" />
      <v-alert
        v-else
        dense
        outlined
        type="info"
        class="mt-8"
      >
        Click on a <b>character name</b> to see details here.
      </v-alert>
    </v-col>
  </v-row>
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

</style>
