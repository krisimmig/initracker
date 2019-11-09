<template>
  <div class="u-maxWidth">

    <h1>Encounter Overview</h1>
    <div class="u-flex">
      <div>
        <ul>
          <li
            v-for="encounter in encounters"
            :key="encounter.id"
          >
            <EncounterTeaser v-bind="encounter" />
          </li>
        </ul>
      </div>

      <div class="u-flex-40">
        <EncounterNew />
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';

import { IEncounterEntity } from '@/types/encounters';
import * as encountersModule from '../store/encountersModule';
import EncounterNew from '@/components/encounters/EncounterNew.vue';
import EncounterTeaser from '@/components/encounters/EncounterTeaser.vue';

@Component({
  components: { EncounterNew, EncounterTeaser },
})
export default class Encounters extends Vue {

  get encounters(): IEncounterEntity[] {
    return encountersModule.readGetEncountersAll(this.$store);
  }

  public mounted() {
    encountersModule.dispatchFetchEncounters(this.$store);
  }
}
</script>

<style>
</style>
