<script setup lang="ts">
import type { TToastType } from '~/stores/stop-list-ui'
import AppButton from './AppButton.vue'

defineProps<{
  message: string
  type: TToastType
}>()

defineEmits<{
  close: []
}>()
</script>

<template>
  <div
    role="alert"
    aria-live="assertive"
    :class="[
      'fixed right-6 top-6 z-50 flex min-w-80 items-start justify-between gap-4',
      'rounded-xl border bg-white p-4 shadow-lg',
      type === 'error' ? 'border-red-200 text-red-700' : 'border-green-200 text-green-700',
    ]"
  >
    <span class="text-sm">
      {{ message }}
    </span>

    <AppButton variant="ghost" size="icon" aria-label="Закрыть уведомление" @click="$emit('close')"> × </AppButton>
  </div>
</template>
