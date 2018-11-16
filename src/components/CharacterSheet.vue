<template>
  <div class="CharacterSheet">
    <p>Name: {{ name }}</p>
    <p>Level: {{ level }}</p>
    <p>HP: {{ health }}</p>
    <p>Class: {{ characterClass }}</p>
    <p><small>{{ id }}</small></p>
    <button @click="editing = !editing">Edit</button>

    <CharacterEdit
      v-if="editing"
      :characterData="characterData"
      @saved="editing = false"
    />
  </div>
</template>

<script>
import CharacterEdit from "./CharacterEdit";

export default {
  components: {
    CharacterEdit
  },

  props: {
    id: String,
    name: String,
    level: {
      type: Number,
      required: false,
      default: 0
    },
    health: {
      type: Number,
      required: false,
      default: 0
    },
    characterClass: {
      type: String,
      required: false,
      default: "Not set"
    }
  },

  data() {
    return {
      editing: false
    };
  },

  computed: {
    characterData() {
      return {
        id: this.id,
        name: this.name,
        level: this.level,
        health: this.health,
        characterClass: this.characterClass
      };
    }
  }
};
</script>

<style>
.CharacterSheet {
  border: 1px solid grey;
  padding: 16px;
  margin-bottom: 16px;
}
</style>
