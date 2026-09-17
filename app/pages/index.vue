<script setup lang="ts">
import type { MenuItem, StopItemPayload } from '#shared/types/menu'
import { useMenuItems } from '~/features/stop-list/model/queries'
import { useMenuFilters } from '~/features/stop-list/model/use-menu-filters'
import { useResumeItem } from '~/features/stop-list/model/use-resume-item'
import { useStopItem } from '~/features/stop-list/model/use-stop-item'
import StopListFilters from '~/features/stop-list/ui/StopListFilters.vue'
import StopListTable from '~/features/stop-list/ui/StopListTable.vue'
import StopReasonPanel from '~/features/stop-list/ui/StopReasonPanel.vue'
import AppToast from '~/shared/ui/AppToast.vue'

const uiStore = useStopListUiStore()

const { filters, setShop, setStatus } = useMenuFilters()

const { data: menuItems, isPending, isError, error } = useMenuItems(filters)

const stopMutation = useStopItem(filters)

const resumeMutation = useResumeItem(filters)

const selectedItem = computed<MenuItem | null>(() => {
  if (!uiStore.selectedItemId) {
    return null
  }

  return menuItems.value?.find((item) => item.id === uiStore.selectedItemId) ?? null
})

const savingIds = computed<string[]>(() => {
  const ids: string[] = []

  if (stopMutation.isPending.value && stopMutation.variables.value?.id) {
    ids.push(stopMutation.variables.value.id)
  }

  if (resumeMutation.isPending.value && resumeMutation.variables.value?.id) {
    ids.push(resumeMutation.variables.value.id)
  }

  return ids
})

function openStopPanel(item: MenuItem): void {
  uiStore.openPanel(item.id)
}

function handleStop(payload: StopItemPayload): void {
  const item = selectedItem.value

  if (!item) {
    return
  }

  stopMutation.mutate(
    {
      id: item.id,
      payload,
    },
    {
      onSuccess: () => {
        uiStore.showToast('Изменение сохранено', 'success')
      },
    },
  )

  uiStore.closePanel()
}

function handleResume(item: MenuItem): void {
  resumeMutation.mutate(
    {
      id: item.id,
    },
    {
      onSuccess: () => {
        uiStore.showToast('Позиция возвращена в продажу', 'success')
      },
    },
  )
}
</script>

<template>
  <main class="min-h-screen bg-app-bg p-10 text-app-text">
    <div class="mx-auto max-w-6xl">
      <h1 class="text-3xl font-semibold">Стоп-лист кухни</h1>

      <p class="mt-2 text-sm text-neutral-600">Управление доступностью позиций меню</p>

      <StopListFilters :filters="filters" @shop-change="setShop" @status-change="setStatus" />

      <div v-if="isPending" class="mt-8 rounded-xl bg-white p-6">Загрузка меню...</div>

      <div v-else-if="isError" class="mt-8 rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        Не удалось загрузить меню:
        {{ error?.message }}
      </div>

      <div v-else-if="!menuItems?.length" class="mt-8 rounded-xl bg-white p-6 text-neutral-500">
        По выбранным фильтрам ничего не найдено
      </div>

      <StopListTable v-else :items="menuItems" :saving-ids="savingIds" @edit="openStopPanel" @resume="handleResume" />
    </div>

    <StopReasonPanel
      :open="uiStore.isPanelOpen"
      :item="selectedItem"
      :pending="stopMutation.isPending.value"
      @close="uiStore.closePanel"
      @submit="handleStop"
    />

    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <AppToast
        v-if="uiStore.toastMessage"
        :message="uiStore.toastMessage"
        :type="uiStore.toastType"
        @close="uiStore.closeToast"
      />
    </Transition>
  </main>
</template>
