<template>
  <div class="CharacterHealth">
    <div class="CharacterHealth-wrapper">
      <v-icon icon="mdi-heart" class="CharacterHealth-icon text-red" />
      <div class="CharacterHealth-hpWrapper">
        <p class="CharacterHealth-hp mb-0 text-white">{{ hp }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  uuid?: string
  hp: number
}>()
</script>

<style>
:root {
  --width: 2.5em;
}

.CharacterHealth-wrapper {
  position: relative;
  width: var(--width);
  height: var(--width);
}

.CharacterHealth-hpWrapper {
  position: absolute;
  align-items: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
}

.CharacterHealth-hp {
  font-weight: 700;
  text-align: center;
  width: 2.5em;
}

.CharacterHealth-icon {
  color: theme('colors.red.600');
  font-size: var(--width);
}
</style>
