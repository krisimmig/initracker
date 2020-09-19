import { Character } from '@/classes/Character';

export interface IEncounterEntity {
  id: string;
  name: string;
  npcs: Character[];
  round: number;
  activeEntityIndex: number;
  createdAt: number;
}
