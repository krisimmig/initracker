<template>
  <v-dialog max-width="560" v-model="dialog">
    <template #activator="{ props: activatorProps }">
      <div v-bind="activatorProps">
        <slot name="button" />
      </div>
    </template>

    <v-card>
      <v-card-title class="d-flex align-center justify-space-between pt-4 px-4">
        <span>{{ ability.new ? 'Add ability' : 'Edit ability' }}</span>
        <v-btn icon="mdi-close" variant="text" @click="cancel" />
      </v-card-title>

      <v-divider />

      <v-card-text class="px-4 pt-4 pb-2">
        <v-text-field
          v-model="name"
          label="Name"
          variant="outlined"
          density="compact"
          autofocus
          class="mb-3"
        />
        <v-textarea
          v-model="desc"
          label="Description"
          variant="outlined"
          density="compact"
          rows="5"
          auto-grow
        />
      </v-card-text>

      <v-divider />

      <v-card-actions class="px-4 py-3">
        <v-btn
          v-if="!ability.new"
          color="error"
          variant="text"
          prepend-icon="mdi-delete-outline"
          @click="remove"
        >
          Delete
        </v-btn>
        <v-spacer />
        <v-btn variant="text" @click="cancel">Cancel</v-btn>
        <v-btn
          color="primary"
          variant="tonal"
          prepend-icon="mdi-check"
          :disabled="!name || !desc"
          @click="save"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useConfirmStore } from '@/store/useConfirmStore'

const props = withDefaults(defineProps<{
  ability?: { name: string; desc: string; new: boolean }
}>(), {
  ability: () => ({ name: '', desc: '', new: true }),
})

const emit = defineEmits<{
  change: [payload: object]
}>()

const dialog = ref(false)
const name = ref('')
const desc = ref('')

const confirmStore = useConfirmStore()

onMounted(() => {
  name.value = props.ability.name
  desc.value = props.ability.desc
})

watch(dialog, (isOpen) => {
  if (isOpen) {
    name.value = props.ability.name
    desc.value = props.ability.desc
  }
})

function cancel() {
  dialog.value = false
}

function reset() {
  name.value = ''
  desc.value = ''
}

function save() {
  dialog.value = false
  emit('change', {
    name: name.value,
    desc: desc.value,
    new: !!props.ability.new,
  })
  reset()
}

async function remove() {
  const result = await confirmStore.open({
    message: 'Do you really want to delete this ability?',
  })
  if (result) {
    dialog.value = false
    emit('change', { remove: true })
  }
}
</script>
