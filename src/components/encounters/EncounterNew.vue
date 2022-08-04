<template>
  <div class="EncounterNew card shadow">
    <h4 class="h4">Create a new encounter</h4>
    <p>An encounter is a battle that your party has to survive to reach their goals in your campaign. You can prepare as many encounters here as you want and stat them whenever it fits into your narrative. </p>
    <FormInput
      class="mb-3 mt-3"
      placeholder="for example 'The burning planes'"
      label="Encounter name"
      v-model="encounterName"
      @keyup.enter="submitNewEncounter"
    />
    <Button is-success :disabled="this.encounterName === ''" @click="submitNewEncounter">Add encounter</Button>
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
