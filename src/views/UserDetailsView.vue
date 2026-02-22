<template>
  <div class="UserDetails">
    <div class="">
      <PageTitle title="User Details" />

      <div class="card w-3/12">
        <img v-if="photoUrl" :src="photoUrl" alt="User Avatar" class="mb-4">
        <p><span class="font-weight-bold">Name:</span> {{ displayName }}</p>
        <p><span class="font-weight-bold">Email:</span> {{ email }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PageTitle from '@/components/common/PageTitle.vue'
import { useUsersStore } from '@/store/useUsersStore'

const usersStore = useUsersStore()

const photoUrl = computed(() => usersStore.userPhotoUrl)
const displayName = computed(() => usersStore.userString)
const email = computed(() => usersStore.userEmail)
</script>
