<template>
  <div class="EncounterOverview-item">
    <div v-if="!isEditingName">
      <p
        @click="toEncounterView(id)"
      >
        {{ name }}
      </p>

      <button
        class="IT-Button IT-Button--secondary"
        @click.prevent="deleteEncounter()"
      >
        Delete
      </button>
      <button
        class="IT-Button"
        @click.prevent="renameEncounter()"
      >
        Rename
      </button>
    </div>

    <div v-else>
      <input
        type="text"
        v-model="newName"
        :placeholder="this.name"
        @keyup.enter="saveNewName"
      >
      <button class="IT-Button" @click="saveNewName">Save</button>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

import { dispatchRemoveEncounter, dispatchUpdateName } from '@/store/encountersModule';
import { IEncounterEntity } from '@/types/encounters';

@Component
export default class Encounter extends Vue {
  @Prop(String) public id!: string;
  @Prop(String) public name!: string;
  @Prop(Array) public npcs!: IEncounterEntity[];

  private isEditingName: boolean = false;
  private newName: string = '';

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
      this.newName = '';
      this.isEditingName = false;
    });
  }

  public renameEncounter() {
    this.isEditingName = !this.isEditingName;
  }
}
</script>

<style>
.EncounterOverview-item {
  border: 1px solid grey;
  margin-bottom: 20px;
  padding: 20px;
}

.EncounterOverview-item:hover {
  cursor: pointer;
  background-color: rgb(219, 219, 219);
}
</style>
