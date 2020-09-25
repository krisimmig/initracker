<template>
  <div>
    <div class="DialogueBox-bg" @click="$emit('cancel')"></div>

    <div class="DialogueBox flex flex-col">
      <div class="DialogueBox-content flex-grow">
        <h4 v-if="title">{{ title }}</h4>
        <slot name="content"></slot>
      </div>
      <div class="DialogueBox-content flex justify-end">
        <slot name="actions"></slot>
        <button class="Button Button--secondary" v-if="cancel" @click="$emit('cancel')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component
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
  height: 50%;
  background: white;
  border: 1px solid theme('colors.gray.600');
  transform: translate(-50%, -50%);
  z-index: 1000;
  border-radius: 4px;
  padding: 20px;
  @apply shadow-lg;
}

.DialogueBox-bg {
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
