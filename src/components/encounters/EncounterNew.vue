<template>
  <div class="EncounterNew">
    <h1>New Encounter</h1>
    <input
      type="text"
      placeholder="name"
      v-model="encounterName"
      @keyup.enter="submitNewEncounter"
      />
    <button @click="submitNewEncounter">Save</button>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import * as npcsModule from '../../store/npcsModule';
import * as encountersModule from '@/store/encountersModule';

@Component
export default class EncounterNew extends Vue {
  public encounterName: string = '';

  public submitNewEncounter(): void {
    encountersModule.dispatchAddNewEncounter(this.$store, {
      encounterName: this.encounterName,
    });
    this.encounterName = '';
  }
}
</script>

<style>
</style>
