export enum CreatureTypes {
  aberration = 'aberration',
  beast = 'beast',
  celestial = 'celestial',
  construct = 'construct',
  dragon = 'dragon',
  elemental = 'elemental',
  fey = 'fey',
  fiend = 'fiend',
  giant = 'giant',
  humanoid = 'humanoid',
  monstrosity = 'monstrosity',
  ooze = 'ooze',
  plant = 'plant',
  undead = 'undead',
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
  CON = 'Constitution',
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
  LawfulGood = 'lawful good',
  NeutralGood = 'neutral good',
  ChaoticGood = 'chaotic good',
  LawfulNeutral = 'lawful neutral',
  Neutral = 'neutral',
  ChaoticNeutral = 'chaotic neutral',
  LawfulEvil = 'lawful evil',
  NeutralEvil = 'neutral evil',
  ChaoticEvil = 'chaotic evil',
}

export interface ICharacterAbility {
  desc: string;
  name: string;
}
