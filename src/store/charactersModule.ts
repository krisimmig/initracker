import { ActionContext } from 'vuex';
import { getStoreAccessors } from 'vuex-typescript';

import { db } from '@/store/firebase';
import { RootState } from '@/store/index';
import { readUserUid } from '@/store/usersModule';
import { Character } from '@/classes/Character';

export interface CharactersState {
  characters: Character[];
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
      console.log('fetchCharacters');

      const userUid = readUserUid(context);

      db.collection(`users/${userUid}/characters`).onSnapshot((data) => {
        const characters: Character[] = data.docs.map((doc) => new Character(doc.data() as Character));
        commitSetCharacters(context, { characters });
      });
    },
  },

  mutations: {
    updateCharacters(state: CharactersState, { newChar }: { newChar: Character }) {
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
