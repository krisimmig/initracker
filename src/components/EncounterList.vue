<template>
  <div>
    <p>Encounter List</p>
    <ul>
      <li
        v-for="encounter in encounters"
        :key="encounter.id"
        @click="loadNpcs(encounter.id)"
      >
        {{ encounter.name }} -- ({{ encounter.id }})
        <ul>
          <li v-for="npc in encoubnterNpcs(encounter.id)" :key="npc.id">
            {{ npc.name }} -- ({{ npc.id }})
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import { INpc } from '../store/npcsModule';

import * as encountersModule from '../store/encountersModule';

@Component
export default class EncounterList extends Vue {
  get encounters(): encountersModule.IEncounter[] {
    return encountersModule.readGetEncounters(this.$store);
  }

  public encoubnterNpcs(id: string): INpc[] {
    return encountersModule.readGetEncounterNpcs(this.$store)(id);
  }

  public mounted() {
    encountersModule.dispatchFetchEncounter(this.$store);
  }

  public loadNpcs(id: string) {
    encountersModule.dispatchFetchNpcsForEncounter(this.$store, id);
  }
}
</script>

<style>
</style>
