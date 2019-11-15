<template>
  <div class="NpcArmorClass">
    <SvgIcon name="shield" class="NpcArmorClass-icon" />
    <div class="NpcArmorClass-amount">{{ armorClass }}</div>
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
export default class NpcArmorClass extends Vue {
  @Prop({ required: true, type: Number }) private armorClass!: number;
}
</script>

<style lang="scss">
@import '@/scss/variables.scss';

$width: 2.5em;

.NpcArmorClass {
  position: relative;
  width: $width;
  height: $width;
  margin-right: .5em;
}

.NpcArmorClass-amount {
  font-weight: 700;
  position: absolute;
  top: .6em;
  left: 0;
  width: 100%;
  text-align: center;
}

.NpcArmorClass-icon {
  color: $color-3;
  font-size: $width;
}
</style>