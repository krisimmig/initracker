export enum CreatureTypes {
  aberration = 'Aberration',
  beast = 'Beast',
  celestial = 'Celestial',
  construct = 'Construct',
  dragon = 'Dragon',
  elemental = 'Elemental',
  fey = 'Fey',
  fiend = 'Fiend',
  giant = 'Giant',
  humanoid = 'Humanoid',
  monstrosity = 'Monstrosity',
  ooze = 'Ooze',
  plant = 'Plant',
  undead = 'Undead',
}

export enum CharacterRaces {
  aarakocra = 'Aarakocra (EEPC)',
  aasimar = 'Aasimar (VGTM)',
  bugbear = 'Bugbear (VGTM)',
  centaur = 'Centaur (EEPC/VGTM/MOoT)',
  changeling = 'Changeling (ERLW)',
  dragonborn = 'Dragonborn (PHB)',
  dwarf = 'Dwarf (PHB)',
  elf = 'Elf (PHB)',
  firbolg = 'Firbolg (VGTM)',
  genasi = 'Genasi (EEPC)',
  gith = 'Gith (MToF)',
  gnome = 'Gnome (PHB)',
  goblin = 'Goblin (VGTM)',
  goliath = 'Goliath (EEPC/ (VGTM)',
  halfelf = 'Half-Elf (PHB)',
  halforc = 'Half-Orc (PHB)',
  halfling = 'Halfling (PHB)',
  hobgoblin = 'Hobgoblin (VGTM)',
  human = 'Human (PHB)',
  kalashtar = 'Kalashtar (ERLW)',
  kenku = 'Kenku (VGTM)',
  kobold = 'Kobold (VGTM)',
  leonin = 'Leonin (MOoT)',
  lizardfolk = 'Lizardfolk (VGTM)',
  loxodon = 'Loxodon (GGtR)',
  minotaur = 'Minotaur (GGtR/MOoT)',
  orc = 'Orc (ERLW/VGTM)',
  satyr = 'Satyr (MOoT)',
  shifter = 'Shifter (ERLW)',
  simic = 'Simic Hybrid (GGtR)',
  tabaxi = 'Tabaxi (VGTM)',
  tiefling = 'Tiefling (PHB)',
  tortle = 'Tortle (TP)',
  triton = 'Triton (MOoT/VGTM)',
  vedalken = 'Vedalken (GGtR)',
  verdan = 'Verdan (AcInc)',
  warforged = 'Warforged (ERLW)',
  yuanti = 'Yuan-Ti Pureblood (VGTM)',
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
