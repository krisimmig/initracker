import { ActionContext } from 'vuex';
import { getStoreAccessors } from 'vuex-typescript';
import { RootState } from './index';

type UserContext = ActionContext<UserState, RootState>;

import { firebase } from './firebase';
import router from '../router';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserState {
  user: firebase.User | null;
}

export const usersModule = {
  namespaced: true,

  state: {
    user: null,
  },

  getters: {
    isLoggedIn(state: UserState) {
      return state.user !== null;
    },

    getUserString(state: UserState) {
      return state.user ? `${state.user.displayName} <${state.user.email}> (${state.user.uid})` : false;
    },

    getUserUid(state: UserState) {
      return state.user ? state.user.uid : false;
    },
  },

  actions: {
    async validateUser(context: UserContext, loginCredentials: LoginCredentials): Promise<void> {
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
    setUser(state: UserState, user: firebase.User | null) {
      state.user = user;
    },
  },
};

const { commit, read, dispatch } = getStoreAccessors<UserState | any, RootState>('usersModule');

// Getters
export const readIsLoggedIn = read(usersModule.getters.isLoggedIn);
export const readUserString = read(usersModule.getters.getUserString);
export const readUserUid = read(usersModule.getters.getUserUid);

// Actions
export const dispatchValidateUser = dispatch(usersModule.actions.validateUser);
export const dispatchLogoutUser = dispatch(usersModule.actions.logoutUser);
export const dispatchLoginUser = dispatch(usersModule.actions.loginUser);

// Mutations
export const commitSetUser = commit(usersModule.mutations.setUser);
