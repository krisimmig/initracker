import { ActionContext } from 'vuex';
import { getStoreAccessors } from 'vuex-typescript';
import { db } from './firebase';
import { RootState } from './index';

export interface NpcsState {
  npcs: NpcEntity[];
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

    getNpcById: (state: NpcsState) => (npcId: string): NpcEntity | undefined => {
      return state.npcs.find((npc) => npc.id === npcId);
    },

    getSearchResults: (state: NpcsState) => (query: string): NpcEntity[] => {
      return state.npcs.filter((npxIndexEntry) =>
        npxIndexEntry.name.toLowerCase().includes(query),
      );
    },
  },

  actions: {
    async fetchMonsters(context: NpcsContext) {
      try {
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

      } catch (error) {
        console.log('Error:', error);
      }
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
