import { ICharacter } from '@/types/characters';

export default class Character {
  public id = 'foo';
  public speed = { walk: 30, swim: 10, burrow: 0, fly: 0 };
  public hit_points_current;
  public name: string = 'New Character';
  public hit_points;

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
