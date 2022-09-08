<template>
  <v-card class="mb-3">
    <div v-if="!isEditingName">
      <v-card-title @click="toEncounterView(id)">{{ name }}</v-card-title>
      <v-card-subtitle>created {{ getReadableCreatedAt() }}</v-card-subtitle>

      <v-card-actions>
        <v-btn
          text
          @click="renameEncounter()"
        >
          Rename
        </v-btn>

        <v-btn
          text
          color="error"
          @click="deleteEncounter()"
        >
          Delete
        </v-btn>
      </v-card-actions>
    </div>

    <div v-if="isEditingName" class="Form">
      <FormInput label="Edit encounter name" v-model="newName" :placeholder="this.name" @keyup.enter="saveNewName" />
      <Button @click="isEditingName = false" is-secondary>Cancel</Button>
      <Button @click="saveNewName">Save</Button>
    </div>
  </v-card>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

import { dispatchRemoveEncounter, dispatchUpdateName } from '@/store/encountersModule';
import { IEncounterEntity } from '@/types/encounters';
import FormInput from '@/components/form/FormInput.vue';
import Button from '@/components/common/Button.vue';

@Component({
  components: {
    Button,
    FormInput,
  },
})
export default class EncounterTeaser extends Vue {
  @Prop({ type: String, required: true }) public id!: string;
  @Prop({ type: String, required: true }) public name!: string;
  @Prop({ type: Number, required: false }) public createdAt!: number;

  private isEditingName: boolean = false;
  private newName: string = this.name;

  public toEncounterView(encounterId: string) {
    this.$router.push({ name: 'encounterDetails', params: { encounterId: this.id } });
  }

  public deleteEncounter() {
    dispatchRemoveEncounter(this.$store, {
      encounterId: this.id,
    });
  }

  public saveNewName() {
    dispatchUpdateName(this.$store, {
      encounterId: this.id,
      newName: this.newName,
    }).then(() => {
      this.isEditingName = false;
    });
  }

  public renameEncounter() {
    this.isEditingName = !this.isEditingName;
  }

  public getReadableCreatedAt() {
    if (!this.createdAt) {
      return false;
    }
    const date = new Date(this.createdAt);
    return `${ date.toLocaleDateString() } ${ date.toLocaleTimeString() }`;
  }
}
</script>

<style>
</style>
