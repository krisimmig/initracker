<template>
  <div>
    <div class="CharacterArmorClass">
      <SvgIcon name="shield" class="CharacterArmorClass-icon text-gray-200" />
      <p class="CharacterArmorClass-amount text-gray-600">{{ armorClass }}</p>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';

import SvgIcon from '@/components/common/SvgIcon.vue';

@Component({
  components: {
    SvgIcon,
  },
})
export default class CharacterArmorClass extends Vue {
  @Prop({ required: true, type: Number }) private armorClass!: number;
}
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
