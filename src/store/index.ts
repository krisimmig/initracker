import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';

import { usersModule } from './usersModule';
import { npcsModule } from './npcsModule';
import { encountersModule } from './encountersModule';
import { charactersModule } from './charactersModule';
import { characterBuilderModule } from './characterBuilderModule';

export interface RootState {
  version: string;
}

Vue.use(Vuex);

const store: StoreOptions<RootState> = {

  state: {
    version: '1.0.0',
  },

  modules: {
    usersModule,
    npcsModule,
    encountersModule,
    charactersModule,
    characterBuilderModule,
  },
};

export default new Vuex.Store<RootState>(store);
