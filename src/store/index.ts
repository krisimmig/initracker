import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';

import { userModule } from './userModule';
import { npcsModule } from './npcsModule';

export interface IRootState {
  version: string;
}

Vue.use(Vuex);

const store: StoreOptions<IRootState> = {

  state: {
    version: '1.0.0',
  },

  modules: {
    userModule,
    npcsModule,
  },
};

export default new Vuex.Store<IRootState>(store);
