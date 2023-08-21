import { ActionContext } from 'vuex';
import { getStoreAccessors } from 'vuex-typescript';
import uuid from 'uuid/v1';

import { db } from '@/store/firebase';
import { RootState } from '@/store/index';
import { Character } from '@/classes/Character';
import { readUserUid } from '@/store/usersModule';
import router from '@/router';

export interface CharacterBuilderState {
  character: Character;
  characterId: string;
  isLoading: boolean;
}

type CharacterBuilderContext = ActionContext<CharacterBuilderState, RootState>;

export const characterBuilderModule = {
  namespaced: true,

  state: {
    character: new Character(),
    characterId: '',
    isLoading: false,
  },

  getters: {
    getCharacter(state: CharacterBuilderState) {
      return state.character;
    },

    getIsLoading(state: CharacterBuilderState) {
      return state.isLoading;
    },
  },

  mutations: {
    setCharacter(state: CharacterBuilderState, {character}: { character: Character }) {
      state.character = character;
    },

    setLoading(state: CharacterBuilderState, {isLoading}: { isLoading: boolean }) {
      state.isLoading = isLoading;
    },
  },

  actions: {
    async fetchCharacterById(context: CharacterBuilderContext, {id}: { id: string }) {
      commitSetLoading(context, {isLoading: true});
      const characterDoc = await db.doc(`monsters/${id}`);

      characterDoc.get().then((doc) => {
        if (doc.exists) {
          const characterData = doc.data() as Character;
          const character = new Character(characterData);
          commitSetCharacter(context, {character});
          commitSetLoading(context, {isLoading: false});
        } else {
          console.warn('No such document!');
          commitSetLoading(context, {isLoading: false});
        }
      }).catch((error) => {
        console.error('Error getting document:', error);
        commitSetLoading(context, {isLoading: false});
      });
    },

    async fetchCharacterByUuid(context: CharacterBuilderContext, {characterUuid}: { characterUuid: string }) {
      commitSetLoading(context, {isLoading: true});
      const userUid = readUserUid(context);
      const characterRef = db.doc(`users/${userUid}/characters/${characterUuid}`);

      characterRef.get().then((doc) => {
        if (doc.exists) {
          const character = doc.data() as Character;
          commitSetCharacter(context, {character});
          commitSetLoading(context, {isLoading: false});
        } else {
          console.warn('No such document!');
          commitSetLoading(context, {isLoading: false});
        }
      }).catch((error) => {
        console.error('Error getting document:', error);
        commitSetLoading(context, {isLoading: false});
      });
    },

    saveCharacter(context: CharacterBuilderContext, {character, newCharacter = false}: {
      character: Character,
      newCharacter: boolean
    }) {
      if (newCharacter) {
        character.uuid = uuid();
        character.meta.createdAt = new Date();
      }

      if (!character.uuid_ref) {
        character.uuid_ref = uuid();
      }

      character.meta.updatedAt = new Date();

      const userUid = readUserUid(context);
      const characterRef = db.doc(`users/${userUid}/characters/${character.uuid}`);

      characterRef.set({...character}, {merge: true});

      if (!newCharacter) {
        dispatchUpdateCharacterInEncounters(context, {character});
      }

      if (newCharacter) {
        router.push({name: 'characterEdit', params: {uuid: character.uuid, type: 'edit'}});
      }
    },

    async deleteCharacter(context: CharacterBuilderContext, {characterUuid}: { characterUuid: string }) {
      const userUid = readUserUid(context);
      return db.doc(`users/${userUid}/characters/${characterUuid}`).delete();
    },

    async updateCharacterInEncounters(context: CharacterBuilderContext, {character}: { character: Character }) {
      const userUid = readUserUid(context);
      console.log('updating characterUuid', character.uuid_ref);

      const encountersQuerySnapshot = await db.collection(`users/${userUid}/encounters`).get();

      for (const encounterDoc of encountersQuerySnapshot.docs) {
        const npcsQuerySnapshot =
          await encounterDoc.ref
            .collection('npcs')
            .where('uuid_ref', '==', character.uuid_ref)
            .get();

        npcsQuerySnapshot.forEach(docRef => {
          const encounterId = docRef.ref.parent.parent?.id;
          const oldCharacterDarta = docRef.data();
          character.conditions = oldCharacterDarta.conditions;
          character.hit_points_current = oldCharacterDarta.hit_points_current;
          character.uuid = oldCharacterDarta.uuid;
          character.initiative = oldCharacterDarta.initiative;
          const charRef = db.doc(`users/${userUid}/encounters/${encounterId}/npcs/${docRef.id}`);
          charRef.set(character);
        });
      }

      // db.collection(`users/${userUid}/encounters`).get().then((querySnapshot) => {
      //   querySnapshot.forEach((doc) => {
      //     doc.ref.collection('npcs').where('uuid_ref', '==', characterUuidRef).get().then(snap => {
      //       snap.docs.forEach(docRef => {
      //         useId(docRef.ref.parent.parent!.id);
      //       });
      //     });
      //   });
      // });
    },
  },

};

const {
  commit,
  read,
  dispatch,
} = getStoreAccessors<CharacterBuilderState, RootState>('characterBuilderModule');

// Getters
export const readGetCharacter = read(characterBuilderModule.getters.getCharacter);
export const readGetIsLoading = read(characterBuilderModule.getters.getIsLoading);

// Mutations
export const commitSetCharacter = commit(characterBuilderModule.mutations.setCharacter);
export const commitSetLoading = commit(characterBuilderModule.mutations.setLoading);

// Actions
export const dispatchFetchCharacterById = dispatch(characterBuilderModule.actions.fetchCharacterById);
export const dispatchFetchCharacterByUuid = dispatch(characterBuilderModule.actions.fetchCharacterByUuid);
export const dispatchSaveCharacter = dispatch(characterBuilderModule.actions.saveCharacter);
export const dispatchDeleteCharacter = dispatch(characterBuilderModule.actions.deleteCharacter);
export const dispatchUpdateCharacterInEncounters = dispatch(characterBuilderModule.actions.updateCharacterInEncounters);
