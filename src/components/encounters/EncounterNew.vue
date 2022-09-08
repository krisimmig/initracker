<template>
  <div class="EncounterNew card shadow">
    <h4 class="h4">Create a new encounter</h4>
    <p>An encounter is a battle that your party has to survive to reach their goals in your campaign. You can prepare as many encounters here as you want and stat them whenever it fits into your narrative. </p>
    <v-text-field
      label="Encounter name"
      v-model="encounterName"
      @keyup.enter="submitNewEncounter"
    />
    <v-btn :disabled="this.encounterName === ''" @click="submitNewEncounter">
      <v-icon left>mdi-plus</v-icon> Add encounter</v-btn>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import { dispatchAddNewEncounter } from '@/store/encountersModule';
import FormInput from '@/components/form/FormInput.vue';
import Button from '@/components/common/Button.vue';

@Component({
  components: {
    Button,
    FormInput,
  },
})
export default class EncounterNew extends Vue {
  public encounterName: string = '';

  public submitNewEncounter(): void {
    if (this.encounterName === '') {
      return;
    }

    dispatchAddNewEncounter(this.$store, {
      encounterName: this.encounterName,
    });
    this.encounterName = '';
  }
}
</script>

<style>
</style>
