<template>
  <div class="u-maxWidth">
    <PageTitle title="Ecounters list" subtitle="These are all oyur encounters." />
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
