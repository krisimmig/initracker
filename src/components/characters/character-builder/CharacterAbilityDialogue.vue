<template>
  <v-dialog max-width="600px" v-model="dialog">
    <template v-slot:activator="{ on, attrs }">
      <div
          v-bind="attrs"
          v-on="on"
      >
        <slot name="button"></slot>
      </div>
    </template>

    <v-card>
      <v-card-title>
        <span class="headline" v-if="!ability.new">Update ability</span>
        <span class="headline" v-else>Add a new ability</span>
      </v-card-title>
      <v-card-text>
          <v-text-field v-model="name" label="Ability name" />
          <v-textarea v-model="desc" label="Ability description" />
      </v-card-text>
      <v-card-actions>
        <v-btn
            v-if="!ability.new"
            text
            color="error"
            @click="remove"
        >
          Delete
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn text @click="cancel" color="primary">
          Cancel
        </v-btn>
        <v-btn text @click="save" color="primary" :disabled="!name || !desc">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class CharacterAbilityDialogue extends Vue {
  dialog = false;
  name = '';
  desc = '';

  @Prop({ default: () => ({ name: '', desc: '', new: true }) }) public ability;

  private mounted() {
    this.name = this.ability.name;
    this.desc = this.ability.desc;
  }

  cancel() {
    this.dialog = false;
  }

  reset() {
    this.name = '';
    this.desc = '';
  }

  save() {
    this.dialog = false;
    this.$emit('change', {
      name: this.name,
      desc: this.desc,
      new: !!this.ability.new,
    });

    this.reset();
  }

  remove() {
    const options = {
      message: 'Are you sure you want to delete this ability?',
      options: {
        color: 'error',
      },
    };
    this.$root.$confirm(options).then((result) => {
      if(result) {
        this.dialog = false;
        this.$emit('change', {
          remove: true,
        });
      }
    })
  }
}
</script>
