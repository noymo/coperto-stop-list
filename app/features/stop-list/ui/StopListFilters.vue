<script setup lang="ts">
import type { Shop } from '#shared/types/menu'
import type { MenuFilters, StatusFilter } from '../model/filters'
import { MENU_STATUS_OPTIONS, SHOP_OPTIONS } from '../model/presentation'

defineProps<{
  filters: MenuFilters
}>()

const emit = defineEmits<{
  shopChange: [value: Shop | null]
  statusChange: [value: StatusFilter]
}>()

function handleShopChange(event: Event): void {
  const value = (event.target as HTMLSelectElement).value

  emit('shopChange', value === '' ? null : (value as Shop))
}

function handleStatusChange(event: Event): void {
  const value = (event.target as HTMLSelectElement).value

  emit('statusChange', value === '' ? null : (value as Exclude<StatusFilter, null>))
}
</script>

<template>
  <div class="mt-8 flex gap-4">
    <label class="flex flex-col gap-2">
      <span class="text-sm font-medium">Цех</span>

      <select
        :value="filters.shop ?? ''"
        class="min-w-48 rounded-lg border border-neutral-300 bg-white px-3 py-2"
        @change="handleShopChange"
      >
        <option value="">Все цеха</option>

        <option v-for="option in SHOP_OPTIONS" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </label>

    <label class="flex flex-col gap-2">
      <span class="text-sm font-medium">Статус</span>

      <select
        :value="filters.status ?? ''"
        class="min-w-48 rounded-lg border border-neutral-300 bg-white px-3 py-2"
        @change="handleStatusChange"
      >
        <option value="">Все статусы</option>

        <option v-for="option in MENU_STATUS_OPTIONS" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </label>
  </div>
</template>
