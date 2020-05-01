<template>
  <div
    class="bg-blue-100 cursor-pointer hover:shadow-lg ease-in-out duration-200 pointer transition p-2 mb-2 rounded"
    v-if="characterData"
  >
    <div class="flex w-full justify-between">
      <h4 class="CharacterSearchResult-name m-0 font-bold">{{ characterData.name }}</h4>
      <div>
        <slot></slot>
      </div>
    </div>

    <div class="flex items-end w-full">
      <div class="mr-4 flex items-center">
        <SvgIcon name="shield" class="text-gray-400 mr-1" />
        {{ characterData.armor_class }}
      </div>

      <div class="mr-4 flex items-center">
        <SvgIcon name="heart" class="text-red-200 mr-1" />
        {{ characterData.hit_points }}
      </div>

      <div class="flex items-center">
        <p class="font-bold">CR</p>
        <p class="ml-1">{{ characterData.challenge_rating }}</p>
      </div>

      <p class="CharacterSearchResult-meta ml-auto text-xs text-blue-400 opacity-50">{{ characterData.size }} {{ characterData.type }}</p>
    </div>

  </div>
</template>

<script lang='ts'>
  import { Component, Vue, Prop } from 'vue-property-decorator';
  import CharacterDetails from '@/components/characters/CharacterDetails.vue';
  import { Character } from '@/classes/Character';
  import { dispatchAddNpcToEncounter, readGetEncountersCurrentId, commitSetNpcInDetail } from '@/store/encountersModule';
  import CharacterArmorClass from '@/components/characters/common/CharacterArmorClass.vue';
  import CharacterHealth from '@/components/characters/common/CharacterHealth.vue';
  import SvgIcon from '@/components/common/SvgIcon.vue';

  @Component({
    components: {
      CharacterDetails,
      CharacterArmorClass,
      CharacterHealth,
      SvgIcon,
    },
  })
  export default class CharacterSearchResult extends Vue {
    @Prop({ type: Object, required: true }) public characterData!: Character;

    public get encounterId() {
      return readGetEncountersCurrentId(this.$store);
    }

    public addToEncounter() {
      if (!this.encounterId) { return; }
      dispatchAddNpcToEncounter(this.$store, {
        npcData: Object.assign({}, this.characterData),
        encounterId: this.encounterId,
      });
    }

    public selectCharacter() {
      commitSetNpcInDetail(this.$store, this.characterData);
    }
  }
</script>
