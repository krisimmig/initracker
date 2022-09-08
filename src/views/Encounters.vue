<template>
  <div class="Encounters">
    <PageTitle title="Encounters list" subtitle="These are all your encounters." />

    <v-row>
      <v-col>
        <ul v-if="encounters.length > 0" class="Encounters-list">
          <li
            v-for="encounter in encounters"
            :key="encounter.id"
          >
            <EncounterTeaser v-bind="encounter" />
          </li>
        </ul>
        <p v-else class="u-tip">Nothing here yet, please create a new encounter on the right</p>
      </v-col>

      <v-col>
        <EncounterNew />
      </v-col>
    </v-row>
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
ul.Encounters-list {
  list-style: none;
  padding-left: 0;
}
</style>
