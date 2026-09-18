<script setup lang="ts">
import type { MenuItem } from '#shared/types/menu'
import { getShopLabel, getStopReasonLabel } from '../model/presentation'

defineProps<{
  items: MenuItem[]
  savingIds: string[]
}>()

defineEmits<{
  edit: [item: MenuItem]
  resume: [item: MenuItem]
}>()

function formatUntil(until: string | null): string {
  if (until === null) {
    return 'До конца смены'
  }

  return new Date(until).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="mt-8 overflow-x-auto rounded-xl bg-white">
    <table class="w-full min-w-[900px] border-collapse text-left">
      <thead class="border-b border-neutral-200 bg-neutral-50">
        <tr>
          <th class="p-4 font-medium">Позиция</th>
          <th class="p-4 font-medium">Цех</th>
          <th class="p-4 font-medium">Остаток</th>
          <th class="p-4 font-medium">Статус</th>
          <th class="p-4 font-medium">Причина / срок</th>
          <th class="p-4 font-medium">Действия</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="item in items"
          :key="item.id"
          class="border-b border-neutral-100 transition last:border-b-0"
          :class="{
            'bg-neutral-50 opacity-65': item.status.kind === 'stopped',
          }"
        >
          <td class="p-4 font-medium">
            {{ item.title }}
          </td>

          <td class="p-4">
            {{ getShopLabel(item.shop) }}
          </td>

          <td class="p-4">{{ item.stock }} шт.</td>

          <td class="p-4">
            <div class="flex items-center gap-2">
              <span
                v-if="item.status.kind === 'available'"
                class="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800"
              >
                В продаже
              </span>

              <span v-else class="rounded-full bg-red-100 px-3 py-1 text-sm text-red-800"> Стоп </span>

              <span v-if="savingIds.includes(item.id)" class="text-xs text-neutral-500"> сохраняется... </span>
            </div>
          </td>

          <td class="p-4">
            <template v-if="item.status.kind === 'stopped'">
              <div>
                {{ getStopReasonLabel(item.status.reason) }}
              </div>

              <div class="mt-1 text-sm text-neutral-500">
                {{ formatUntil(item.status.until) }}
              </div>
            </template>

            <span v-else class="text-neutral-400">-</span>
          </td>

          <td class="p-4">
            <div class="flex gap-2">
              <button
                type="button"
                class="rounded-lg border border-[#C6462F] px-3 py-2 text-sm font-medium text-[#C6462F] transition hover:bg-[#C6462F] hover:text-white"
                @click="$emit('edit', item)"
              >
                {{ item.status.kind === 'stopped' ? 'Изменить' : 'В стоп-лист' }}
              </button>

              <span
                v-if="item.status.kind === 'stopped'"
                :title="item.stock === 0 ? 'Нельзя вернуть позицию при нулевом остатке' : ''"
              >
                <button
                  type="button"
                  :disabled="item.stock === 0 || savingIds.includes(item.id)"
                  class="rounded-lg bg-[#171512] px-3 py-2 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-30"
                  @click="$emit('resume', item)"
                >
                  Вернуть в продажу
                </button>
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
