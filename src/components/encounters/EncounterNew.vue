<template>
  <div class="EncounterNew card shadow">
    <h4>Create a new encounter</h4>
    <p>An encounter is a battle that your party has to survive to reach there goals in your campaign. You can prepare as many encounters here as you want and stat them whenever it fits into your narrative. </p>
    <FormInput
      class="mb-3"
      placeholder="enter a name here..."
      label="Encounter name"
      v-model="encounterName"
      @keyup.enter="submitNewEncounter"
    />
    <button @click="submitNewEncounter">Save</button>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import { dispatchAddNewEncounter } from '@/store/encountersModule';
import FormInput from '@/components/form/FormInput.vue';

@Component({
  components: {
    FormInput,
  },
})
export default class EncounterNew extends Vue {
  public encounterName: string = '';

  public submitNewEncounter(): void {
    dispatchAddNewEncounter(this.$store, {
      encounterName: this.encounterName,
    });
    this.encounterName = '';
  }
}
</script>

<style>
</style>
