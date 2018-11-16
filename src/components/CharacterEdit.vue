<template>
  <div class="CharacterEdit">
    <input type="text" v-model="name" @keyup.enter="save">
    <input type="number" v-model="level" @keyup.enter="save">
    <input type="number" v-model="health" @keyup.enter="save">
    <input type="text" v-model="characterClass" @keyup.enter="save">
    <button @click="save">Save</button>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: {
    characterData: Object
  },

  data() {
    return {
      name: this.characterData.name,
      characterClass: this.characterData.characterClass,
      level: this.characterData.level,
      health: this.characterData.health,
      id: this.characterData.id
    };
  },

  methods: {
    ...mapActions("charactersData", ["update"]),

    save() {
      this.update({
        id: this.id,
        name: this.name,
        characterClass: this.characterClass,
        level: this.level,
        health: this.health
      });
      this.$emit("saved");
    }
  }
};
</script>

<style>
</style>
