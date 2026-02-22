<template>
  <div>
    <div class="CharacterArmorClass">
      <SvgIcon name="shield" class="CharacterArmorClass-icon text-grey" />
      <p class="CharacterArmorClass-amount text-white">{{ armorClass }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/common/SvgIcon.vue'

defineProps<{
  armorClass: number
}>()
</script>

<style lang="scss">
$width: 2.5em;

.CharacterArmorClass {
  position: relative;
  width: $width;
  height: $width;
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
  font-size: $width;
}
</style>
