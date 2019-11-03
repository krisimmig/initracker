import { ICharacter } from '@/types/characters';

export interface IEncounterEntity {
  id: string;
  name: string;
  npcs: ICharacter[];
  round: number;
  activeEntityIndex: number;
}
