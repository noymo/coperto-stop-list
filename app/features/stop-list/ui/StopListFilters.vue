<script setup lang="ts">
import type { Shop } from '#shared/types/menu';
import type { MenuFilters, StatusFilter } from '../model/filters';

defineProps<{
  filters: MenuFilters;
}>();

const emit = defineEmits<{
  shopChange: [value: Shop | null];
  statusChange: [value: StatusFilter];
}>();

function handleShopChange(event: Event) {
  const select = event.target as HTMLSelectElement;

  const value = select.value;

  emit('shopChange', value === '' ? null : (value as Shop));
}

function handleStatusChange(event: Event) {
  const select = event.target as HTMLSelectElement;

  const value = select.value;

  emit(
    'statusChange',
    value === '' ? null : (value as Exclude<StatusFilter, null>),
  );
}
</script>

<template>
  <div class="mt-8 flex gap-4">
    <label class="flex flex-col gap-2">
      <span class="text-sm font-medium"> Цех </span>

      <select
        :value="filters.shop ?? ''"
        class="min-w-48 rounded-lg border border-neutral-300 bg-white px-3 py-2"
        @change="handleShopChange"
      >
        <option value="">Все цеха</option>

        <option value="kitchen">Кухня</option>

        <option value="bar">Бар</option>

        <option value="pastry">Кондитерская</option>
      </select>
    </label>

    <label class="flex flex-col gap-2">
      <span class="text-sm font-medium"> Статус </span>

      <select
        :value="filters.status ?? ''"
        class="min-w-48 rounded-lg border border-neutral-300 bg-white px-3 py-2"
        @change="handleStatusChange"
      >
        <option value="">Все статусы</option>

        <option value="available">В продаже</option>

        <option value="stopped">В стоп-листе</option>
      </select>
    </label>
  </div>
</template>
