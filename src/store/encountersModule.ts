import Vue from 'vue';
import { ActionContext } from 'vuex';
import { getStoreAccessors } from 'vuex-typescript';
import { db, firebase } from './firebase';
import { RootState } from './index';
import { NpcEntity, StatusTypes } from './npcsModule';

export interface EncountersState {
  encounters: EncounterEntity[];
  encounterNpcs: { [key: string]: NpcEntity[] };
  npcInDetail?: NpcEntity;
  encounterInView: string;
}

export interface EncounterEntity {
  name: string;
  id: string;
  npcs: NpcEntity[];
}

type EncountersContext = ActionContext<EncountersState, RootState>;

export const encountersModule = {
  namespaced: true,

  state: {
    encounters: [],
    encounterNpcs: {},
    npcInDetail: null,
  },

  getters: {
    getEncounters(state: EncountersState) {
      return state.encounters;
    },

    getEncounterById: (state: EncountersState) => (encounterID: string): EncounterEntity | undefined => {
      return state.encounters.find((encounter) => encounter.id === encounterID);
    },

    getNpcInDetail(state: EncountersState) {
      console.log('getNpcInDetail', state);

      return state.npcInDetail;
    },

    getEncounterInViewId(state: EncountersState) {
      console.log('getEncounterInViewId', state);
      return state.encounters;
    },
  },

  actions: {
    getEncounterNpcs(context: EncountersContext, { encounterId }: { encounterId: string }) {
      db.collection('encounters').doc(encounterId).collection('npcs').onSnapshot((data) => {
        const npcs: NpcEntity[] = data.docs.reduce((acc: NpcEntity[], current) => {
          const newNpc: NpcEntity = current.data() as NpcEntity;
          newNpc.id = current.id;
          acc.push(newNpc);
          return acc;
        }, []);

        commitSetNpcsForEncounter(context, { id: encounterId, npcs });
      });
    },

    fetchEncounters(context: EncountersContext) {
      db.collection('encounters').onSnapshot((data) => {
        const encounters: EncounterEntity[] = data.docs.reduce((acc: EncounterEntity[], current) => {
          const newEncounter: EncounterEntity = current.data() as EncounterEntity;
          newEncounter.id = current.id;
          acc.push(newEncounter);
          return acc;
        }, []);

        commitSetEncounters(context, encounters);
        context.state.encounters.forEach((encounter) =>
          dispatchGetEncounterNpcs(context, { encounterId: encounter.id }),
        );
      });
    },

    async addNpcToEncounter(
      context: EncountersContext,
      { npcData, encounterId }: { npcData: NpcEntity, encounterId: string },
    ) {
      const moddedNpcData = npcData;
      moddedNpcData.status = [ StatusTypes.Poisened, StatusTypes.Stunned ];
      moddedNpcData.initiative = 10;
      const npcsRef = await db.collection('encounters').doc(encounterId);
      npcsRef.collection('npcs').add(moddedNpcData);
    },

    removeNpcFromEncounter(
      context: EncountersContext,
      { npcID, encounterId }: { npcID: string, encounterId: string },
    ) {
      db.collection('encounters')
        .doc(encounterId)
        .collection('npcs')
        .doc(npcID)
        .delete();
    },

    async addNewEncounter(
      context: EncountersContext,
      { encounterName }: { encounterName: string },
    ) {
      const encountersRef = await db.collection('encounters');
      const newEncounter: EncounterEntity = {
        id: '',
        name: encounterName,
        npcs: [],
      };
      encountersRef.add(newEncounter);
    },
  },

  mutations: {
    setEncounters(state: EncountersState, encounters: EncounterEntity[]) {
      state.encounters = encounters;
    },

    setNpcsForEncounter(state: EncountersState, { id, npcs }: { id: string, npcs: NpcEntity[] }) {
      const encounterIndex = state.encounters.findIndex((e) => e.id === id);
      if (encounterIndex !== -1) {
        const moddedEncounter = state.encounters[encounterIndex];
        moddedEncounter.npcs = npcs;
        Vue.set(state.encounters, encounterIndex, moddedEncounter);
      }
    },

    setNpcInDetail(state: EncountersState, npc: NpcEntity) {
      state.npcInDetail = npc;
    },

    setEncounterInView(state: EncountersState, encounterId: string) {
      state.encounterInView = encounterId;
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
export const readGetNpcInDetail = read(encountersModule.getters.getNpcInDetail);
export const readGetEncounterInViewId = read(encountersModule.getters.getEncounterInViewId);

// Mutations
export const commitSetEncounters = commit(encountersModule.mutations.setEncounters);
export const commitSetNpcsForEncounter = commit(encountersModule.mutations.setNpcsForEncounter);
export const commitSetNpcInDetail = commit(encountersModule.mutations.setNpcInDetail);
export const commitSetEncounterInView = commit(encountersModule.mutations.setEncounterInView);

// Actions
export const dispatchFetchEncounters = dispatch(encountersModule.actions.fetchEncounters);
export const dispatchAddNpcToEncounter = dispatch(encountersModule.actions.addNpcToEncounter);
export const dispatchRemoveNpcFromEncounter = dispatch(encountersModule.actions.removeNpcFromEncounter);
export const dispatchGetEncounterNpcs = dispatch(encountersModule.actions.getEncounterNpcs);
export const dispatchAddNewEncounter = dispatch(encountersModule.actions.addNewEncounter);
