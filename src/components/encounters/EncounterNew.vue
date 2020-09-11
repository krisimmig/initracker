<template>
  <div class="EncounterNew">
    <h1>New Encounter</h1>
    <FormInput
      placeholder="name"
      label="New encounter name"
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
