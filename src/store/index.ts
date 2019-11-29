import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';

import { usersModule } from '@/store/usersModule';
import { npcsModule } from '@/store/npcsModule';
import { encountersModule } from '@/store/encountersModule';
import { charactersModule } from '@/store/charactersModule';
import { characterBuilderModule } from '@/store/characterBuilderModule';

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
