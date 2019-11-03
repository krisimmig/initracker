export enum StatusTypes {
  Poisened,
  Stunned,
  Prone,
  Blinded,
  Charmed,
}

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
