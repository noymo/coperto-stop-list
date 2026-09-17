<script setup lang="ts">
import type { ToastType } from '~/stores/stop-list-ui';

defineProps<{
  message: string;
  type: ToastType;
}>();

defineEmits<{
  close: [];
}>();
</script>

<template>
  <div
    role="alert"
    class="fixed right-6 top-6 z-50 flex min-w-80 items-start justify-between gap-4 rounded-xl border bg-white p-4 shadow-lg"
    :class="
      type === 'error'
        ? 'border-red-200 text-red-700'
        : 'border-green-200 text-green-700'
    "
  >
    <span class="text-sm">
      {{ message }}
    </span>

    <button
      type="button"
      aria-label="Закрыть уведомление"
      class="text-xl leading-none opacity-60 hover:opacity-100"
      @click="$emit('close')"
    >
      ×
    </button>
  </div>
</template>
