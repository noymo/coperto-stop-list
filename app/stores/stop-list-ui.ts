import { defineStore } from 'pinia'

export type TToastType = 'success' | 'error'

const TOAST_DURATION_MS = 4000

export const useStopListUiStore = defineStore('stop-list-ui', () => {
  const selectedItemId = ref<string | null>(null)

  const toastMessage = ref<string | null>(null)
  const toastType = ref<TToastType>('error')

  let toastTimer: ReturnType<typeof setTimeout> | null = null

  const isPanelOpen = computed(() => selectedItemId.value !== null)

  function openPanel(id: string): void {
    selectedItemId.value = id
  }

  function closePanel(): void {
    selectedItemId.value = null
  }

  function clearToastTimer(): void {
    if (!toastTimer) {
      return
    }

    clearTimeout(toastTimer)
    toastTimer = null
  }

  function closeToast(): void {
    clearToastTimer()
    toastMessage.value = null
  }

  function showToast(message: string, type: TToastType = 'error'): void {
    clearToastTimer()

    toastMessage.value = message
    toastType.value = type

    toastTimer = setTimeout(() => {
      toastMessage.value = null
      toastTimer = null
    }, TOAST_DURATION_MS)
  }

  return {
    selectedItemId,
    isPanelOpen,
    toastMessage,
    toastType,
    openPanel,
    closePanel,
    showToast,
    closeToast,
  }
})
