<template>
  <div class="IT-Flex">
    <div>

      <h1>Encounter Overview</h1>
      <ul>
        <li
          v-for="encounter in encounters"
          :key="encounter.id"
          class="EncounterOverview-item"
        >
          <p @click="toEncounterView(encounter.id)">
            {{ encounter.name }} -- (Size: {{ encounterSize(encounter)  }})
          </p>
          <button
            class="IT-Button IT-Button--secondary"
            @click.prevent="deleteEncounter(encounter.id)"
          >
            Delete
          </button>
        </li>
      </ul>
    </div>

    <div class="IT-Flex-40">
      <EncounterNew />
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';

import { NpcEntity } from '../store/npcsModule';
import * as encountersModule from '../store/encountersModule';
import EncounterNew from '../components/EncounterNew.vue';

@Component({
  components: { EncounterNew },
})
export default class Encounters extends Vue {

  get encounters(): encountersModule.EncounterEntity[] {
    return encountersModule.readGetEncounters(this.$store);
  }

  public encounterSize(encounter: encountersModule.EncounterEntity) {
    return encounter.npcs ? encounter.npcs.length : 0;
  }

  public toEncounterView(encounterId: string) {
    this.$router.push({ name: 'encounterDetails', params: { encounterId } });
  }

  public deleteEncounter(encounterId: string) {
    console.log('delete encouter', encounterId);
    encountersModule.dispatchRemoveEncounter(this.$store, {
      encounterId,
    });
  }

  public mounted() {
    encountersModule.dispatchFetchEncounters(this.$store);
  }
}
</script>

<style>
.EncounterOverview-item {
  border: 1px solid grey;
  margin-bottom: 20px;
  padding: 20px;
}

.EncounterOverview-item:hover {
  cursor: pointer;
  background-color: rgb(219, 219, 219);
}
</style>
