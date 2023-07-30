<template>
  <v-dialog v-model="dialog" :max-width="options.width" :style="{ zIndex: options.zIndex }" @keydown.esc="cancel">
    <v-card>
      <v-toolbar :color="options.color" dense flat>
        <v-toolbar-title class="white--text">{{ title }}</v-toolbar-title>
      </v-toolbar>
      <p v-show="!!message" class="pa-4">{{ message }}</p>
      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <v-btn color="primary darken-1" text @click.native="agree">Yes</v-btn>
        <v-btn color="grey" text @click.native="cancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Confirm extends Vue {
    dialog = false;
    resolve = (_) => {};
    reject = (_) => {};
    message = '';
    title= '';
    options = {
      color: 'primary',
      width: 290,
      zIndex: 200
    };

  open({ title = 'Are you sure?', message = '', options = {} }: { title?: string, message: string, options?: {} }) {
    this.dialog = true;
    this.title = title;
    this.message = message;
    this.options = Object.assign(this.options, options)
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    })
  }

  agree() {
    this.resolve(true);
    this.dialog = false;
  }

  cancel() {
    this.resolve(false);
    this.dialog = false;
  }
}
</script>