import Vue from 'vue';
import { ActionContext, Store } from 'vuex';
import { getStoreAccessors } from 'vuex-typescript';
import { db } from './firebase';
import { RootState } from './index';
import * as npcsModule from './npcsModule';
import * as usersModule from './usersModule';

export interface EncountersState {
  encounters: EncounterEntity[];
  npcInDetail?: npcsModule.NpcEntity;
  encounterInView: string;
}

export interface EncounterEntity {
  name: string;
  id: string;
  npcs: npcsModule.NpcEntity[];
  round: number;
  activeEntityIndex: number;
}

type EncountersContext = ActionContext<EncountersState, RootState>;

export const encountersModule = {
  namespaced: true,

  state: {
    encounters: [],
    npcInDetail: null,
    encounterInView: '',
  },

  getters: {
    getEncounters(state: EncountersState) {
      return state.encounters;
    },

    getEncounterById: (state: EncountersState) => (encounterID: string): EncounterEntity | undefined => {
      return state.encounters.find((encounter) => encounter.id === encounterID);
    },

    getCurrentEncounter(state: EncountersState) {
      return state.encounters.find((encounter) => encounter.id === state.encounterInView);
    },

    getEncounterId(state: EncountersState) {
      return state.encounterInView;
    },

    getNpcInDetail(state: EncountersState) {
      return state.npcInDetail;
    },
  },

  actions: {
    getEncounterNpcs(context: EncountersContext, { encounterId }: { encounterId: string }) {
      const userUid = usersModule.readUserUid(context);
      db.collection(`users/${userUid}/encounters`)
        .doc(encounterId)
        .collection('npcs')
        .orderBy('initiative', 'desc')
        .onSnapshot((data) => {
        const npcs: npcsModule.NpcEntity[] = data.docs.reduce((acc: npcsModule.NpcEntity[], current) => {
          const newNpc: npcsModule.NpcEntity = current.data() as npcsModule.NpcEntity;
          newNpc.id = current.id;
          acc.push(newNpc);
          return acc;
        }, []);

        commitSetNpcsForEncounter(context, { id: encounterId, npcs });
      });
    },

    fetchEncounters(context: EncountersContext) {
      const userUid = usersModule.readUserUid(context);
      db.collection(`users/${userUid}/encounters`).onSnapshot((data) => {
        const encounters: EncounterEntity[] = [];
        data.forEach((doc) => {
          encounters.push(doc.data());
        });

        commitSetEncounters(context, encounters);
        context.state.encounters.forEach((encounter) =>
          dispatchGetEncounterNpcs(context, { encounterId: encounter.id }),
        );
      });
    },

    async addNpcToEncounter(
      context: EncountersContext,
      { npcData, encounterId }: { npcData: npcsModule.NpcEntity, encounterId: string },
    ) {
      const userUid = usersModule.readUserUid(context);

      const moddedNpcData = npcData;
      moddedNpcData.status = [];
      moddedNpcData.initiative = 0;
      moddedNpcData.hit_points_current = moddedNpcData.hit_points;
      const encounterRef = await db.collection(`users/${userUid}/encounters`).doc(encounterId);
      encounterRef.collection('npcs').add(moddedNpcData);
    },

    removeNpcFromEncounter(
      context: EncountersContext,
      { npcID, encounterId }: { npcID: string, encounterId: string },
    ) {
      const userUid = usersModule.readUserUid(context);

      db.collection(`users/${userUid}/encounters`)
        .doc(encounterId)
        .collection('npcs')
        .doc(npcID)
        .delete();
    },

    async addNewEncounter(
      context: EncountersContext,
      { encounterName }: { encounterName: string },
    ) {
      const userUid = usersModule.readUserUid(context);

      const encountersRef = await db.collection(`users/${userUid}/encounters`);
      const newEncounter: EncounterEntity = {
        id: '',
        name: encounterName,
        npcs: [],
        round: 1,
        activeEntityIndex: 1,
      };
      encountersRef.add(newEncounter);
    },

    removeEncounter(
      context: EncountersContext,
      { encounterId }: { encounterId: string },
    ) {
      const userUid = usersModule.readUserUid(context);

      db.collection(`users/${userUid}/encounters`)
        .doc(encounterId)
        .delete();
    },

    async updateName(
      context: EncountersContext,
      { encounterId, newName }: { encounterId: string, newName: string },
    ) {
      const userUid = usersModule.readUserUid(context);

      const encounterRef = await db.collection(`users/${userUid}/encounters`).doc(encounterId);
      encounterRef.set({
        name: newName,
      }, { merge: true });
    },

    async updateRound(
      context: EncountersContext,
      { encounterId, newRoundIndex }: { encounterId: string, newRoundIndex: number },
    ) {
      const userUid = usersModule.readUserUid(context);

      const encounterRef = await db.collection(`users/${userUid}/encounters`).doc(encounterId);
      encounterRef.set({
        round: newRoundIndex,
      }, { merge: true });
    },

    async updateActiveEntityIndex(
      context: EncountersContext,
      { encounterId, activeEntityIndex }: { encounterId: string, activeEntityIndex: number },
    ) {
      const userUid = usersModule.readUserUid(context);

      const encounterRef = await db.collection(`users/${userUid}/encounters`).doc(encounterId);
      encounterRef.set({
        activeEntityIndex,
      }, { merge: true });
    },
  },

  mutations: {
    setEncounters(state: EncountersState, encounters: EncounterEntity[]) {
      state.encounters = encounters;
    },

    setNpcsForEncounter(state: EncountersState, { id, npcs }: { id: string, npcs: npcsModule.NpcEntity[] }) {
      const encounterIndex = state.encounters.findIndex((e) => e.id === id);
      if (encounterIndex !== -1) {
        const moddedEncounter = state.encounters[encounterIndex];
        moddedEncounter.npcs = npcs;
        Vue.set(state.encounters, encounterIndex, moddedEncounter);
      }
    },

    setNpcInDetail(state: EncountersState, npc: npcsModule.NpcEntity) {
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
export const readGetEncounterId = read(encountersModule.getters.getEncounterId);
export const readGetCurrentEncounter = read(encountersModule.getters.getCurrentEncounter);

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
export const dispatchUpdateRound = dispatch(encountersModule.actions.updateRound);
export const dispatchUpdateActiveEntityIndex = dispatch(encountersModule.actions.updateActiveEntityIndex);
export const dispatchRemoveEncounter = dispatch(encountersModule.actions.removeEncounter);
export const dispatchUpdateName = dispatch(encountersModule.actions.updateName);
