import { CharacterSizes, ICharacter, StatusTypes, ICharacterAction, ICharacterAbility } from '@/types/characters';

export class Character {
  public status!: StatusTypes[];
  public actions!: ICharacterAction;
  public alignment!: string;
  public armor_class!: number;
  public armor_desc!: number;
  public challenge_rating!: number;
  public charisma!: number;
  public charisma_save!: number;
  public condition_immunities!: string;
  public constitution!: number;
  public constitution_save!: number;
  public damage_immunities!: string;
  public damage_resistances!: string;
  public damage_vulnerabilities!: string;
  public dexterity!: number;
  public dexterity_save!: number;
  public group!: string;
  public hit_dice!: string;
  public hit_points!: number;
  public hit_points_current!: number;
  public intelligence!: number;
  public intelligence_save!: number;
  public languages!: string;
  public legendary_actions!: ICharacterAbility[];
  public name!: string;
  public perception!: number;
  public reactions!: string;
  public senses!: string;
  public size!: CharacterSizes;
  public special_abilities!: ICharacterAbility[];
  public speed!: { walk: number, swim: number, fly: number, burrow: number };
  public strength!: number;
  public strength_save!: number;
  public subtype!: string;
  public type!: string;
  public wisdom!: number;
  public wisdom_save!: number;
  public uuid!: string;
  public id!: string;
  public initiative!: number;

  public constructor(data?: ICharacter) {
    if (data) {
      Object.assign(this, data);
    } else {
      this.id = this.name;
      this.hit_points_current = this.hit_points;
    }
  }

  public get speedWalk() {
    return this.speed.walk || 30;
  }

  public set speedWalk(v) {
    this.speed.walk = v;
  }

  public get speedSwim() {
    return this.speed.swim || 10;
  }

  public set speedSwim(v) {
    this.speed.swim = v;
  }

  public get speedFly() {
    return this.speed.fly || 0;
  }

  public set speedFly(v) {
    this.speed.fly = v;
  }

  public get speedBurrow() {
    return this.speed.burrow || 0;
  }

  public set speedBurrow(v) {
    this.speed.burrow = v;
  }
}
