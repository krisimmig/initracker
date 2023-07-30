import Vue from 'vue';
import Confirm from "@/components/common/Confirm.vue";

declare module 'vue/types/vue' {
  interface Vue {
    $confirm: any;
  }
}
