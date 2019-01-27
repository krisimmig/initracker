import Vue from 'vue';
import { ActionContext } from 'vuex';
import { getStoreAccessors } from 'vuex-typescript';
import { db, firebase } from './firebase';
import { RootState } from './index';
import { NpcEntity } from './npcsModule';
import { arrayUnion, arrayRemove } from '../utils/firebaseUtils';

export interface EncountersState {
  encounters: EncounterEntity[];
  encounterNpcs: { [key: string]: NpcEntity[] };
}

export interface EncounterEntity {
  name: string;
  id: string;
  npcIDs: string[];
}

type EncountersContext = ActionContext<EncountersState, RootState>;

export const encountersModule = {
  namespaced: true,

  state: {
    encounters: [],
    encounterNpcs: {},
  },

  getters: {
    getEncounters(state: EncountersState) {
      return state.encounters;
    },

    getEncounterById: (state: EncountersState) => (encounterId: string): EncounterEntity | undefined => {
      return state.encounters.find((encounter) => encounter.id === encounterId);
    },

    getEncounterNpcs: (state: EncountersState) => (id: string) => {
      return state.encounterNpcs[id];
    },
  },

  actions: {
    async fetchEncounter(context: EncountersContext) {
      try {
        await db.collection('encounters').onSnapshot((data) => {
          const encounters: EncounterEntity[] = data.docs.reduce((acc: EncounterEntity[], current) => {
            const newEncounter: EncounterEntity = current.data() as EncounterEntity;
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
      npcsRef.update({ npcIDs: arrayUnion(npcId) });
    },

    removeNpcFromEncounter(
      context: EncountersContext,
      { npcID, encounterId }: { npcID: string, encounterId: string },
    ) {
      console.log('Action: remove npc from encounter', npcID, encounterId);
      try {
        db.collection('encounters')
          .doc(encounterId)
          .update({
            npcIDs: arrayRemove(npcID),
          });
      } catch (error) {
        console.log('error', error);
      }
    },
  },

  mutations: {
    setEncounters(state: EncountersState, encounters: EncounterEntity[]) {
      state.encounters = encounters;
    },

    setNpcsForEncounter(
      state: EncountersState,
      { id, npcs }: { id: string, npcs: NpcEntity[] }) {
        Vue.set(state.encounterNpcs, id, npcs);
    },
  },
};

const {
  commit,
  read,
  dispatch,
} = getStoreAccessors<EncountersState, RootState>('encountersModule');

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
export const dispatchRemoveNpcFromEncounter = dispatch(encountersModule.actions.removeNpcFromEncounter);
