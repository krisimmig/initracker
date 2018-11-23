import { ActionContext } from 'vuex';
import { getStoreAccessors } from 'vuex-typescript';
import { IRootState } from './index';

type UserContext = ActionContext<IUserState, IRootState>;

import { firebase } from './firebase';
import router from '../router';

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IUserState {
  user: firebase.User | null;
}

export const userModule = {
  namespaced: true,

  state: {
    user: null,
  },

  getters: {
    isLoggedIn(state: IUserState) {
      return state.user !== null;
    },
  },

  actions: {
    async validateUser(context: UserContext, loginCredentials: ILoginCredentials): Promise<void> {
      try {
        const response = await firebase.auth().signInWithEmailAndPassword(
          loginCredentials.email,
          loginCredentials.password,
        );
        commitSetUser(context, response.user);
        router.push({ name: 'home' });
      } catch (error) {
        console.log('Error', error);
      }
    },

    async logoutUser(context: UserContext) {
      try {
        await firebase.auth().signOut();
        commitSetUser(context, null);
        router.push({ name: 'home' });
      } catch (error) {
        console.log('Error', error);
      }
    },

    loginUser(context: UserContext, user: firebase.User) {
      commitSetUser(context, user);
    },
  },

  mutations: {
    setUser(state: IUserState, user: firebase.User | null) {
      state.user = user;
    },
  },
};

const { commit, read, dispatch } = getStoreAccessors<IUserState, IRootState>('userModule');

// Getters
export const readIsLoggedIn = read(userModule.getters.isLoggedIn);

// Actions
export const dispatchValidateUser = dispatch(userModule.actions.validateUser);
export const dispatchLogoutUser = dispatch(userModule.actions.logoutUser);
export const dispatchLoginUser = dispatch(userModule.actions.loginUser);

// Mutations
export const commitSetUser = commit(userModule.mutations.setUser);
