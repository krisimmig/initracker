<template>
  <div class="mb-3">
    <v-card
      hover
      v-if="!isEditingName"
      @click="toEncounterView(id)"
    >
      <div>
        <v-card-title>{{ name }}</v-card-title>
        <v-card-subtitle>created {{ getReadableCreatedAt() }} | Rounds played: {{ round }}</v-card-subtitle>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            icon
            @click.stop="renameEncounter()"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>

          <v-btn
            icon
            color="error"
            @click.stop="deleteEncounter()"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>

    <v-card v-if="isEditingName">
      <v-card-text>
        <v-text-field
            label="Edit encounter name"
            hide-details="auto"
            @keyup.enter="saveNewName"
            v-model="newName"
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click.stop="isEditingName = false" text>
          Cancel
        </v-btn>
        <v-btn @click="saveNewName" text color="primary">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

import { dispatchRemoveEncounter, dispatchUpdateName } from '@/store/encountersModule';

@Component({
  components: {
  },
})
export default class EncounterTeaser extends Vue {
  @Prop({ type: String, required: true }) public id!: string;
  @Prop({ type: String, required: true }) public name!: string;
  @Prop({ type: Number, required: false }) public round!: number;
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
