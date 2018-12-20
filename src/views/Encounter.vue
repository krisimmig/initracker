<template>
  <div>
    <NpcsList />
    <EncounterList />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import EncounterList from '../components/EncounterList.vue';
import NpcsList from '../components/NpcsList.vue';

@Component({
  components: { EncounterList, NpcsList },
})
export default class EncounterView extends Vue {

}
</script>

<style>
</style>
