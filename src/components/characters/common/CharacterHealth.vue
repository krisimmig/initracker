<template>
  <div class="CharacterHealth">
    <div class="CharacterHealth-wrapper">
      <SvgIcon name="heart" class="CharacterHealth-icon" />
      <div class="CharacterHealth-hpWrapper">
        <p class="CharacterHealth-hp">{{ hp }}</p>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';

import DialogueBox from '@/components/common/DialogueBox.vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { readGetEncountersCurrentId } from '@/store/encountersModule';
import { dispatchUpdateHitPointCurrent } from '@/store/npcsModule';

@Component({
  components: {
    SvgIcon,
  },
})
export default class CharacterHealth extends Vue {
  @Prop({ type: String }) private uuid!: string;
  @Prop({ type: Number, required: true }) private hp!: number;
}
</script>

<style lang="scss">
$width: 2.5em;

.CharacterHealth-wrapper {
  position: relative;
  width: $width;
  height: $width;
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
  color: deeppink;
  font-size: $width;
}
</style>
