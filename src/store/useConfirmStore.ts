import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfirmStore = defineStore('confirm', () => {
  const dialog = ref(false)
  const title = ref('')
  const message = ref('')
  let resolveFn: ((v: boolean) => void) | null = null

  function open(opts: { title?: string; message: string }): Promise<boolean> {
    title.value = opts.title ?? 'Are you sure?'
    message.value = opts.message
    dialog.value = true
    return new Promise((resolve) => { resolveFn = resolve })
  }

  function agree() {
    resolveFn?.(true)
    dialog.value = false
  }

  function cancel() {
    resolveFn?.(false)
    dialog.value = false
  }

  return { dialog, title, message, open, agree, cancel }
})
