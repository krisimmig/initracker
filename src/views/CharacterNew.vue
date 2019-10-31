<template>
  <div class="IT-Flex">
    <div>
      <h1>Create a new character</h1>
      <p>You can create a new character</p>
      <router-link :to="{ name: 'characterBuilder' }">from scratch</router-link>
      <p>or start with a monster from the Basic Rules. Please choose one from the list:</p>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';


@Component({})
export default class CharacterNew extends Vue {

}
</script>

<style>
</style>
