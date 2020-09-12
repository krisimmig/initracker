<template>
  <div class="bg-gray-300 mb-6">
    <div class="u-container-fluid">
      <div class="PageTitle py-3">
        <h1 class="h3 inline-block mr-4 mb-0">{{ title }}</h1>
        <p class="inline italic text-gray-600" v-if="subtitle">{{ subtitle }}</p>
      </div>
    </div>
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
