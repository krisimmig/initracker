<template>
  <div class="PageTitle">
    <h1 class="PageTitle-title">{{ title }}</h1>
    <p class="PageTitle-subtitle" v-if="subtitle">{{ subtitle }}</p>
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
@import '@/scss/variables.scss';

.PageTitle {
  margin-bottom: 3rem;
  margin-top: 3rem;
}

.PageTitle-title {
  margin-bottom: 0.3em;
}

.PageTitle-subtitle {
  margin-top: 0;
  font-style: italic;
  color: $color-6;
}

</style>