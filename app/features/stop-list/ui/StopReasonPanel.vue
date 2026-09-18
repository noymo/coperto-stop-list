<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { isStopReason } from '#shared/constants/menu'
import { STOP_MAX_DURATION_MS, STOP_TIME_STEP_MINUTES, STOP_TIME_STEP_SECONDS } from '#shared/constants/stop-list'
import { stopItemSchema } from '#shared/schemas/stop-item'
import type { MenuItem, StopItemPayload } from '#shared/types/menu'
import AppButton from '~/shared/ui/AppButton.vue'
import AppSelect from '~/shared/ui/AppSelect.vue'
import { STOP_REASON_OPTIONS } from '../model/presentation'

const props = defineProps<{
  item: MenuItem | null
  open: boolean
  pending: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [payload: StopItemPayload]
}>()

const validationSchema = toTypedSchema(stopItemSchema)

const { errors, defineField, handleSubmit, resetForm, setFieldValue } = useForm({
  validationSchema,
  initialValues: {
    reason: undefined,
    until: null,
  },
})

const [reason, reasonAttrs] = defineField('reason', {
  validateOnBlur: true,
  validateOnModelUpdate: false,
})

const [until, untilAttrs] = defineField('until', {
  validateOnBlur: true,
  validateOnModelUpdate: false,
})

const reasonSelect = ref<InstanceType<typeof AppSelect> | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const previouslyFocusedElement = ref<HTMLElement | null>(null)
const openedAt = ref(Date.now())

