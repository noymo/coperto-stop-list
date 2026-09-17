<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';

import type { MenuItem, StopItemPayload } from '#shared/types/menu';

import { stopItemSchema } from '#shared/schemas/stop-item';

const props = defineProps<{
  item: MenuItem | null;
  open: boolean;
  pending: boolean;
}>();

const emit = defineEmits<{
  close: [];
  submit: [payload: StopItemPayload];
}>();

const validationSchema = toTypedSchema(stopItemSchema);

const { errors, defineField, handleSubmit, resetForm, setFieldValue } = useForm(
  {
    validationSchema,
    initialValues: {
      reason: undefined,
      until: null,
    },
  },
);

const [reason, reasonAttrs] = defineField('reason', {
  validateOnBlur: true,
  validateOnModelUpdate: false,
});

const [until, untilAttrs] = defineField('until', {
  validateOnBlur: true,
  validateOnModelUpdate: false,
});

const reasonSelect = ref<HTMLSelectElement | null>(null);

function toLocalDateTime(iso: string): string {
  const date = new Date(iso);
  const offset = date.getTimezoneOffset() * 60_000;

  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function getNextQuarter(): string {
  const date = new Date();

  date.setSeconds(0, 0);

  const minutes = date.getMinutes();

  date.setMinutes(Math.ceil((minutes + 1) / 15) * 15);

  const offset = date.getTimezoneOffset() * 60_000;

  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function getMaxTime(): string {
  const date = new Date(Date.now() + 24 * 60 * 60 * 1000);

  return toLocalDateTime(date.toISOString());
}

function setUntilMode(mode: 'shift' | 'time'): void {
  if (mode === 'shift') {
    setFieldValue('until', null);
    return;
  }

  if (until.value === null) {
    setFieldValue('until', getNextQuarter());
  }
}

const isSpecificTime = computed(() => until.value !== null);

const submitForm = handleSubmit((values) => {
  const payload: StopItemPayload = {
    reason: values.reason,
    until: values.until === null ? null : new Date(values.until).toISOString(),
  };

  emit('submit', payload);
});

function handleEscape(event: KeyboardEvent): void {
  if (event.key === 'Escape' && props.open && !props.pending) {
    emit('close');
  }
}

watch(
  () => [props.open, props.item] as const,
  async ([open, item]) => {
    if (!open || !item) {
      return;
    }

    if (item.status.kind === 'stopped') {
      resetForm({
        values: {
          reason: item.status.reason,
          until: item.status.until ? toLocalDateTime(item.status.until) : null,
        },
      });
    } else {
      resetForm({
        values: {
          reason: undefined,
          until: null,
        },
      });
    }

    await nextTick();

    reasonSelect.value?.focus();
  },
);

onMounted(() => {
  window.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape);
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open && item"
      class="fixed inset-0 z-40 bg-black/30"
      @click.self="!pending && $emit('close')"
    >
      <div
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
        role="dialog"
        aria-modal="true"
        aria-labelledby="stop-panel-title"
        class="ml-auto flex h-full w-full max-w-md flex-col bg-[#F6F3EE] p-6 shadow-xl"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 id="stop-panel-title" class="text-xl font-semibold">
              {{
                item.status.kind === 'stopped'
                  ? 'Изменить стоп'
                  : 'Поставить в стоп'
              }}
            </h2>

            <p class="mt-1 block text-sm text-red-600">
              {{ item.title }}
            </p>
          </div>

          <button
            type="button"
            aria-label="Закрыть панель"
            :disabled="pending"
            class="text-2xl text-neutral-500 disabled:opacity-40"
            @click="$emit('close')"
          >
            ×
          </button>
        </div>

        <form class="mt-8 flex flex-1 flex-col" @submit.prevent="submitForm">
          <label>
            <span class="text-sm font-medium"> Причина </span>

            <select
              ref="reasonSelect"
              v-model="reason"
              v-bind="reasonAttrs"
              class="mt-2 w-full rounded-lg border bg-white px-3 py-2"
              :class="errors.reason ? 'border-red-500' : 'border-neutral-300'"
            >
              <option :value="undefined" disabled>Выберите причину</option>

              <option value="out_of_stock">Закончились продукты</option>

              <option value="equipment">Сломалось оборудование</option>

              <option value="quality">Вопросы к качеству</option>

              <option value="menu_change">Позиция выведена из меню</option>
            </select>

            <span v-if="errors.reason" class="mt-1 text-sm text-red-600">
              {{ errors.reason }}
            </span>
          </label>

          <fieldset class="mt-6">
            <legend class="text-sm font-medium">Срок стопа</legend>

            <label class="mt-3 flex items-center gap-2">
              <input
                type="radio"
                name="until-mode"
                :checked="!isSpecificTime"
                @change="setUntilMode('shift')"
              >

              До конца смены
            </label>

            <label class="mt-3 flex items-center gap-2">
              <input
                type="radio"
                name="until-mode"
                :checked="isSpecificTime"
                @change="setUntilMode('time')"
              >

              До конкретного времени
            </label>

            <input
              v-if="isSpecificTime"
              v-model="until"
              v-bind="untilAttrs"
              type="datetime-local"
              step="900"
              :min="getNextQuarter()"
              :max="getMaxTime()"
              class="mt-3 w-full rounded-lg border bg-white px-3 py-2"
              :class="errors.until ? 'border-red-500' : 'border-neutral-300'"
            >

            <span v-if="errors.until" class="mt-1 text-sm text-red-600">
              {{ errors.until }}
            </span>
          </fieldset>

          <button
            type="submit"
            :disabled="pending"
            class="mt-auto flex items-center justify-center gap-2 rounded-lg bg-[#C6462F] px-4 py-3 font-medium text-white disabled:opacity-60"
          >
            <span
              v-if="pending"
              class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
            />

            {{ pending ? 'Сохраняем...' : 'Сохранить' }}
          </button>
        </form>
      </div>
    </div>
  </Teleport>
</template>
