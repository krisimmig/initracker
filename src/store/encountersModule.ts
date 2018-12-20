import Vue from 'vue';
import { ActionContext } from 'vuex';
import { getStoreAccessors } from 'vuex-typescript';
import { db } from './firebase';
import { IRootState } from './index';
import { INpc } from './npcsModule';
import { arrayUnion } from '../utils/firebaseUtils';

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

    getEncounterById: (state: IEncounterState) => (encounterId: string): IEncounter | undefined => {
      return state.encounters.find((encounter) => encounter.id === encounterId);
    },

    getEncounterNpcs: (state: IEncounterState) => (id: string) => {
      return state.encounterNpcs[id];
    },
  },

  actions: {
    async fetchEncounter(context: EncountersContext) {
      try {
        await db.collection('encounters').onSnapshot((data) => {
          const encounters: IEncounter[] = data.docs.reduce((acc: IEncounter[], current) => {
            const newEncounter: IEncounter = current.data() as IEncounter;
            newEncounter.id = current.id;
            acc.push(newEncounter);
            return acc;
          }, []);

          commitSetEncounters(context, encounters);
        });
      } catch (error) {
        console.log('error', error);
      }
    },

    async addNpcToEncounter(
      context: EncountersContext,
      { npcId, encounterId }: { npcId: string, encounterId: string },
    ) {
      const npcsRef = await db.collection('encounters').doc(encounterId);
      npcsRef.update({ npcs: arrayUnion(npcId) });
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
export const readGetEncounterById = read(encountersModule.getters.getEncounterById);
export const readGetEncounterNpcs = read(encountersModule.getters.getEncounterNpcs);

// Mutations
export const commitSetEncounters = commit(encountersModule.mutations.setEncounters);
export const commitSetNpcsForEncounter = commit(encountersModule.mutations.setNpcsForEncounter);

// Actions
export const dispatchFetchEncounter = dispatch(encountersModule.actions.fetchEncounter);
export const dispatchAddNpcToEncounter = dispatch(encountersModule.actions.addNpcToEncounter);
