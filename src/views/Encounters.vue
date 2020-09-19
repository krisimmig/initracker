<template>
  <div class="">
    <PageTitle title="Ecounters list" subtitle="These are all your encounters." />

    <div class="u-container-fluid">
      <div class="flex">
      <div class="w-1/2 mr-4 bg-white shadow">
        <ul
            v-if="encounters.length > 0"
            class="divide-y divide-gray-300 border-b"
        >
          <li
            v-for="encounter in encounters"
            :key="encounter.id"
          >
            <EncounterTeaser v-bind="encounter" />
          </li>
        </ul>
        <p v-else class="u-tip">Nothing here yet, please create a new encounter on the right</p>
      </div>

      <div class="w-5/12">
        <EncounterNew />
      </div>
    </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';

import { IEncounterEntity } from '@/types/encounters';
import { readGetEncountersAll, dispatchFetchEncounters } from '@/store/encountersModule';
import EncounterNew from '@/components/encounters/EncounterNew.vue';
import EncounterTeaser from '@/components/encounters/EncounterTeaser.vue';
import PageTitle from '@/components/common/PageTitle.vue';

@Component({
  components: {
    EncounterNew,
    EncounterTeaser,
    PageTitle,
  },
})
export default class Encounters extends Vue {

  get encounters(): IEncounterEntity[] {
    return readGetEncountersAll(this.$store);
  }

  public mounted() {
    dispatchFetchEncounters(this.$store);
  }
}
</script>

<style>
</style>
