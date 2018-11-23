<template>
  <p>Character Sheet Comp</p>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class CharacterSheet extends Vue {}
</script>

<style>
.CharacterSheet {
  border: 1px solid grey;
  padding: 16px;
  margin-bottom: 16px;
}
</style>
