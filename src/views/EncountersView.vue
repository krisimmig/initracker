<template>
  <div class="Encounters">
    <div v-if="isLoading">
      <v-card class="mb-3">
        <v-skeleton-loader class="mx-auto" type="heading, list-item-two-line" />
      </v-card>
      <v-card class="mb-3">
        <v-skeleton-loader class="mx-auto" type="heading, list-item-two-line" />
      </v-card>
    </div>

    <!-- Empty state: prominent centered create form -->
    <div v-else-if="encounters.length === 0" class="Encounters-empty">
      <v-icon size="64" color="medium-emphasis" class="mb-4">mdi-sword-cross</v-icon>
      <h2 class="text-h5 font-weight-bold mb-2">No encounters yet</h2>
      <p class="text-body-1 text-medium-emphasis mb-6" style="max-width: 440px;">
        An encounter is a battle your party must survive. Create your first one to get started.
      </p>
      <div style="width: 100%; max-width: 440px;">
        <EncounterNew />
      </div>
    </div>

    <!-- Has encounters: list with sidebar -->
    <v-row v-else>
      <v-col cols="12" md="8">
        <div class="d-flex align-center mb-3">
          <h2 class="text-h6 font-weight-bold">Your encounters</h2>
          <v-spacer />
          <v-btn
            color="primary"
            variant="flat"
            size="small"
            prepend-icon="mdi-plus"
            class="d-none d-md-flex"
            @click="scrollToNewEncounter"
          >
            New encounter
          </v-btn>
        </div>

        <ul class="Encounters-list">
          <li v-for="encounter in encounters" :key="encounter.id">
            <EncounterTeaser v-bind="encounter"/>
          </li>
        </ul>
      </v-col>

      <v-col cols="12" md="4">
        <div ref="newEncounterRef">
          <EncounterNew />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useEncountersStore } from '@/store/useEncountersStore'
import EncounterNew from '@/components/encounters/EncounterNew.vue'
import EncounterTeaser from '@/components/encounters/EncounterTeaser.vue'
const encountersStore = useEncountersStore()

const isLoading = computed(() => encountersStore.isLoading)
const encounters = computed(() => encountersStore.encountersAll)
const newEncounterRef = ref<HTMLElement>()

function scrollToNewEncounter() {
  newEncounterRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  newEncounterRef.value?.querySelector('input')?.focus()
}

onMounted(() => {
  encountersStore.fetchEncounters()
})
</script>

<style>
ul.Encounters-list {
  list-style: none;
  padding-left: 0;
}

.Encounters-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 64px 16px;
}
</style>
