<template>
  <button
    class="Button"
    :class="{
      'Button--small': isSmall,
      'Button--big': isBig,
      'Button--secondary': isSecondary,
      'Button--danger': isDanger,
      'Button--success': isSuccess,
      'Button--normalCasing': isNormalCasing,
      'has-prefix': hasPrefix,
      'has-postfix': hasPostfix,
    }"
  >
    <span class="Button-prefix" v-if="hasPrefix" @click.prevent.stop="$emit('clickPrefix')">
      <slot name="prefix"></slot>
    </span>

    <span class="Button-content" @click.prevent.stop="handleContentClick">
      <slot></slot>
    </span>

    <span class="Button-postfix" v-if="hasPostfix" @click.prevent.stop="$emit('clickPostfix')">
      <slot name="postfix"></slot>
    </span>
  </button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Button extends Vue {
  @Prop({ required: false, default: false, type: Boolean }) public isSmall!: boolean;
  @Prop({ required: false, default: false, type: Boolean }) public isBig!: boolean;
  @Prop({ required: false, default: false, type: Boolean }) public isDanger!: boolean;
  @Prop({ required: false, default: false, type: Boolean }) public isSuccess!: boolean;
  @Prop({ required: false, default: false, type: Boolean }) public isSecondary!: boolean;
  @Prop({ required: false, default: false, type: Boolean }) public isNormalCasing!: boolean;
  @Prop({ required: false, type: String }) public href!: string;

  get hasPrefix() {
    return !!this.$slots.prefix;
  }

  get hasPostfix() {
    return !!this.$slots.postfix;
  }

  private handleContentClick() {
    if (this.href) {
      window.location.href = this.href;
    } else {
      this.$emit('click');
    }
  }
}
</script>

<style>
button,
.Button {
  @apply
  text-blue-100
  border-blue-300
  inline-block
  cursor-pointer
  rounded
  overflow-hidden
  transition
  duration-200
  ease-in-out
  text-xs
  font-semibold
  mb-1
  ml-2;
  text-decoration: none;
}

.Button-content {
  @apply py-1 px-2 bg-blue-600 inline-block;
}

.Button-prefix,
.Button-postfix {
  @apply py-1 px-2 bg-blue-400 inline-block;
}

button:disabled,
.Button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

button:first-of-type,
.Button:first-of-type {
  @apply ml-0;
}

.Button:not([disabled]):hover {
  @apply shadow-md;
}

.Button:not([disabled]) .Button-content:hover,
.Button:not([disabled]) .Button-postfix:hover,
.Button:not([disabled]) .Button-prefix:hover {
  @apply bg-blue-300 text-blue-600 shadow-md;
}

.Button--small {
  font-size: 0.7rem;
  font-weight: 600;
  border-radius: 3px;
}

.Button--big {
  @apply w-full mt-3;
}

.Button--big .Button-content {
  @apply w-full text-lg text-center ;
}

.Button--danger .Button-content {
  @apply bg-red-500 text-red-100 border-red-300;
}

.Button--danger:not([disabled]):hover .Button-content {
  @apply bg-red-300 text-red-600 border-red-500;
}

.Button--success .Button-content {
  @apply bg-green-500 text-green-100 border-green-300;
}

.Button--success:not([disabled]):hover .Button-content {
  @apply bg-green-300 text-green-600 border-green-500;
}

.Button--secondary .Button-content {
  @apply bg-gray-400 text-gray-600;
}

.Button--secondary:not([disabled]):hover .Button-content {
  @apply bg-gray-300 text-gray-600;
}

.Button a {
  text-decoration: none;
}
</style>
