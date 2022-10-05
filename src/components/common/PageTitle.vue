<template>
  <div class="py-3">
    <h1 class="text-h4 text-md-h2 mb-0">{{ title }}</h1>
    <p class="text-subtitle-1" v-if="subtitle">{{ subtitle }}</p>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import PageTitle from '@/components/common/PageTitle.vue';

@Component({
  components: {
    PageTitle,
  },
})
export default class  extends Vue {
  @Prop({ required: true, type: String }) private title!: string;
  @Prop({ required: false, type: String }) private subtitle!: string;
}
</script>

<style lang="scss">
</style>
