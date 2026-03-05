<template>
  <div>
    <div class="CharacterArmorClass">
      <v-icon icon="mdi-shield" class="CharacterArmorClass-icon text-grey" />
      <p class="CharacterArmorClass-amount text-white">{{ armorClass }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  armorClass: number
}>()
</script>

<style>
:root {
  --width: 2.5em;
}


.CharacterArmorClass {
  position: relative;
  width: var(--width);
  height: var(--width);
  margin-right: .5em;
}

.CharacterArmorClass-amount {
  font-weight: 700;
  position: absolute;
  top: .6em;
  left: 0;
  width: 100%;
  text-align: center;
}

.CharacterArmorClass-icon {
  font-size: var(--width);
}
</style>
