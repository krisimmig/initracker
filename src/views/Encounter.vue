<template>
  <div>
    <p>Encounter Comp</p>
    <NpcsList />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import NpcsList from '../components/NpcsList.vue';

@Component({
  components: { NpcsList },
})
export default class Encounter extends Vue {}
</script>

<style>
</style>
