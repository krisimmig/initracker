<template>
  <div class="Encounters">
    <PageTitle title="Encounters" subtitle="These are all your encounters" icon="mdi-sword-cross" />

    <v-row>
      <!-- New encounter: first on mobile, right column on md+ -->
      <v-col cols="12" md="4" :order="1" :order-md="2">
        <EncounterNew />
      </v-col>

      <!-- Encounter list: second on mobile, left column on md+ -->
      <v-col cols="12" md="8" :order="2" :order-md="1">
        <div v-if="isLoading">
          <v-card class="mb-3">
            <v-skeleton-loader class="mx-auto" type="heading, list-item-two-line" />
          </v-card>
          <v-card class="mb-3">
            <v-skeleton-loader class="mx-auto" type="heading, list-item-two-line" />
          </v-card>
        </div>

        <template v-if="!isLoading">
          <ul v-if="encounters.length > 0" class="Encounters-list">
            <li v-for="encounter in encounters" :key="encounter.id">
              <EncounterTeaser v-bind="encounter"/>
            </li>
          </ul>

          <v-alert v-else type="info" variant="outlined">
            Nothing here yet, create a new encounter above.
          </v-alert>
        </template>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useEncountersStore } from '@/store/useEncountersStore'
import EncounterNew from '@/components/encounters/EncounterNew.vue'
import EncounterTeaser from '@/components/encounters/EncounterTeaser.vue'
import PageTitle from '@/components/common/PageTitle.vue'

const encountersStore = useEncountersStore()

const isLoading = computed(() => encountersStore.isLoading)
const encounters = computed(() => encountersStore.encountersAll)

onMounted(() => {
  encountersStore.fetchEncounters()
})
</script>

<style>
ul.Encounters-list {
  list-style: none;
  padding-left: 0;
}
</style>
