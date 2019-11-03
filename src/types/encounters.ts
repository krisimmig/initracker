import { Character as ICharacter } from '@/classes/Character';

export interface IEncounterEntity {
  id: string;
  name: string;
  npcs: ICharacter[];
  round: number;
  activeEntityIndex: number;
}
