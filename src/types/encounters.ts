import { Character } from '@/classes/Character';

export interface IEncounterEntity {
  id: string;
  name: string;
  round: number;
  activeEntityIndex: number;
  currentTurn: number;
  createdAt: number;
}
