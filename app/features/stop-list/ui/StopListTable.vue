<script setup lang="ts">
import type { MenuItem } from '#shared/types/menu'
import AppBadge from '~/shared/ui/AppBadge.vue'
import AppButton from '~/shared/ui/AppButton.vue'
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
              <AppBadge v-if="item.status.kind === 'available'" variant="success"> В продаже </AppBadge>

              <AppBadge v-else variant="danger"> Стоп </AppBadge>

              <span v-if="savingIds.includes(item.id)" class="text-xs text-neutral-500"> сохраняется... </span>
            </div>
          </td>

          <td class="p-4">
            <template v-if="item.status.kind === 'stopped'">
              <AppBadge variant="neutral">
                {{ getStopReasonLabel(item.status.reason) }} · {{ formatUntil(item.status.until) }}
              </AppBadge>
            </template>

            <span v-else class="text-neutral-400">-</span>
          </td>

          <td class="p-4">
            <div class="flex gap-2">
              <AppButton
                variant="outline"
                size="sm"
                :disabled="savingIds.includes(item.id)"
                @click="$emit('edit', item)"
              >
                {{ item.status.kind === 'stopped' ? 'Изменить' : 'В стоп-лист' }}
              </AppButton>

              <span
                v-if="item.status.kind === 'stopped'"
                :title="item.stock === 0 ? 'Нельзя вернуть позицию при нулевом остатке' : ''"
              >
                <AppButton
                  variant="dark"
                  size="sm"
                  :disabled="item.stock === 0 || savingIds.includes(item.id)"
                  @click="$emit('resume', item)"
                >
                  Вернуть в продажу
                </AppButton>
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
