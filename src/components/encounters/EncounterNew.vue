<template>
  <v-card>
    <v-card-title>Create new encounter</v-card-title>
    <v-card-text  class="text-body-1">
      <p>
        An encounter is a battle that your party has to survive to reach their goals in your campaign.<br />
      </p>
      <p>
        You can prepare as many encounters here as you want and stat them whenever it fits into your narrative.
      </p>
      <v-text-field
        label="Encounter name..."
        v-model="encounterName"
        color="primary"
        @keyup.enter="submitNewEncounter"
        clearable
      >
        <v-icon slot="prepend">mdi-newspaper-plus</v-icon>
      </v-text-field>
      <v-btn
        color="primary"
        :disabled="!this.encounterName"
        @click="submitNewEncounter"
      >
        <v-icon left>mdi-plus</v-icon> Create encounter
      </v-btn>
    </v-card-text>
  </v-card>
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