function toLocalDateTime(iso: string): string {
  const date = new Date(iso)
  const offset = date.getTimezoneOffset() * 60_000

  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

const minStopTime = computed(() => {
  const date = new Date(openedAt.value)

  date.setSeconds(0, 0)

  const remainder = date.getMinutes() % STOP_TIME_STEP_MINUTES
  const minutesToAdd = remainder === 0 ? STOP_TIME_STEP_MINUTES : STOP_TIME_STEP_MINUTES - remainder

  date.setMinutes(date.getMinutes() + minutesToAdd)

  return toLocalDateTime(date.toISOString())
})

const maxStopTime = computed(() => {
  const date = new Date(openedAt.value + STOP_MAX_DURATION_MS)

  return toLocalDateTime(date.toISOString())
})

const isSpecificTime = computed(() => until.value !== null)

function setUntilMode(mode: 'shift' | 'time'): void {
  if (mode === 'shift') {
    setFieldValue('until', null)
    return
  }

  if (until.value === null) {
    setFieldValue('until', minStopTime.value)
  }
}

function handleReasonChange(value: string | null): void {
  setFieldValue('reason', isStopReason(value) ? value : undefined)
}

const submitForm = handleSubmit((values) => {
  const payload: StopItemPayload = {
    reason: values.reason,
    until: values.until === null ? null : new Date(values.until).toISOString(),
  }

  emit('submit', payload)
})

function getFocusableElements(): HTMLElement[] {
  if (!panelRef.value) {
    return []
  }

  const selector = [
    'button:not([disabled])',
    'select:not([disabled])',
    'input:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ')

  return Array.from(panelRef.value.querySelectorAll<HTMLElement>(selector))
}

function restorePreviousFocus(): void {
  const previous = previouslyFocusedElement.value

  if (previous?.isConnected) {
    previous.focus()
  } else {
    document.querySelector<HTMLElement>('[data-stop-list-focus-fallback]')?.focus()
  }

  previouslyFocusedElement.value = null
}

function handlePanelKeydown(event: KeyboardEvent): void {
  if (!props.open) {
    return
  }

  if (event.key === 'Escape') {
    if (!props.pending) {
      emit('close')
    }

    return
  }

  if (event.key !== 'Tab') {
    return
  }

  const focusableElements = getFocusableElements()

  if (focusableElements.length === 0) {
    event.preventDefault()
    panelRef.value?.focus()
    return
  }

  const first = focusableElements[0]
  const last = focusableElements[focusableElements.length - 1]
  const activeElement = document.activeElement
  const isInsidePanel = activeElement instanceof Node && panelRef.value?.contains(activeElement)

  if (event.shiftKey && (!isInsidePanel || activeElement === first)) {
    event.preventDefault()
    last?.focus()
    return
  }

  if (!event.shiftKey && (!isInsidePanel || activeElement === last)) {
    event.preventDefault()
    first?.focus()
  }
}

watch(
  () => [props.open, props.item?.id] as const,
  async ([open, itemId], [wasOpen]) => {
    if (!open) {
      if (wasOpen) {
        await nextTick()
        restorePreviousFocus()
      }

      return
    }

    const item = props.item

    if (!itemId || !item) {
      return
    }

    if (!wasOpen) {
      previouslyFocusedElement.value = document.activeElement instanceof HTMLElement ? document.activeElement : null
    }

    openedAt.value = Date.now()

    if (item.status.kind === 'stopped') {
      resetForm({
        values: {
          reason: item.status.reason,
          until: item.status.until ? toLocalDateTime(item.status.until) : null,
        },
      })
    } else {
      resetForm({
        values: {
          reason: undefined,
          until: null,
        },
      })
    }

    await nextTick()
    reasonSelect.value?.focus()
  },
)

onMounted(() => {
  window.addEventListener('keydown', handlePanelKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handlePanelKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open && item" class="fixed inset-0 z-40 bg-black/30" @click.self="!pending && $emit('close')">
      <div
        ref="panelRef"
        v-motion
        :initial="{
          opacity: 0,
          x: 80,
        }"
        :enter="{
          opacity: 1,
          x: 0,
        }"
        :leave="{
          opacity: 0,
          x: 80,
        }"
        tabindex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="stop-panel-title"
        class="ml-auto flex h-full w-full max-w-md flex-col bg-app-bg p-6 shadow-xl"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 id="stop-panel-title" class="text-xl font-semibold">
              {{ item.status.kind === 'stopped' ? 'Изменить стоп' : 'Поставить в стоп' }}
            </h2>

            <p class="mt-1 block text-sm text-app-text/60">
              {{ item.title }}
            </p>
          </div>

          <AppButton
            variant="ghost"
            size="icon"
            aria-label="Закрыть панель"
            :disabled="pending"
            @click="$emit('close')"
          >
            ×
          </AppButton>
        </div>

        <form class="mt-8 flex flex-1 flex-col" @submit.prevent="submitForm">
          <label>
            <span class="text-sm font-medium">Причина</span>

            <div class="mt-2">
              <AppSelect
                ref="reasonSelect"
                v-bind="reasonAttrs"
                :model-value="reason ?? null"
                :options="STOP_REASON_OPTIONS"
                :invalid="Boolean(errors.reason)"
                placeholder="Выберите причину"
                placeholder-disabled
                @update:model-value="handleReasonChange"
              />
            </div>

            <span v-if="errors.reason" class="mt-1 text-sm text-red-600">
              {{ errors.reason }}
            </span>
          </label>

          <fieldset class="mt-6">
            <legend class="text-sm font-medium">Срок стопа</legend>

            <label class="mt-3 flex items-center gap-2">
              <input type="radio" name="until-mode" :checked="!isSpecificTime" @change="setUntilMode('shift')" />

              До конца смены
            </label>

            <label class="mt-3 flex items-center gap-2">
              <input type="radio" name="until-mode" :checked="isSpecificTime" @change="setUntilMode('time')" />

              До конкретного времени
            </label>

            <input
              v-if="isSpecificTime"
              v-model="until"
              v-bind="untilAttrs"
              type="datetime-local"
              :step="STOP_TIME_STEP_SECONDS"
              :min="minStopTime"
              :max="maxStopTime"
              class="mt-3 w-full rounded-lg border bg-white px-3 py-2"
              :class="errors.until ? 'border-red-500' : 'border-neutral-300'"
            />

            <span v-if="errors.until" class="mt-1 text-sm text-red-600">
              {{ errors.until }}
            </span>
          </fieldset>

          <AppButton type="submit" variant="primary" size="lg" :loading="pending" class="mt-auto w-full">
            {{ pending ? 'Сохраняем...' : 'Сохранить' }}
          </AppButton>
        </form>
      </div>
    </div>
  </Teleport>
</template>
