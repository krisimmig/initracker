import Vue from 'vue';
import { ActionContext } from 'vuex';
import { getStoreAccessors } from 'vuex-typescript';
import { db } from './firebase';
import { IRootState } from './index';
import { INpc } from './npcsModule';

export interface IEncounterState {
  encounters: IEncounter[];
  encounterNpcs: { [key: string]: INpc[] };
}

export interface IEncounter {
  name: string;
  id: string;
}

type EncountersContext = ActionContext<IEncounterState, IRootState>;

export const encountersModule = {
  namespaced: true,

  state: {
    encounters: [],
    encounterNpcs: {},
  },

  getters: {
    getEncounters(state: IEncounterState) {
      return state.encounters;
    },

    getEncounterNpcs: (state: IEncounterState) => (id: string) => {
      return state.encounterNpcs[id];
    },
  },

  actions: {
    async fetchEncounter(context: EncountersContext) {
      try {
        const data = await db.collection('encounters').get();
        const encounters: IEncounter[] = data.docs.reduce((acc: IEncounter[], current) => {
          const newEncounter: IEncounter = current.data() as IEncounter;
          newEncounter.id = current.id;
          acc.push(newEncounter);

          // dispatchFetchNpcsForEncounter(context, current.id);
          return acc;
        }, []);

        commitSetEncounters(context, encounters);
      } catch (error) {
        console.log('error', error);
      }
    },

    async fetchNpcsForEncounter(context: EncountersContext, id: string) {
      try {
        const npcsData = await db.collection('encounters').doc(id).collection('npcs').get();
        const npcs: INpc[] = npcsData.docs.reduce((acc: INpc[], current) => {
          const npc = current.data() as INpc;
          npc.id = current.id;
          acc.push(npc);
          return acc;
        }, []);

        commitSetNpcsForEncounter(context, { id, npcs });
      } catch (error) {
        console.log('error', error);
      }
    },
  },

  mutations: {
    setEncounters(state: IEncounterState, encounters: IEncounter[]) {
      state.encounters = encounters;
    },

    setNpcsForEncounter(
      state: IEncounterState,
      { id, npcs }: { id: string, npcs: INpc[] }) {
        Vue.set(state.encounterNpcs, id, npcs);
    },
  },
};

const {
  commit,
  read,
  dispatch,
} = getStoreAccessors<IEncounterState, IRootState>('encountersModule');

// Getters
export const readGetEncounters = read(encountersModule.getters.getEncounters);
export const readGetEncounterNpcs = read(encountersModule.getters.getEncounterNpcs);

// Mutations
export const commitSetEncounters = commit(encountersModule.mutations.setEncounters);
export const commitSetNpcsForEncounter = commit(encountersModule.mutations.setNpcsForEncounter);

// Actions
export const dispatchFetchEncounter = dispatch(encountersModule.actions.fetchEncounter);
export const dispatchFetchNpcsForEncounter = dispatch(encountersModule.actions.fetchNpcsForEncounter);
