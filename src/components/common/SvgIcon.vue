<template>
  <span
    :class="className"
    :title="iconTitle"
    v-html="svgContent"
  ></span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import heartSvg from '@/assets/icons/heart.svg?raw'
import shieldSvg from '@/assets/icons/shield.svg?raw'
import logoSvg from '@/assets/icons/logo.svg?raw'
import plusSvg from '@/assets/icons/plus.svg?raw'
import chevronSvg from '@/assets/icons/chevron.svg?raw'

const svgMap: Record<string, string> = {
  heart: heartSvg,
  shield: shieldSvg,
  logo: logoSvg,
  plus: plusSvg,
  chevron: chevronSvg,
}

const props = withDefaults(defineProps<{
  name?: string
}>(), {
  name: 'placeholder',
})

const svgContent = computed(() => svgMap[props.name] ?? '')
const className = computed(() => `SvgIcon SvgIcon--${props.name}`)
const iconTitle = computed(() => `${props.name} icon`)
</script>

<style>
.SvgIcon {
  fill: currentColor;
  display: inline-block;
  height: 1em;
  width: 1em;
}

.SvgIcon svg {
  fill: currentColor;
  height: 1em;
  width: 1em;
}
</style>
