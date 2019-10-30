<template>
  <div>
    <p>Dashboard</p>
    <CharacterSheet />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import CharacterSheet from '../components/characters/CharacterSheet.vue';

@Component({
  components: { CharacterSheet },
})
export default class Dashboard extends Vue {}
</script>

<style>
</style>
