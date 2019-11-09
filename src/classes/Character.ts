import uuid from 'uuid/v1';

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
  public armor_class: number = 17;
  public armor_desc: string = 'Natural armor';
  public challenge_rating: string = '1/4';
  public charisma: number = 10;
  public charisma_save: number = 2;
  public condition_immunities: string = '';
  public constitution: number = 10;
  public constitution_save: number = 2;
  public damage_immunities: string = 'Acid';
  public damage_resistances: string = 'Bludgeoning, Piercing, and Slashing from Nonmagical Attacks';
  public damage_vulnerabilities: string = '';
  public dexterity: number = 10;
  public dexterity_save: number = 2;
  public group: string = '';
  public hit_dice: string = '2d8';
  public hit_points: number = 23;
  public hit_points_current!: number;
  public intelligence: number = 10;
  public intelligence_save: number = 2;
  public languages: string = 'Common';
  public legendary_actions: ICharacterAbility[] = [];
  public name: string = 'New Character';
  public perception: number = 10;
  public reactions: string = '';
  public senses: string = 'Passive Perception 10';
  public size: CharacterSizes = CharacterSizes.Medium;
  public special_abilities: ICharacterAbility[] = [];
  public speed!: { walk: number, swim: number, fly: number, burrow: number, climb: number };
  public strength: number = 10;
  public strength_save: number = 2;
  public subtype: string = '';
  public type: CreatureTypes = CreatureTypes.humanoid;
  public wisdom: number = 10;
  public wisdom_save: number = 0;
  public uuid!: string;
  public id!: string;
  public initiative: number = 10;

  public constructor(data?: Character) {
    if (data) {
      Object.assign(this, data);
    } else {
      this.id = this.name;
      this.hit_points_current = this.hit_points;
      this.uuid = uuid();
      this.speed = {
        walk: 30,
        swim: 10,
        fly: 0,
        burrow: 0,
        climb: 10,
      };
    }
  }
}