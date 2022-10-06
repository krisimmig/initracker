<template>
  <v-card>
    <v-card-title>Create new encounter</v-card-title>
    <v-card-subtitle>a new encounter</v-card-subtitle>
    <v-card-text class="pb-0">
      <p class="text-body-1">An encounter is a battle that your party has to survive to reach their goals in your campaign. You can prepare as many encounters here as you want and stat them whenever it fits into your narrative. </p>
      <v-text-field
        label="Enter encounter name here..."
        v-model="encounterName"
        color="primary"
        @keyup.enter="submitNewEncounter"
        clearable
      >
        <v-icon slot="prepend">mdi-newspaper-plus</v-icon>
      </v-text-field>
    </v-card-text>

    <v-card-actions>
      <v-btn :disabled="this.encounterName === ''" @click="submitNewEncounter" plain>
        <v-icon left>mdi-plus</v-icon> Create encounter
      </v-btn>
    </v-card-actions>

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
