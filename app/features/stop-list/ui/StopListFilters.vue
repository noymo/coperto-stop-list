<script setup lang="ts">
import { isMenuStatus, isShop } from '#shared/constants/menu'
import type { Shop } from '#shared/types/menu'
import AppSelect from '~/shared/ui/AppSelect.vue'
import type { MenuFilters, StatusFilter } from '../model/filters'
import { MENU_STATUS_OPTIONS, SHOP_OPTIONS } from '../model/presentation'

defineProps<{
  filters: MenuFilters
}>()

const emit = defineEmits<{
  shopChange: [value: Shop | null]
  statusChange: [value: StatusFilter]
}>()

function handleShopChange(value: string | null): void {
  emit('shopChange', isShop(value) ? value : null)
}

function handleStatusChange(value: string | null): void {
  emit('statusChange', isMenuStatus(value) ? value : null)
}
</script>

<template>
  <div class="mt-8 flex gap-4">
    <label class="flex flex-col gap-2">
      <span class="text-sm font-medium">Цех</span>

      <AppSelect
        :model-value="filters.shop"
        :options="SHOP_OPTIONS"
        placeholder="Все цеха"
        class="min-w-48"
        @update:model-value="handleShopChange"
      />
    </label>

    <label class="flex flex-col gap-2">
      <span class="text-sm font-medium">Статус</span>

      <AppSelect
        :model-value="filters.status"
        :options="MENU_STATUS_OPTIONS"
        placeholder="Все статусы"
        class="min-w-48"
        @update:model-value="handleStatusChange"
      />
    </label>
  </div>
</template>
