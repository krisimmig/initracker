<template >
  <div
      v-if="characterData"
      class="CharacterTeaser d-flex align-center"
  >
    <div class="d-flex flex-column">

      <h4 class="text-h6 font-weight-medium">{{ characterData.name }}</h4 >
      <p class="mb-1">{{ description }}</p >

      <div class="d-flex">
        <div class="d-flex align-center">
          <SvgIcon
              name="heart"
              class="red--text mr-1"
          />
          {{ characterData.hit_points }}
        </div >

        <div class="d-flex align-center ml-2">
          <SvgIcon
              name="shield"
              class="grey--text mr-1"
          />
          {{ characterData.armor_class }}
        </div >

        <div class="d-flex align-center ml-2">
          <p class="mb-0 mr-1">
            <b >CR</b >
            <span v-if="characterData.challenge_rating">
                {{ characterData.challenge_rating }}
              </span >
            <span v-else> &mdash;</span >
          </p >
        </div >
      </div >
      <p
          class="caption mb-0 mt-2 text--secondary"
      >
        Created {{ createdAt || 'sometime in the past' }} - Updated {{ updatedAt || 'never' }}
      </p >
    </div >

    <v-spacer />
    <slot ></slot >
  </div >
</template >

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import CharacterDetails from '@/components/characters/CharacterDetails.vue';
import { Character } from '@/classes/Character';
import {
  dispatchAddNpcToEncounter,
  readGetEncountersCurrentId,
} from '@/store/encountersModule';
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
  @Prop({type: Object, required: true}) public characterData!: Character;

  public get encounterId() {
    return readGetEncountersCurrentId(this.$store);
  }

  public get description() {
    return Character.getDescription(this.characterData);
  }

  public addToEncounter() {
    if (!this.encounterId) {
      return;
    }
    dispatchAddNpcToEncounter(this.$store, {
      npcData: Object.assign({}, this.characterData),
      encounterId: this.encounterId,
    });
  }

  public get createdAt() {
    return Character.getCreatedAt(this.characterData);
  }

  public get updatedAt() {
    return Character.getUpdatedAt(this.characterData);
  }
}
</script >


<style lang="scss">
.CharacterTeaser {
  cursor: pointer;
}
</style >