export enum CreatureTypes {
  Aberration,
  Beast,
  Celestial,
  Construct,
  Dragon,
  Elemental,
  Fey,
  Fiend,
  Giant,
  Humanoid,
  Monstrosity,
  Ooze,
  Plant,
  Undead,
}

export enum StatusTypes {
  Blinded,
  Charmed,
  Deafened,
  Exhaustion,
  Frightened,
  Grappled,
  Incapacitated,
  Invisible,
  Paralyzed,
  Petrified,
  Poisoned,
  Prone,
  Restrained,
  Stunned,
  Unconscious,
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
  Tiny = 'Tiny',
  Small = 'Small',
  Medium = 'Medium',
  Large = 'Large',
  Huge = 'Huge',
  Gargantuan = 'Gargantuan',
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
