import { ActionContext } from 'vuex';
import { getStoreAccessors } from 'vuex-typescript';
import avatarDefault from '@/assets/avatar.jpg';

import router from '@/router';
import { RootState } from '@/store/index';
import { firebase } from '@/store/firebase';
import { UserState, LoginCredentials } from '@/types/users';

type UserContext = ActionContext<UserState, RootState>;

export const usersModule = {
  namespaced: true,

  state: {
    user: null,
  },

  getters: {
    isLoggedIn(state: UserState) {
      return state.user !== null;
    },

    getUserObj(state: UserState): firebase.User | null {
      return state.user;
    },

    getUserString(state: UserState) {
      if (!state.user) { return null; }
      return state.user.displayName ? state.user.displayName : state.user.email;
    },

    getUserPhotoUrl(state: UserState) {
      if (!state.user) { return null; }
      return state.user.photoURL ? state.user.photoURL : avatarDefault;
    },

    getUserEmail(state: UserState) {
      if (!state.user) { return null; }
      return state.user.email ? state.user.photoURL : 'No email provided';
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
        console.warn('Error', error);
      }
    },

    async logoutUser(context: UserContext) {
      try {
        await firebase.auth().signOut();
        commitSetUser(context, null);
        router.push({ name: 'home' });
      } catch (error) {
        console.warn('Error', error);
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
export const readUserPhotoUrl = read(usersModule.getters.getUserPhotoUrl);
export const readUserEmail = read(usersModule.getters.getUserEmail);

// Actions
export const dispatchValidateUser = dispatch(usersModule.actions.validateUser);
export const dispatchLogoutUser = dispatch(usersModule.actions.logoutUser);
export const dispatchLoginUser = dispatch(usersModule.actions.loginUser);

// Mutations
export const commitSetUser = commit(usersModule.mutations.setUser);
