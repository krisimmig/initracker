import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';

import { usersModule } from './usersModule';
import { npcsModule } from './npcsModule';
import { encountersModule } from './encountersModule';

export interface IRootState {
  version: string;
}

Vue.use(Vuex);

const store: StoreOptions<IRootState> = {

  state: {
    version: '1.0.0',
  },

  modules: {
    usersModule,
    npcsModule,
    encountersModule,
  },
};

export default new Vuex.Store<IRootState>(store);
