<template>
  <div>
    <p>Encounter Comp</p>
    <EncounterList />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import EncounterList from '../components/EncounterList.vue';

@Component({
  components: { EncounterList },
})
export default class Encounter extends Vue {}
</script>

<style>
</style>
