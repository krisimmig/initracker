import { ActionContext } from 'vuex';
import { getStoreAccessors } from 'vuex-typescript';
import { db } from './firebase';
import { IRootState } from './index';

export interface INpcsState {
  npcs: INpc[];
  searchIndex: INpcIndexEntry[];
}

export interface INpcIndexEntry {
  name: string;
  id: string;
  size: string;
  type: string;
  challenge_rating: string;
  hit_points: number;
}

export interface INpc extends INpcIndexEntry {
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
    searchIndex: [],
  },

  getters: {
    getNpcs(state: INpcsState) {
      return state.npcs;
    },

    getSearchIndex(state: INpcsState) {
      return state.searchIndex;
    },

    getSearchResults: (state: INpcsState) => (query: string) => {
      return state.searchIndex.filter((npxIndexEntry) =>
        npxIndexEntry.name.toLowerCase().includes(query),
      );
    },
  },

  actions: {
    fetchSearchIndex(context: NpcsContext) {
      db.collection('monsters').onSnapshot((data) => {
        const searchIndex: INpcIndexEntry[] = data.docs.reduce(
          (acc: INpcIndexEntry[], current) => {
            acc.push({
              id: current.id,
              name: current.data().name,
              challenge_rating: current.data().challenge_rating,
              size: current.data().size,
              type: current.data().type,
              hit_points: current.data().hit_points,
            });
            return acc;
          }, [],
        );
        commitSetSearchIndex(context, searchIndex);
      });
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

    setSearchIndex(state: INpcsState, searchIndex: INpcIndexEntry[]) {
      state.searchIndex = searchIndex;
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
export const readGetSearchIndex = read(npcsModule.getters.getSearchIndex);
export const readGetSearchResults = read(npcsModule.getters.getSearchResults);

// Mutations
export const commitSetNpcs = commit(npcsModule.mutations.setNpcs);
export const commitSetSearchIndex = commit(npcsModule.mutations.setSearchIndex);

// Actions
export const dispatchOpenNpcsConnection = dispatch(npcsModule.actions.openNpcsConnection);
export const dispatchFetchSearchIndex = dispatch(npcsModule.actions.fetchSearchIndex);
