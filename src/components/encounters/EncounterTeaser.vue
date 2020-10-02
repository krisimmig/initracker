<template>
  <div
    class="card card--interactive w-full"
  >
    <div @click="toEncounterView(id)" v-if="!isEditingName">
      <div class="flex justify-between">
        <p class="mb-2 font-semibold">{{ name }}</p>
        <p v-if="createdAt" class="text-sm mb-2 italic font-light text-gray-600">created {{ getReadableCreatedAt() }}</p>
      </div>

      <div>
        <Button @click.stop="deleteEncounter()" :is-danger="true">Delete</Button>
        <Button @click.stop="renameEncounter()">Rename</Button>
      </div>
    </div>

    <div v-if="isEditingName" class="Form">
      <FormInput label="Edit encounter name" v-model="newName" :placeholder="this.name" @keyup.enter="saveNewName" />
      <Button @click="isEditingName = false" :is-secondary="true">Cancel</Button>
      <Button @click="saveNewName">Save</Button>
    </div>
  </div>
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
