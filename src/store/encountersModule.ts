import { ActionContext } from 'vuex';
import { getStoreAccessors } from 'vuex-typescript';
import uuid from 'uuid/v1';

import { db } from '@/store/firebase';
import { RootState } from '@/store/index';
import * as usersModule from '@/store/usersModule';
import { Character as ICharacter } from '@/classes/Character';
import { IEncounterEntity } from '@/types/encounters';

export interface EncountersState {
  encountersAll: IEncounterEntity[];
  encountersCurrent: IEncounterEntity;
  encountersNpcs: ICharacter[];
  npcInDetail?: ICharacter;
}

type EncountersContext = ActionContext<EncountersState, RootState>;

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

    getEncounterById: (state: EncountersState) => (encounterID: string): IEncounterEntity | undefined => {
      return state.encountersAll.find((encounter) => encounter.id === encounterID);
    },

    getEncountersCurrent(state: EncountersState) {
      return state.encountersCurrent;
    },

    getEncountersActiveNpc(state: EncountersState) {
      if (state.encountersCurrent) {
        return state.encountersNpcs[state.encountersCurrent.activeEntityIndex - 1];
      }
    },

    getEncountersCurrentId(state: EncountersState) {
      return state.encountersCurrent ? state.encountersCurrent.id : null;
    },

    getNpcInDetail(state: EncountersState) {
      return state.npcInDetail;
    },

    getNpcUuidInDetail(state: EncountersState) {
      if (state.npcInDetail) {
        return state.npcInDetail.uuid;
      }
    },

    getEncountersCurrentNpcs(state: EncountersState) {
      return state.encountersNpcs;
    },
  },

  actions: {
    fetchEncounters(context: EncountersContext) {
      const userUid = usersModule.readUserUid(context);
      db.collection(`users/${userUid}/encounters`)
        .orderBy('createdAt', 'desc')
        .onSnapshot((data) => {
        const encounters: IEncounterEntity[] = [];
        data.forEach((doc) => {
          encounters.push(doc.data() as IEncounterEntity);
        });

        commitSetEncounters(context, encounters);
      });
    },

    fetchEncounterById(context: EncountersContext, { encounterId }) {
      const userUid = usersModule.readUserUid(context);
      db.doc(`users/${userUid}/encounters/${encounterId}`).onSnapshot((doc) => {
        const encounter = doc.data();

        commitSetEncounter(context, encounter as IEncounterEntity);
        dispatchFetchEncountersCurrentNpcs(context, { encounterId });
      });
    },

    fetchEncountersCurrentNpcs(context: EncountersContext, { encounterId }) {
      const userUid = usersModule.readUserUid(context);
      db.collection(`users/${userUid}/encounters/${encounterId}/npcs`)
        .orderBy('initiative', 'desc')
        .onSnapshot((data) => {
          const npcs: ICharacter[] = [];
          data.forEach((doc) => {
            npcs.push(doc.data() as ICharacter);
          });

          commitSetEncountersCurrentNpcs(context, { npcs });
        });
    },

    async addNpcToEncounter(
      context: EncountersContext,
      { npcData, encounterId }: { npcData: ICharacter, encounterId: string },
    ) {
      const userUid = usersModule.readUserUid(context);
      const id = uuid();

      npcData.uuid = id;
      npcData.conditions = [];
      npcData.initiative = 0;
      npcData.hit_points_current = npcData.hit_points;
      const npcsRef = await db.collection(`users/${userUid}/encounters/${encounterId}/npcs`);
      npcsRef.doc(id).set(npcData);
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
      const newEncounter: IEncounterEntity = {
        id,
        name: encounterName,
        round: 1,
        activeEntityIndex: 1,
        currentTurn: 1,
        createdAt: Date.now(),
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
      { encounterId, activeEntityIndex, currentTurn }:
      { encounterId: string, activeEntityIndex: number, currentTurn: number },
    ) {
      const userUid = usersModule.readUserUid(context);

      const encounterRef = await db.collection(`users/${userUid}/encounters`).doc(encounterId);
      encounterRef.set({
        activeEntityIndex,
        currentTurn,
      }, { merge: true });
    },
  },

  mutations: {
    setEncounters(state: EncountersState, encounters: IEncounterEntity[]) {
      state.encountersAll = encounters;
    },

    setEncounter(state: EncountersState, encounter: IEncounterEntity) {
      state.encountersCurrent = encounter;
    },

    setEncountersCurrentNpcs(state: EncountersState, { npcs }: { npcs: ICharacter[] }) {
      state.encountersNpcs = npcs;
    },

    setNpcInDetail(state: EncountersState, npc: ICharacter) {
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
export const readGetNpcUuidInDetail = read(encountersModule.getters.getNpcUuidInDetail);
export const readGetEncountersCurrent = read(encountersModule.getters.getEncountersCurrent);
export const readGetEncountersActiveNpc = read(encountersModule.getters.getEncountersActiveNpc);
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
export const dispatchUpdateActiveEntityIndex = dispatch(encountersModule.actions.updateActiveEntityIndex);
export const dispatchRemoveEncounter = dispatch(encountersModule.actions.removeEncounter);
export const dispatchUpdateRound = dispatch(encountersModule.actions.updateRound);
export const dispatchUpdateName = dispatch(encountersModule.actions.updateName);
