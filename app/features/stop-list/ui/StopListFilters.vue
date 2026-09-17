<script setup lang="ts">
import type { Shop } from '#shared/types/menu'
import type { MenuFilters, StatusFilter } from '../model/filters'
import { SHOP_OPTIONS, STATUS_OPTIONS } from '../model/presentation'
import AppSelect from '~/shared/ui/AppSelect.vue'

defineProps<{
  filters: MenuFilters
}>()

const emit = defineEmits<{
  shopChange: [value: Shop | null]
  statusChange: [value: StatusFilter]
}>()

function handleShopChange(value: string | null): void {
  emit('shopChange', value as Shop | null)
}

function handleStatusChange(value: string | null): void {
  emit('statusChange', value as StatusFilter)
}
</script>

<template>
  <div class="mt-8 flex flex-wrap gap-4">
    <label class="flex flex-col gap-2">
      <span class="text-sm font-medium"> Цех </span>

      <AppSelect
        class="min-w-48"
        :model-value="filters.shop"
        :options="SHOP_OPTIONS"
        placeholder="Все цеха"
        @update:model-value="handleShopChange"
      />
    </label>

    <label class="flex flex-col gap-2">
      <span class="text-sm font-medium"> Статус </span>

      <AppSelect
        class="min-w-48"
        :model-value="filters.status"
        :options="STATUS_OPTIONS"
        placeholder="Все статусы"
        @update:model-value="handleStatusChange"
      />
    </label>
  </div>
</template>
