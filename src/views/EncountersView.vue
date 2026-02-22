<template>
  <div class="Encounters">
    <PageTitle title="Encounters" subtitle="These are all your encounters" />

    <v-row>
      <v-col>
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
            Nothing here yet, please create a new encounter on the right.
          </v-alert>
        </template>
      </v-col>

      <v-col cols="4">
        <EncounterNew />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { IEncounterEntity } from '@/types/encounters'
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
