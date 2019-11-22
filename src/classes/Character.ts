import uuid from 'uuid/v1';
import { mergeWith, isNull } from 'lodash';

import {
  CreatureTypes,
  CharacterSizes,
  StatusTypes,
  ICharacterAbility,
  CharacterAlignments,
} from '@/types/characters';

export class Character {
  public status: StatusTypes[] = [];
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
  public type: CreatureTypes = CreatureTypes.humanoid;
  public wisdom: number = 10;
  public wisdom_save: number = 0;
  public uuid!: string;
  public id!: string;
  public initiative: number = 10;

  public constructor(data?: Character) {
    if (data) {

      const defaultCharacter = new Character();
      mergeWith(defaultCharacter, data, (objValue, sourceValue) => {
        if (isNull(sourceValue)) {
          return objValue;
        }
      });
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

  // @Todo: check if still needed? Done in npcDetails now
  get stats(): Array<{ name: string; value: number; }> {
    return [
      { name: 'str', value: this.strength },
      { name: 'dex', value: this.dexterity },
      { name: 'con', value: this.constitution },
      { name: 'int', value: this.intelligence },
      { name: 'wis', value: this.wisdom },
      { name: 'cha', value: this.charisma },
    ];
  }

  // @Todo: check if still needed? Done in npcDetails now
  get speedString(): string {
    const keys = Object.keys(this.speed);
    return keys.reduce((acc, current)  => {
      const value = this.speed[current];
      if (value > 0) {
        return acc !== '' ? `${value}ft (${current}), ${acc}` : `${value}ft (${current})`;
      }
      return acc;
    }, '');
  }
}
