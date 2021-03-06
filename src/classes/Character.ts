import uuid from 'uuid/v1';
import { mergeWith, isNull } from 'lodash';

import CreatureTypes from '@/types/creatureTypes';
import CharacterAlignments from '@/types/characterAlignments';
import CharacterSizes from '@/types/characterSizes';
import { ICondition } from '@/types/conditionTypes';
import { CharacterRaces } from '@/types/characterRaces';

type CharacterType = CreatureTypes | CharacterRaces;

interface ICharacterAbility {
  desc: string;
  name: string;
}

export class Character {
  public conditions: ICondition[] = [];
  public actions: ICharacterAbility[] = [];
  public alignment: string = CharacterAlignments.NeutralGood;
  public armor_class: number = 10;
  public armor_desc: string = '';
  public challenge_rating: string = '';
  public charisma: number = 10;
  public charisma_save: number = 0;
  public condition_immunities: string = '';
  public constitution: number = 10;
  public constitution_save: number = 0;
  public damage_immunities: string = '';
  public damage_resistances: string = '';
  public damage_vulnerabilities: string = '';
  public dexterity: number = 10;
  public dexterity_save: number = 0;
  public group: string = '';
  public hit_dice: string = '';
  public hit_points: number = 10;
  public hit_points_current!: number;
  public intelligence: number = 10;
  public intelligence_save: number = 0;
  public languages: string = 'Common';
  public legendary_actions: ICharacterAbility[] = [];
  public name: string = 'My new character';
  public perception: number = 10;
  public reactions: string = '';
  public senses: string = '';
  public size: CharacterSizes = CharacterSizes.Medium;
  public special_abilities: ICharacterAbility[] = [];
  public speed!: { walk: number, swim: number, fly: number, burrow: number, climb: number };
  public strength: number = 10;
  public strength_save: number = 0;
  public subtype: string = '';
  public type: CharacterType = CreatureTypes.humanoid;
  public wisdom: number = 10;
  public wisdom_save: number = 0;
  public uuid!: string;
  public id!: string;
  public initiative: number = 10;

  public constructor(data?: Character) {
    if (data) {

      const defaultCharacter = new Character();
      mergeWith(defaultCharacter, data, (defaultCharacterValue, existingCharacterValue) => {
        if (isNull(existingCharacterValue)) {
          return defaultCharacterValue;
        }
      });

      // If a monster has no legendary actions the variable is just an empty string, the next lines fix that.
      // @ts-ignore
      if (defaultCharacter.legendary_actions === '') {
        defaultCharacter.legendary_actions = [];
      }

      // If a monster has no special actions the variable is just an empty string, the next lines fix that.
      // @ts-ignore
      if (defaultCharacter.special_abilities === '') {
        defaultCharacter.special_abilities = [];
      }

      Object.assign(this, defaultCharacter);

    } else {
      this.id = this.name;
      this.hit_points_current = this.hit_points;
      this.uuid = uuid();
      this.speed = {
        walk: 30,
        swim: 10,
        fly: 0,
        burrow: 0,
        climb: 0,
      };
    }
  }
}
