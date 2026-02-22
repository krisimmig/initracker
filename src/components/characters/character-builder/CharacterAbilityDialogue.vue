<template>
  <v-dialog max-width="600px" v-model="dialog">
    <template v-slot:activator="{ props: activatorProps }">
      <div v-bind="activatorProps">
        <slot name="button"></slot>
      </div>
    </template>

    <v-card>
      <v-card-title>
        <span class="text-h6" v-if="!ability.new">Update ability</span>
        <span class="text-h6" v-else>Add a new ability</span>
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="name" label="Ability name" />
        <v-textarea v-model="desc" label="Ability description" />
      </v-card-text>
      <v-card-actions>
        <v-btn v-if="!ability.new" variant="text" color="error" @click="remove">Delete</v-btn>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="cancel" color="primary">Cancel</v-btn>
        <v-btn variant="text" @click="save" color="primary" :disabled="!name || !desc">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
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
