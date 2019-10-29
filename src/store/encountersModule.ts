import Vue from 'vue';
import { ActionContext, Store } from 'vuex';
import { getStoreAccessors } from 'vuex-typescript';
import uuid from 'uuid/v1';

import { db } from './firebase';
import store, { RootState } from './index';
import * as npcsModule from './npcsModule';
import * as usersModule from './usersModule';

type EncountersContext = ActionContext<EncountersState, RootState>;

export interface EncounterEntity {
  id: string;
  name: string;
  npcs: npcsModule.NpcEntity[];
  round: number;
  activeEntityIndex: number;
}

export interface EncountersState {
  encountersAll: EncounterEntity[];
  encountersCurrent: EncounterEntity;
  encountersNpcs: npcsModule.NpcEntity[];
  npcInDetail?: npcsModule.NpcEntity;
}

export const encountersModule = {
  namespaced: true,

  state: {
    encountersAll: [],
    encountersCurrent: null,
    encountersNpcs: [],
    npcInDetail: null,
  },

  getters: {
    getEncountersAll(state: EncountersState) {
      return state.encountersAll;
    },

    getEncounterById: (state: EncountersState) => (encounterID: string): EncounterEntity | undefined => {
      return state.encountersAll.find((encounter) => encounter.id === encounterID);
    },

    getEncountersCurrent(state: EncountersState) {
      return state.encountersCurrent;
    },

    getEncountersCurrentId(state: EncountersState) {
      return state.encountersCurrent ? state.encountersCurrent.id : null;
    },

    getNpcInDetail(state: EncountersState) {
      return state.npcInDetail;
    },

    getEncountersCurrentNpcs(state: EncountersState) {
      return state.encountersNpcs;
    },
  },

  actions: {
    fetchEncounters(context: EncountersContext) {
      const userUid = usersModule.readUserUid(context);
      db.collection(`users/${userUid}/encounters`).onSnapshot((data) => {
        const encounters: EncounterEntity[] = [];
        data.forEach((doc) => {
          encounters.push(doc.data());
        });

        commitSetEncounters(context, encounters);
      });
    },

    fetchEncounterById(context: EncountersContext, { encounterId }) {
      const userUid = usersModule.readUserUid(context);
      db.doc(`users/${userUid}/encounters/${encounterId}`).onSnapshot((doc) => {
        const encounter = doc.data();

        commitSetEncounter(context, encounter);
        dispatchFetchEncountersCurrentNpcs(context, { encounterId });
      });
    },

    fetchEncountersCurrentNpcs(context: EncountersContext, { encounterId }) {
      const userUid = usersModule.readUserUid(context);
      console.log('encounterId', encounterId);
      db.collection(`users/${userUid}/encounters/${encounterId}/npcs`)
        .orderBy('initiative', 'desc')
        .onSnapshot((data) => {
          const npcs: npcsModule.NpcEntity[] = [];
          data.forEach((doc) => {
            npcs.push(doc.data());
          });

          commitSetEncountersCurrentNpcs(context, { npcs });
        });
    },

    async addNpcToEncounter(
      context: EncountersContext,
      { npcData, encounterId }: { npcData: npcsModule.NpcEntity, encounterId: string },
    ) {
      const userUid = usersModule.readUserUid(context);
      const id = uuid();

      const moddedNpcData = npcData;
      moddedNpcData.uuid = id;
      moddedNpcData.status = [];
      moddedNpcData.initiative = 0;
      moddedNpcData.hit_points_current = moddedNpcData.hit_points;
      const npcsRef = await db.collection(`users/${userUid}/encounters/${encounterId}/npcs`);
      npcsRef.doc(id).set(moddedNpcData);
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
      const id = uuid();

      const encountersRef = await db.collection(`users/${userUid}/encounters`);
      const newEncounter: EncounterEntity = {
        id,
        name: encounterName,
        npcs: [],
        round: 1,
        activeEntityIndex: 1,
      };

      encountersRef.doc(id).set(newEncounter);
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
      state.encountersAll = encounters;
    },

    setEncounter(state: EncountersState, encounter: EncounterEntity) {
      state.encountersCurrent = encounter;
    },

    setEncountersCurrentNpcs(state: EncountersState, { npcs }: { npcs: npcsModule.NpcEntity[] }) {
      state.encountersNpcs = npcs;
    },

    setNpcInDetail(state: EncountersState, npc: npcsModule.NpcEntity) {
      state.npcInDetail = npc;
    },
  },
};

const {
  commit,
  read,
  dispatch,
} = getStoreAccessors<EncountersState, RootState>('encountersModule');

// Getters
export const readGetEncountersAll = read(encountersModule.getters.getEncountersAll);
export const readGetEncounterById = read(encountersModule.getters.getEncounterById);
export const readGetNpcInDetail = read(encountersModule.getters.getNpcInDetail);
export const readGetEncountersCurrent = read(encountersModule.getters.getEncountersCurrent);
export const readGetEncountersCurrentId = read(encountersModule.getters.getEncountersCurrentId);
export const readGetEncountersCurrentNpcs = read(encountersModule.getters.getEncountersCurrentNpcs);

// Mutations
export const commitSetEncounters = commit(encountersModule.mutations.setEncounters);
export const commitSetEncounter = commit(encountersModule.mutations.setEncounter);
export const commitSetEncountersCurrentNpcs = commit(encountersModule.mutations.setEncountersCurrentNpcs);
export const commitSetNpcInDetail = commit(encountersModule.mutations.setNpcInDetail);

// Actions
export const dispatchFetchEncounters = dispatch(encountersModule.actions.fetchEncounters);
export const dispatchFetchEncounterById = dispatch(encountersModule.actions.fetchEncounterById);
export const dispatchFetchEncountersCurrentNpcs = dispatch(encountersModule.actions.fetchEncountersCurrentNpcs);
export const dispatchAddNpcToEncounter = dispatch(encountersModule.actions.addNpcToEncounter);
export const dispatchRemoveNpcFromEncounter = dispatch(encountersModule.actions.removeNpcFromEncounter);
export const dispatchAddNewEncounter = dispatch(encountersModule.actions.addNewEncounter);
export const dispatchUpdateRound = dispatch(encountersModule.actions.updateRound);
export const dispatchUpdateActiveEntityIndex = dispatch(encountersModule.actions.updateActiveEntityIndex);
export const dispatchRemoveEncounter = dispatch(encountersModule.actions.removeEncounter);
export const dispatchUpdateName = dispatch(encountersModule.actions.updateName);
