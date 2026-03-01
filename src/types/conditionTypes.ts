interface ICondition {
  name: string;
  id: string;
  effects?: string[];
  duration?: number;
}

const conditionList: ICondition[] = [
  {
    name: 'Blinded', id: 'blinded', effects:
      [
        'A blinded creature can’t see and automatically fails any ability check that requires sight.',
        'Attack rolls against the creature have advantage, and the creature’s attack rolls have disadvantage.',
      ],
  },

  {
    name: 'Charmed', id: 'charmed', effects:
      [
        'A charmed creature can’t attack the charmer or target the charmer with harmful abilities or magical effects.',
        'The charmer has advantage on any ability check to interact socially with the creature.',
      ],
  },

  {
    name: 'Deafened', id: 'deafened', effects:
      [
        'A deafened creature can’t hear and automatically fails any ability check that requires hearing.',
      ],
  },

  {
    name: 'Frightened', id: 'frightened', effects:
      [
        'A frightened creature has disadvantage on Ability Checks and Attack rolls while the source of its fear is within line of sight.',
        'The creature can’t willingly move closer to the source of its fear.',
      ],
  },

  {
    name: 'Grappled', id: 'grappled', effects:
      [
        'A grappled creature’s speed becomes 0, and it can’t benefit from any bonus to its speed.',
        'The condition ends if the Grappler is incapacitated (see the condition).',
        'The condition also ends if an Effect removes the grappled creature from the reach of the Grappler or Grappling Effect, such as when a creature is hurled away by the Thunderwave spell.',
      ],
  },

  {
    name: 'Incapacitated', id: 'incapacitated', effects:
      [
        'An incapacitated creature can’t take Actions or Reactions.',
      ],
  },

  {
    name: 'Invisible', id: 'invisible', effects:
      [
        'An invisible creature is impossible to see without the aid of magic or a Special sense. For the purpose of Hiding, the creature is heavily obscured. The creature’s location can be detected by any noise it makes or any tracks it leaves.',
        'Attack rolls against the creature have disadvantage, and the creature’s Attack rolls have advantage.',
      ],
  },

  {
    name: 'Paralyzed', id: 'paralyzed', effects:
      [
        'A paralyzed creature is incapacitated (see the condition) and can’t move or speak.',
        'The creature automatically fails Strength and Dexterity Saving Throws.',
        'Attack rolls against the creature have advantage.',
        'Any Attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature.',
      ],
  },

  {
    name: 'Petrified', id: 'petrified', effects:
      [
        'A petrified creature is transformed, along with any nonmagical object it is wearing or carrying, into a solid inanimate substance (usually stone). Its weight increases by a factor of ten, and it ceases aging.',
        'The creature is incapacitated (see the condition), can’t move or speak, and is unaware of its surroundings.',
        'Attack rolls against the creature have advantage.',
        'The creature automatically fails Strength and Dexterity Saving Throws.',
        'The creature has Resistance to all damage.',
        'The creature is immune to poison and disease, although a poison or disease already in its system is suspended, not neutralized.',
      ],
  },

  {
    name: 'Poisoned',
    id: 'poisoned',
    effects: ['A poisoned creature has disadvantage on Attack rolls and Ability Checks.'],
  },
  {
    name: 'Restrained',
    id: 'restrained',
    effects: ['A stunned creature is incapacitated (see the condition), can’t move, and can speak only falteringly.',
      'The creature automatically fails Strength and Dexterity Saving Throws.',
      'Attack rolls against the creature have advantage.'],
  },
  {
    name: 'Stunned',
    id: 'stunned',
    effects: ['A stunned creature is incapacitated (see the condition), can’t move, and can speak only falteringly.',
      'The creature automatically fails Strength and Dexterity Saving Throws.',
      'Attack rolls against the creature have advantage.'],
  },
  {
    name: 'Unconscious',
    id: 'unconscious',
    effects: ['An unconscious creature is incapacitated (see the condition), can’t move or speak, and is unaware of its surroundings',
      'The creature drops whatever it’s holding and falls prone.',
      'The creature automatically fails Strength and Dexterity Saving Throws.',
      'Attack rolls against the creature have advantage.',
      'Any Attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature.'],
  },

  {
    name: 'Exhaustion 1', id: 'exhaustion_1', effects:
      [
        '1 Disadvantage on Ability Checks',
        '2 Speed halved',
        '3 Disadvantage on Attack rolls and Saving Throws',
        '4 Hit point maximum halved',
        '5 Speed reduced to 0',
        '6 Death',
      ],
  },

  {
    name: 'Exhaustion 2', id: 'exhaustion_2', effects:
      [
        '1 Disadvantage on Ability Checks',
        '2 Speed halved',
        '3 Disadvantage on Attack rolls and Saving Throws',
        '4 Hit point maximum halved',
        '5 Speed reduced to 0',
        '6 Death',
      ],
  },

  {
    name: 'Exhaustion 3', id: 'exhaustion_3', effects:
      [
        '1 Disadvantage on Ability Checks',
        '2 Speed halved',
        '3 Disadvantage on Attack rolls and Saving Throws',
        '4 Hit point maximum halved',
        '5 Speed reduced to 0',
        '6 Death',
      ],
  },

  {
    name: 'Exhaustion 4', id: 'exhaustion_4', effects:
      [
        '1 Disadvantage on Ability Checks',
        '2 Speed halved',
        '3 Disadvantage on Attack rolls and Saving Throws',
        '4 Hit point maximum halved',
        '5 Speed reduced to 0',
        '6 Death',
      ],
  },

  {
    name: 'Exhaustion 5', id: 'exhaustion_5', effects:
      [
        '1 Disadvantage on Ability Checks',
        '2 Speed halved',
        '3 Disadvantage on Attack rolls and Saving Throws',
        '4 Hit point maximum halved',
        '5 Speed reduced to 0',
        '6 Death',
      ],
  },

  {
    name: 'Exhaustion 6', id: 'exhaustion_6', effects:
      [
        '1 Disadvantage on Ability Checks',
        '2 Speed halved',
        '3 Disadvantage on Attack rolls and Saving Throws',
        '4 Hit point maximum halved',
        '5 Speed reduced to 0',
        '6 Death',
      ],
  },
];


export { conditionList, ICondition };
