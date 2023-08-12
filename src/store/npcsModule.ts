import { ActionContext } from 'vuex';
import { getStoreAccessors } from 'vuex-typescript';

import { arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from '@/store/firebase';
import { RootState } from '@/store/index';
import { readUserUid } from '@/store/usersModule';
import { Character as ICharacter } from '@/classes/Character';
import { ICondition } from '@/types/conditionTypes';

export interface NpcsState {
  npcs: ICharacter[];
}

type NpcsContext = ActionContext<NpcsState, RootState> | any;

export const npcsModule = {
  namespaced: true,

  state: {
    npcs: [],
  },

  getters: {
    getNpcs(state: NpcsState) {
      return state.npcs;
    },

    getNpcById: (state: NpcsState) => (npcID: string): ICharacter | undefined => {
      return state.npcs.find((npc) => npc.id === npcID);
    },

    getSearchResults: (state: NpcsState) => (query: string): ICharacter[] => {
      return state.npcs.filter((npxIndexEntry) =>
        npxIndexEntry.name.toLowerCase().includes(query),
      );
    },
  },

  actions: {
    async fetchNpcs(context: NpcsContext) {
      const monstersQuerySnapshot = await db.collection('monsters').get();
      const monstersData: ICharacter[] = monstersQuerySnapshot.docs.reduce(
        (acc: ICharacter[], current) => {
          const newNpc: ICharacter = current.data() as ICharacter;
          newNpc.id = current.id;
          acc.push(newNpc);
          return acc;
        }, [],
      );
      commitSetNpcs(context, monstersData);
    },

    openNpcsConnection(context: NpcsContext) {
      db.collection('npcs').onSnapshot((data) => {
        const npcs: ICharacter[] = data.docs.reduce((acc: ICharacter[], current) => {
          const newNpc: ICharacter = current.data() as ICharacter;
          newNpc.id = current.id;
          acc.push(newNpc);
          return acc;
        }, []);

        commitSetNpcs(context, npcs);
      });
    },

    updateCondition(
      context: NpcsContext,
      {encounterId, npcId, newCondition}: { encounterId: string, npcId: string, newCondition: ICondition }) {
      const userUid = readUserUid(context);
      const npcRef = db.doc(`users/${userUid}/encounters/${encounterId}/npcs/${npcId}`);

      npcRef.set({
        conditions: arrayUnion(newCondition),
      }, {merge: true});
    },

    async removeConditionFromNpc(
      context: NpcsContext,
      {encounterId, npcId, conditionId}: { encounterId: string, npcId: string, conditionId: string }) {
      const userUid = readUserUid(context);
      const encounterRef = db.collection(`users/${userUid}/encounters`).doc(encounterId);
      const npcRef = encounterRef.collection('npcs').doc(npcId);

      npcRef.set({
        conditions: arrayRemove(conditionId),
      }, {merge: true});
    },

    updateInitiative(
      context: NpcsContext,
      {encounterId, npcId, newInitiative}: { encounterId: string, npcId: string, newInitiative: number }) {
      const userUid = readUserUid(context);
      console.log(npcId);
      const npcRef = db.doc(`users/${userUid}/encounters/${encounterId}/npcs/${npcId}`);

      npcRef.set({
        initiative: newInitiative,
      }, {merge: true});
    },

    updateHitPointCurrent(
      context: NpcsContext,
      {encounterId, npcId, newHitPoints}: { encounterId: string, npcId: string, newHitPoints: number }) {
      const userUid = readUserUid(context);
      const encounterRef = db.collection(`users/${userUid}/encounters`).doc(encounterId);
      const npcRef = encounterRef.collection('npcs').doc(npcId);

      npcRef.set({
        hit_points_current: newHitPoints,
      }, {merge: true});
    },
  },

  mutations: {
    setNpcs(state: NpcsState, npcs: ICharacter[]) {
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
export const dispatchFetchNpcs = dispatch(npcsModule.actions.fetchNpcs);
export const dispatchUpdateCondition = dispatch(npcsModule.actions.updateCondition);
export const dispatchRemoveConditionFromNpc = dispatch(npcsModule.actions.removeConditionFromNpc);
export const dispatchUpdateInitiative = dispatch(npcsModule.actions.updateInitiative);
export const dispatchUpdateHitPointCurrent = dispatch(npcsModule.actions.updateHitPointCurrent);
