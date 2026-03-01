import { isNull, mergeWith } from 'lodash';

import CreatureTypes from '@/types/creatureTypes';
import CharacterAlignments from '@/types/characterAlignments';
import CharacterSizes from '@/types/characterSizes';
import { CharacterRaces } from '@/types/characterRaces';
import CharacterCategories from "@/types/characterCategories";
import { ICondition } from "@/types/conditionTypes";

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
  public uuid_ref!: string;
  public id!: string;
  public initiative: number = 10;
  public category: CharacterCategories = CharacterCategories.NPC;
  public meta!: { createdAt: Date, updatedAt: Date };

  public constructor(data?: Character) {
    if (data) {

      const defaultCharacter = new Character();
      mergeWith(defaultCharacter, data, (defaultCharacterValue, existingCharacterValue) => {
        if (isNull(existingCharacterValue)) {
          return defaultCharacterValue;
        }
      });

      // If a monster has no legendary actions the variable is just an empty string, the next lines fixes that.
      // @ts-ignore
      if (defaultCharacter.legendary_actions === '') {
        defaultCharacter.legendary_actions = [];
      }

      // If a monster has no special actions the variable is just an empty string, the next lines fixes that.
      // @ts-ignore
      if (defaultCharacter.special_abilities === '') {
        defaultCharacter.special_abilities = [];
      }

      Object.assign(this, defaultCharacter);

    } else {
      this.id = this.name;
      this.category = CharacterCategories.Enemy;
      this.meta = {
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.hit_points_current = this.hit_points;
      this.speed = {
        walk: 30,
        swim: 10,
        fly: 0,
        burrow: 0,
        climb: 0,
      };
    }
  }

  public static getDescription(characterData): string {
    return `${characterData.size} ${characterData.alignment} ${characterData.type} with CR of ${characterData.challenge_rating}`;
  }

  public static getSpeedString(characterData): string {
    const keys = Object.keys(characterData.speed);
    return keys.reduce((acc, current) => {
      const value = characterData.speed[current];
      if (value > 0) {
        return acc !== '' ? `${acc}, ${value}ft (${current})` : `${value}ft (${current})`;
      }
      return acc;
    }, '');
  }

  public static getCreatedAt(characterData): string | boolean {
    return (characterData.meta && characterData.meta.createdAt) ?
      new Date(characterData.meta.createdAt.seconds * 1000).toLocaleString()
      : false;
  }

  public static getUpdatedAt(characterData): string | boolean {
    return (characterData.meta && characterData.meta.updatedAt) ?
      new Date(characterData.meta.updatedAt.seconds * 1000).toLocaleString()
      : false;
  }
}
