<template>
  <div>
    <div class="DialogueBox-bg" @click.prevent="$emit('cancel')"></div>

    <div class="DialogueBox flex flex-col">
      <div class="DialogueBox-content flex-grow">
        <div class="bg-gray-200 text-center p-4" v-if="title">
          <h3 class="mb-0 text-light">{{ title }}</h3>
        </div>

        <div class="p-4">
          <slot name="content"></slot>
        </div>

      </div>

      <div class="DialogueBox-content flex justify-end p-4">
        <slot name="actions"></slot>
        <Button
          is-secondary
          v-if="cancel" @click="$emit('cancel')"
        >
          Cancel
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import Button from '@/components/common/Button.vue';

  @Component({
    components: {Button},
  })
  export default class DialogueBox extends Vue {
    @Prop({ type: Boolean, default: true }) private cancel!: boolean;
    @Prop({ type: String, default: '' }) private title!: string;
  }
</script>

<style lang="scss">
.DialogueBox {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 50%;
  min-height: 50%;
  border: 1px solid theme('colors.gray.200');
  transform: translate(-50%, -50%);
  z-index: 1000;
  border-radius: 4px;
  cursor: default;
  @apply shadow-lg bg-white;
}

.DialogueBox-bg {
  cursor: default;
  z-index: 900;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(4px);
  content: '';
}
</style>
