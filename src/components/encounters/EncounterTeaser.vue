<template>
  <div
    class="card card--interactive w-full"
  >
    <div @click="toEncounterView(id)" v-if="!isEditingName">
      <p class="mb-2 font-semibold">{{ name }}</p>

      <div>
        <button @click.stop="deleteEncounter()" class="Button--secondary">Delete</button>
        <button @click.stop="renameEncounter()">Rename</button>
      </div>
    </div>

    <div v-if="isEditingName" class="Form">
      <FormInput label="Edit encounter name" v-model="newName" :placeholder="this.name" @keyup.enter="saveNewName" />
      <button @click="isEditingName = false" class="Button--secondary">Cancel</button>
      <button @click="saveNewName">Save</button>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

import { dispatchRemoveEncounter, dispatchUpdateName } from '@/store/encountersModule';
import { IEncounterEntity } from '@/types/encounters';
import FormInput from '@/components/form/FormInput.vue';

@Component({
  components: {
    FormInput,
  },
})
export default class EncounterTeaser extends Vue {
  @Prop({ type: String, required: true }) public id!: string;
  @Prop({ type: String, required: true }) public name!: string;
  @Prop({ type: Array, required: true }) public npcs!: IEncounterEntity[];

  private isEditingName: boolean = false;
  private newName: string = this.name;

  public encounterSize(): number {
    return this.npcs ? this.npcs.length : 0;
  }

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
}
</script>

<style>
</style>
