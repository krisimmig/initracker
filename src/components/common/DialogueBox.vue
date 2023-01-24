<!-- <ConfirmBox :text="`Are you sure you want to delete ${name}?`" @confirmation="confirmationHandler" />-->

<template>
  <v-dialog
      v-model="dialog"
      :max-width="options.width"
      :style="{ zIndex: options.zIndex }"
      @keydown.esc="cancel"
  >
    <v-card>
      <v-toolbar dark :color="options.color" dense flat>
        <v-toolbar-title class="text-body-2 font-weight-bold grey--text">
          {{ title }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text
          v-show="!!message"
          class="pa-4 black--text"
          v-html="message"
      ></v-card-text>
      <v-card-actions class="pt-3">
        <v-spacer></v-spacer>
        <v-btn
            v-if="!options.noconfirm"
            color="grey"
            text
            class="body-2 font-weight-bold"
            @click.native="cancel"
        >Cancel</v-btn
        >
        <v-btn
            color="primary"
            class="body-2 font-weight-bold"
            outlined
            @click.native="agree"
        >OK</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang='ts'>
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import Button from '@/components/common/Button.vue';

  @Component({
    components: {Button},
  })
  export default class DialogueBox extends Vue {
    public dialog = false
    public resolve: null
    public reject: null
    public message: null
    public title: null
    options: {
      color: "grey lighten-3",
      width: 400,
      zIndex: 200,
      noconfirm: false
    }

    public created() {
      window.addEventListener("keyup", this.keyupHandler);
    }

    public keyupHandler(event) {
      if(event.key === "Escape") {
        window.removeEventListener("keyup", this.keyupHandler);
        this.$emit("cancel");
      }
    }
  }
</script>

<style lang="scss">
.DialogueBox {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 50%;
  min-height: 50vh;
  max-height: 90vh;
  border: 1px solid theme('colors.gray.200');
  transform: translate(-50%, -50%);
  z-index: 1000;
  border-radius: 4px;
  cursor: default;
  @apply shadow-lg bg-white;
}

.DialogueBox.is-wide {
  width: 75%;
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
