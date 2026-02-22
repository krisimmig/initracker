import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSnackbarStore = defineStore('snackbar', () => {
  const message = ref('')
  const visible = ref(false)
  const timeout = ref(4000)

  function show(msg: string, opts?: { timeout?: number }) {
    message.value = msg
    timeout.value = opts?.timeout ?? 4000
    visible.value = true
  }

  return { message, visible, timeout, show }
})
