import { ActionContext } from 'vuex';
import { getStoreAccessors } from 'vuex-typescript';
import { db } from './firebase';
import { RootState } from './index';

export interface NpcsState {
  npcs: NpcEntity[];
}

export enum StatusTypes {
  Poisened,
  Stunned,
  Prone,
  Blinded,
}

export interface NpcEntity {
  name: string;
  id: string;
  size: string;
  type: string;
  challenge_rating: string;
  hit_points: number;
  hit_dice: string;
  strength: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  constitution: number;
  dexterity: number;
  status: StatusTypes[];
  initiative: number;
}

type NpcsContext = ActionContext<NpcsState, RootState>;

export const npcsModule = {
  namespaced: true,

  state: {
    npcs: [],
  },

  getters: {
    getNpcs(state: NpcsState) {
      return state.npcs;
    },

    getNpcById: (state: NpcsState) => (npcID: string): NpcEntity | undefined => {
      const npcIDclean = npcID.replace(/--[0-9]+/, '');
      return state.npcs.find((npc) => npc.id === npcIDclean);
    },

    getSearchResults: (state: NpcsState) => (query: string): NpcEntity[] => {
      return state.npcs.filter((npxIndexEntry) =>
        npxIndexEntry.name.toLowerCase().includes(query),
      );
    },
  },

  actions: {
    async fetchMonsters(context: NpcsContext) {
      const monstersQuerySnapshot = await db.collection('monsters').get();
      const monstersData: NpcEntity[] = monstersQuerySnapshot.docs.reduce(
        (acc: NpcEntity[], current) => {
          const newNpc: NpcEntity = current.data() as NpcEntity;
          newNpc.id = current.id;
          acc.push(newNpc);
          return acc;
        }, [],
      );
      commitSetNpcs(context, monstersData);
    },

    openNpcsConnection(context: NpcsContext) {
      db.collection('npcs').onSnapshot((data) => {
        const npcs: NpcEntity[] = data.docs.reduce((acc: NpcEntity[], current) => {
          const newNpc: NpcEntity = current.data() as NpcEntity;
          newNpc.id = current.id;
          acc.push(newNpc);
          return acc;
        }, []);

        commitSetNpcs(context, npcs);
      });
    },
  },

  mutations: {
    setNpcs(state: NpcsState, npcs: NpcEntity[]) {
      state.npcs = npcs;
    },
  },
};

const {
  commit,
  read,
  dispatch,
} = getStoreAccessors<NpcsState, RootState>('npcsModule');

// Getters
export const readGetNpcs = read(npcsModule.getters.getNpcs);
export const readGetNpcById = read(npcsModule.getters.getNpcById);
export const readGetSearchResults = read(npcsModule.getters.getSearchResults);

// Mutations
export const commitSetNpcs = commit(npcsModule.mutations.setNpcs);

// Actions
export const dispatchOpenNpcsConnection = dispatch(npcsModule.actions.openNpcsConnection);
export const dispatchFetchMonsters = dispatch(npcsModule.actions.fetchMonsters);
