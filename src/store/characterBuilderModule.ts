import { ActionContext } from 'vuex';
import { getStoreAccessors } from 'vuex-typescript';

import { db } from '@/store/firebase';
import { RootState } from '@/store/index';
import { Character } from '@/classes/Character';

export interface CharacterBuilderState {
  character: Character;
}

type CharacterBuilderContext = ActionContext<CharacterBuilderState, RootState>;

export const characterBuilderModule = {
  namespaced: true,

  state: {
    character: new Character(),
    characterId: '',
  },

  getters: {
    getCharacter(state: CharacterBuilderState) {
      return state.character;
    },
  },

  mutations: {
    setCharacter(state: CharacterBuilderState, { character }: { character: Character }) {
      state.character = character;
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

// Mutations
export const commitSetCharacter = commit(characterBuilderModule.mutations.setCharacter);

// Actions
// export const dispatchFetchCharacters = dispatch(charactersModule.actions.fetchCharacters);
