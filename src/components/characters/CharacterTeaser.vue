<template>
  <div
    class="bg-blue-200 cursor-pointer hover:shadow-lg ease-in-out duration-200 pointer transition mb-4 rounded overflow-hidden"
    v-if="characterData"
  >
    <div class="flex w-full justify-between bg-black text-blue-200 p-2 items-end">
      <h4 class="CharacterSearchResult-name m-0 font-semibold">{{ characterData.name }}</h4>
      <p class="CharacterSearchResult-meta ml-auto text-xs italic">{{ characterData.size }} {{ characterData.type }}</p>
    </div>

    <div class="flex items-end w-full p-2 justify-between items-center">
      <div class="flex">
        <div class="mr-4 flex items-center">
          <SvgIcon name="shield" class="text-gray-100 mr-1" />
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
      </div>

      <div>
        <slot></slot>
      </div>
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
