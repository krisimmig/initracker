<template>
  <div>
    <div class="DialogueBox-bg" @click="$emit('cancel')"></div>

    <div class="DialogueBox">
      <div class="DialogueBox-content">
        <slot name="content"></slot>
      </div>
      <div class="DialogueBox-content">
        <slot name="actions"></slot>
        <button v-if="cancel" @click="$emit('cancel')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component
  export default class DialogueBox extends Vue {
    @Prop({ type: Boolean, default: true }) private cancel!: boolean;
  }
</script>

<style lang="scss">
.DialogueBox {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 50%;
  height: 50%;
  background: grey;
  border: 1px solid black;
  transform: translate(-50%, -50%);
  z-index: 1000;
  border-radius: 4px;
  padding: 20px;
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
