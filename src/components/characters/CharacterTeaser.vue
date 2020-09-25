<template>
  <div
    class="bg-white cursor-pointer hover:bg-gray-100 transition duration-100"
    v-if="characterData"
  >
    <div class="flex w-full justify-between items-start p-2 pb-1">
      <h4 class="CharacterSearchResult-name m-0 font-semibold mr-1">{{ characterData.name }}</h4>
      <p class="CharacterSearchResult-meta ml-auto text-xs italic text-gray-600 text-right">{{ characterData.size }}</p>
    </div>

    <div class="flex items-end w-full p-2 pt-0 justify-between items-center">
      <div class="flex text-gray-600 font-light text-sm">
        <div class="mr-4 flex items-center">
          <SvgIcon name="heart" class="mr-1 text-red-600" />
          {{ characterData.hit_points }}
        </div>

        <div class="mr-4 flex items-center">
          <SvgIcon name="shield" class="mr-1 text-gray-300" />
          {{ characterData.armor_class }}
        </div>

        <div class="flex items-center">
          <p class="font-semibold mb-0">CR</p>
          <p class="ml-1 mb-0">{{ characterData.challenge_rating }}</p>
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
  export default class CharacterTeaser extends Vue {
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
