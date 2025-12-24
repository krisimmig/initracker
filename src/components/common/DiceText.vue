<template>
  <span>
    <template v-for="(part, index) in parsedParts">
      <DiceRoller
        v-if="part.isDice"
        :key="index"
        :notation="part.text"
      />
      <span v-else :key="index">{{ part.text }}</span>
    </template>
  </span>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import DiceRoller from './DiceRoller.vue';

interface TextPart {
  text: string;
  isDice: boolean;
}

@Component({
  components: {
    DiceRoller,
  },
})
export default class DiceText extends Vue {
  @Prop({ type: String, required: true }) public text!: string;

  // Regex to match dice notations like 2d4+1, 1d20, 1d4 — 1, etc.
  private diceRegex: RegExp = /(\b\d+d\d+(?:\s*[+\-\u2013\u2014]\s*\d+)?\b)/gi;

  get parsedParts(): TextPart[] {
    if (!this.text) return [];

    const parts: TextPart[] = [];
    const splitText = this.text.split(this.diceRegex);

    splitText.forEach((part) => {
      if (part.match(this.diceRegex)) {
        parts.push({ text: part, isDice: true });
      } else if (part !== '') {
        parts.push({ text: part, isDice: false });
      }
    });

    return parts;
  }
}
</script>
