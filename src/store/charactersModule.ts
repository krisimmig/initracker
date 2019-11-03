import Vue from 'vue';
import { ActionContext } from 'vuex';
import { getStoreAccessors } from 'vuex-typescript';
import { db } from './firebase';
import { RootState } from './index';
import * as usersModule from './usersModule';

export interface CharactersState {
  characters: CharacterEntity[];
}

export interface CharacterEntity {
  name: string;
  id: string;
}

type CharactersContext = ActionContext<CharactersState, RootState>;

export const charactersModule = {
  namespaced: true,

  state: {
    characters: [],
  },

  getters: {
    getCharacters(state: CharactersState) {
      return state.characters;
    },
  },

  actions: {
    fetchCharacters(context: CharactersContext) {
      const userUid = usersModule.readUserUid(context);

      db.collection(`users/${userUid}/characters`).onSnapshot((data) => {
        const characters: CharacterEntity[] = data.docs.reduce((acc: CharacterEntity[], current) => {
          const newEncounter: CharacterEntity = current.data() as CharacterEntity;
          newEncounter.id = current.id;
          acc.push(newEncounter);
          return acc;
        }, []);

        commitSetCharacters(context, { characters });
      });
    },
  },

  mutations: {
    updateCharacters(state: CharactersState, { newChar }: { newChar: CharacterEntity }) {
      state.characters.push(newChar);
    },

    setCharacters(state: CharactersState, { characters }) {
      state.characters = characters;
    },
  },
};

const {
  commit,
  read,
  dispatch,
} = getStoreAccessors<CharactersState, RootState>('charactersModule');

// Getters
export const readGetCharacters = read(charactersModule.getters.getCharacters);

// Mutations
export const commitUpdateCharacters = commit(charactersModule.mutations.updateCharacters);
export const commitSetCharacters = commit(charactersModule.mutations.setCharacters);

// Actions
export const dispatchFetchCharacters = dispatch(charactersModule.actions.fetchCharacters);
