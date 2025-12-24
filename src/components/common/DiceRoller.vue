<template>
  <v-chip
    small
    label
    outlined
    color="primary"
    class="DiceRoller px-1 mx-1 px-3"
    @click.stop="roll"
  >
    <v-icon x-small left>mdi-dice-multiple</v-icon>
    {{ notation }}
  </v-chip>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { DiceRoll } from '@dice-roller/rpg-dice-roller';

@Component
export default class DiceRoller extends Vue {
  @Prop({ type: String, required: true }) public notation!: string;

  public roll(): void {
    try {
      const normalizedNotation = this.notation.replace(/[\u2013\u2014]/g, '-');
      const result = new DiceRoll(normalizedNotation);
      this.$toast(`Rolled ${this.notation}: <strong>${result.total}</strong> (${result.output})`, {
        x: 'right',
        y: 'bottom',
        timeout: 500000,
        showClose: true,
      });
    } catch (e) {
      console.error('Invalid dice notation:', this.notation);
    }
  }
}
</script>

<style scoped lang="scss">
.DiceRoller {
  cursor: pointer;
  height: 20px;
  vertical-align: middle;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--v-primary-lighten5);
  }
}
</style>
