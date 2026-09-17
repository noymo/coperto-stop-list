import { defineStore } from 'pinia';

export type ToastType = 'success' | 'error';

export const useStopListUiStore = defineStore('stop-list-ui', () => {
  const selectedItemId = ref<string | null>(null);

  const toastMessage = ref<string | null>(null);
  const toastType = ref<ToastType>('error');

  let toastTimer: ReturnType<typeof setTimeout> | null = null;

  const isPanelOpen = computed(() => selectedItemId.value !== null);

  function openPanel(id: string): void {
    selectedItemId.value = id;
  }

  function closePanel(): void {
    selectedItemId.value = null;
  }

  function showToast(message: string, type: ToastType = 'error'): void {
    toastMessage.value = message;
    toastType.value = type;

    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    toastTimer = setTimeout(() => {
      toastMessage.value = null;
    }, 4000);
  }

  function closeToast(): void {
    toastMessage.value = null;
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
  };
});
