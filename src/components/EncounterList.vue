<template>
  <div>
    <p>Encounter List</p>
    <ul>
      <li v-for="encounter in encounters" :key="encounter.id">
        <Encounter :id="encounter.id" />
      </li>
    </ul>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';

import { INpc } from '../store/npcsModule';
import * as encountersModule from '../store/encountersModule';
import Encounter from './Encounter.vue';

@Component({
  components: { Encounter },
})
export default class EncounterList extends Vue {
  public showNpcsInEncounter: boolean = false;

  get encounters(): encountersModule.IEncounter[] {
    return encountersModule.readGetEncounters(this.$store);
  }

  public mounted() {
    encountersModule.dispatchFetchEncounter(this.$store);
  }
}
</script>

<style>
</style>
