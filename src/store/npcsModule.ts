import { ActionContext } from 'vuex';
import { getStoreAccessors } from 'vuex-typescript';
import { db } from './firebase';
import { IRootState } from './index';

export interface INpcsState {
  npcs: INpc[];
}

export interface INpc {
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

type NpcsContext = ActionContext<INpcsState, IRootState>;

export const npcsModule = {
  namespaced: true,

  state: {
    npcs: [],
  },

  getters: {
    getNpcs(state: INpcsState) {
      return state.npcs;
    },

    getNpcById: (state: INpcsState) => (npcId: string): INpc | undefined => {
      return state.npcs.find((npc) => npc.id === npcId);
    },

    getSearchResults: (state: INpcsState) => (query: string): INpc[] => {
      return state.npcs.filter((npxIndexEntry) =>
        npxIndexEntry.name.toLowerCase().includes(query),
      );
    },
  },

  actions: {
    async fetchMonsters(context: NpcsContext) {
      try {
        const monstersQuerySnapshot = await db.collection('monsters').get();
        const monstersData: INpc[] = monstersQuerySnapshot.docs.reduce(
          (acc: INpc[], current) => {
            const newNpc: INpc = current.data() as INpc;
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
        const npcs: INpc[] = data.docs.reduce((acc: INpc[], current) => {
          const newNpc: INpc = current.data() as INpc;
          newNpc.id = current.id;
          acc.push(newNpc);
          return acc;
        }, []);

        commitSetNpcs(context, npcs);
      });
    },
  },

  mutations: {
    setNpcs(state: INpcsState, npcs: INpc[]) {
      state.npcs = npcs;
    },
  },
};

const {
  commit,
  read,
  dispatch,
} = getStoreAccessors<INpcsState, IRootState>('npcsModule');

// Getters
export const readGetNpcs = read(npcsModule.getters.getNpcs);
export const readGetNpcById = read(npcsModule.getters.getNpcById);
export const readGetSearchResults = read(npcsModule.getters.getSearchResults);

// Mutations
export const commitSetNpcs = commit(npcsModule.mutations.setNpcs);

// Actions
export const dispatchOpenNpcsConnection = dispatch(npcsModule.actions.openNpcsConnection);
export const dispatchFetchMonsters = dispatch(npcsModule.actions.fetchMonsters);
