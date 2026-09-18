<script setup lang="ts">
import { computed, ref } from 'vue'
import type { MenuItem, StopItemPayload } from '#shared/types/menu'
import { useMenuItems } from '~/features/stop-list/model/queries'
import { useMenuFilters } from '~/features/stop-list/model/use-menu-filters'
import { useResumeItem } from '~/features/stop-list/model/use-resume-item'
import { useStopItem } from '~/features/stop-list/model/use-stop-item'
import StopListFilters from '~/features/stop-list/ui/StopListFilters.vue'
import StopListTable from '~/features/stop-list/ui/StopListTable.vue'
import StopReasonPanel from '~/features/stop-list/ui/StopReasonPanel.vue'
import AppToast from '~/shared/ui/AppToast.vue'
import { useStopListUiStore } from '~/stores/stop-list-ui'

const uiStore = useStopListUiStore()

const { filters, setShop, setStatus } = useMenuFilters()
const { data: menuItems, isPending, isError, error } = useMenuItems(filters)

const stopMutation = useStopItem(filters)
const resumeMutation = useResumeItem(filters)

const mutationLocked = ref(false)

const isMutating = computed(
  () => mutationLocked.value || stopMutation.isPending.value || resumeMutation.isPending.value,
)

const selectedItem = ref<MenuItem | null>(null)

const savingIds = computed<string[]>(() => {
  const ids: string[] = []

  if (stopMutation.isPending.value && stopMutation.variables.value?.id) {
    ids.push(stopMutation.variables.value.id)
  }

  if (resumeMutation.isPending.value && resumeMutation.variables.value) {
    ids.push(resumeMutation.variables.value.id)
  }

  return ids
})

function openStopPanel(item: MenuItem): void {
  if (isMutating.value) {
    return
  }

  selectedItem.value = item
  uiStore.openPanel(item.id)
}

function closeStopPanel(): void {
  if (isMutating.value) {
    return
  }

  uiStore.closePanel()
  selectedItem.value = null
}

async function handleStop(payload: StopItemPayload): Promise<void> {
  const itemId = selectedItem.value?.id

  if (!itemId || isMutating.value) {
    return
  }

  mutationLocked.value = true
  let saved = false

  try {
    await stopMutation.mutateAsync({
      id: itemId,
      payload,
    })

    saved = true
  } catch {
    // Ошибка и rollback обрабатываются внутри mutation.onError.
  } finally {
    mutationLocked.value = false
  }

  if (!saved) {
    return
  }

  uiStore.showToast('Изменение сохранено', 'success')
  closeStopPanel()
}

async function handleResume(item: MenuItem): Promise<void> {
  if (isMutating.value) {
    return
  }

  mutationLocked.value = true

  try {
    await resumeMutation.mutateAsync({
      id: item.id,
    })

    uiStore.showToast('Позиция возвращена в продажу', 'success')
  } catch {
    // Ошибка и откат обрабатываются внутри mutation.onError.
  } finally {
    mutationLocked.value = false
  }
}
</script>

<template>
  <main class="min-h-screen bg-app-bg px-4 py-6 sm:px-6 sm:py-8 lg:p-10 text-app-text">
    <div class="mx-auto max-w-6xl">
      <h1 data-stop-list-focus-fallback tabindex="-1" class="text-3xl font-semibold outline-none">Стоп-лист кухни</h1>

      <p class="mt-2 text-sm text-neutral-600">Управление доступностью позиций меню</p>

      <StopListFilters :filters="filters" @shop-change="setShop" @status-change="setStatus" />

      <div v-if="isPending" class="mt-8 rounded-xl bg-white p-6">Загрузка меню...</div>

      <div v-else-if="isError" class="mt-8 rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        Не удалось загрузить меню: {{ error?.message }}
      </div>

      <div v-else-if="!menuItems?.length" class="mt-8 rounded-xl bg-white p-6 text-neutral-500">
        По выбранным фильтрам ничего не найдено
      </div>

      <StopListTable v-else :items="menuItems" :saving-ids="savingIds" @edit="openStopPanel" @resume="handleResume" />
    </div>

    <StopReasonPanel
      :open="uiStore.isPanelOpen"
      :item="selectedItem"
      :pending="isMutating"
      @close="closeStopPanel"
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
