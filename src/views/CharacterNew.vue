<template>
  <div class="u-maxWidth">
    <div class="u-flex">
      <div>
        <VueTitle/>
        <p>You can create a new character</p>
        <router-link :to="{ name: 'characterBuilder' }">from scratch</router-link>
        <p>or start with a monster from the Basic Rules. Please choose one from the list:</p>
        <ul>
          <li v-for="npc in npcs" :key="npc.id">
            <router-link :to="{
                name: 'characterBuilderEdit',
                params: { characterId: npc.id} }"
            >{{ npc.name }}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';

import { readGetNpcs } from '@/store/npcsModule';
import { Character } from '@/classes/Character';

@Component
export default class CharacterNew extends Vue {
  public get npcs(): Character[] {
    return readGetNpcs(this.$store);
  }
}
</script>

