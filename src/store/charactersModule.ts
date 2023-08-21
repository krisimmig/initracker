import { ActionContext } from 'vuex';
import { getStoreAccessors } from 'vuex-typescript';

import { db } from '@/store/firebase';
import { RootState } from '@/store/index';
import { readUserUid } from '@/store/usersModule';
import { Character } from '@/classes/Character';

export interface CharactersState {
  characters: Character[];
  isLoading: boolean;
}

type CharactersContext = ActionContext<CharactersState, RootState>;

export const charactersModule = {
  namespaced: true,

  state: {
    characters: [],
    isLoading: false,
  },

  getters: {
    getCharacters(state: CharactersState) {
      return state.characters;
    },

    getIsLoading(state: CharactersState) {
      return state.isLoading;
    },
  },

  actions: {
    fetchCharacters(context: CharactersContext) {
      commitSetLoading(context, {isLoading: true});
      const userUid = readUserUid(context);

      db.collection(`users/${userUid}/characters`)
        .orderBy('meta.updatedAt', 'desc')
        .onSnapshot((data) => {
          commitSetLoading(context, {isLoading: false});
          const characters: Character[] = data.docs.map((doc) => new Character(doc.data() as Character));
          commitSetCharacters(context, {characters});
        });
    },
  },

  mutations: {
    updateCharacters(state: CharactersState, {newChar}: { newChar: Character }) {
      state.characters.push(newChar);
    },

    setCharacters(state: CharactersState, {characters}) {
      state.characters = characters;
    },

    setLoading(state: CharactersState, {isLoading}: { isLoading: boolean }) {
      state.isLoading = isLoading;
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
export const readGetIsLoading = read(charactersModule.getters.getIsLoading);

// Mutations
export const commitUpdateCharacters = commit(charactersModule.mutations.updateCharacters);
export const commitSetCharacters = commit(charactersModule.mutations.setCharacters);
export const commitSetLoading = commit(charactersModule.mutations.setLoading);

// Actions
export const dispatchFetchCharacters = dispatch(charactersModule.actions.fetchCharacters);
