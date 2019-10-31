export enum CharacterAttributes {
  STR = 'Strength',
  DEX = 'Dexterity',
  CON = 'Consitution',
  INT = 'Intelligence',
  WIS = 'Wisdom',
  CHA = 'Charisma',
}

export enum CharacterSizes {
  Small = 'Small',
  Medium = 'Medium',
  Large = 'Large',
  Huge = 'Huge',
  Gargentuan = 'Gargentuan',
}

export enum CharacterAlignments {
  LawfulGood = 'Lawful good',
  NeutralGood = 'Neutral good',
  ChaoticGood = 'Chaotic good',
  LawfulNeutral = 'Lawful neutral',
  Neutral = 'Neutral',
  ChaoticNeutral = 'Chaotic neutral',
  LawfulEvil = 'Lawful evil',
  NeutralEvil = 'Neutral evil',
  ChaoticEvil = 'Chaotic evil',
}

export interface ICharacterAbility {
  desc: string;
  name: string;
}

export interface ICharacterAction extends ICharacterAbility {
  attack_bonus: number;
  damage_bonus: number;
  damage_dice: string;
}

export interface ICharacter {
  actions: ICharacterAction[];
  alignment: string;
  armor_class: number;
  armor_desc: string;
  challenge_rating: number;
  charisma: number;
  charisma_save: number;
  condition_immunities: string;
  constitution: number;
  constitution_save: number;
  damage_immunities: string;
  damage_resistances: string;
  damage_vulnerabilities: string;
  dexterity: number;
  dexterity_save: number;
  group: string;
  hit_dice: string;
  hit_points: number;
  intelligence: number;
  intelligence_save: number;
  languages: string;
  legendary_actions: ICharacterAbility[];
  name: string;
  perception: number;
  reactions: string;
  senses: string;
  size: CharacterSizes;
  special_abilities: ICharacterAbility[];
  speed: {
    burrow: number;
    fly: number;
    walk: number
  };
  strength: number;
  strength_save: null;
  subtype: string;
  type: string;
  wisdom: number;
  wisdom_save: number;
  uuid: string;
  id: string;
}
