<template>
  <div class="Home">
    <div class="">
      <PageTitle
        title="Welcome home"
        subtitle="your monsters are waiting."
      />

      <div class="u-container-fluid max-w-3xl">
        <div class="card card--rounded card--shadow">
          <h1 class="h1 text-center mb-0 font-light">YAIT</h1>
          <p class="italic text-gray-500 mb-5 text-sm text-center">yet another initative tracker</p>
          <p>This is the home of YAIT, which currently is the name of this Dungeons and Dragons helper app for dungeon masters and players. YAIT stands for yet another initiative tracker and it helps you as a Dungeon Master to keep track of all monsters, characters and other combatants during an enounter.</p>

          <h4 class="h4 mt-4">Character Builder</h4>
          <p>On the <router-link :to="{ name: 'characters' }">Character Builder</router-link> pages you can add NPCs and monsters that you create yourselve. Also all of your players characters can be created here so that you can add them to encounters as well. You can either start with a character or monster based on an existing one or start from scratch.</p>

          <h4 class="h4 mt-4">Encounters</h4>
          <p>You can create and preplan all your encounters on the <router-link :to="{ name: 'encounters' }">encounters overview</router-link> page. Simply give it a name, hit save and add monsters and players to your newly created encounter. Your are probably also want to add some of your players characters to the mix, to do just that, read the newxt part about the Character Builder.</p>

          <h4 class="h4 mt-4">Give Feedback</h4>
          <p>Once you have seen all the features that we have build so far, please give us some <router-link :to="{ name: 'encounters' }">feedback</router-link> about new features you want to see or bugs you might have necountered. You can also subscirbe to our newsletter or join our reddit community.</p>

          <h4 class="h4 mt-4">Roadmap</h4>
          <p>There are a lot of features that we want to add to this app. If you want to participate in what features those are, feel free to send <router-link :to="{ name: 'encounters' }">feedback</router-link>. Here is a list of some of the most important ones we have on our list:</p>
          <ul>
            <li>- Sharing the encounter with your players via a custom URL</li>
            <li>- Let players edit and create their own payer character sheets for your campaign</li>
            <li>- Adding support for background music</li>
            <li>- More tools for the DM like town generators, name genertor, loot, etc.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import PageTitle from '@/components/common/PageTitle.vue';

@Component({
  components: {
    PageTitle,
  },
})
export default class Home extends Vue {}
</script>

