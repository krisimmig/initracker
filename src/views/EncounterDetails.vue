<template>
  <div>
    <h1>Encounter Details</h1>
    <div class="IT-Flex">
      <div class="IT-Flex-20">
        <NpcsList :encounterId="$route.params.encounterId"/>
      </div>
      <div class="IT-Flex-grow">
        <Encounter :id="$route.params.encounterId" />
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';

import { NpcEntity } from '../store/npcsModule';
import * as encountersModule from '../store/encountersModule';
import Encounter from '../components/Encounter.vue';
import NpcsList from '../components/NpcsList.vue';

@Component({
  components: { Encounter, NpcsList },
})
export default class EncounterDetails extends Vue {

  public mounted() {
    encountersModule.dispatchFetchEncounters(this.$store);
  }
}
</script>

<style>
</style>
