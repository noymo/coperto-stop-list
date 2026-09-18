<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

interface ISelectOption {
  value: string
  label: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | null
    options: readonly ISelectOption[]
    placeholder?: string
    placeholderDisabled?: boolean
    invalid?: boolean
    disabled?: boolean
  }>(),
  {
    modelValue: null,
    placeholder: '',
    placeholderDisabled: false,
    invalid: false,
    disabled: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

const selectElement = ref<HTMLSelectElement | null>(null)

function handleChange(event: Event): void {
  const select = event.target as HTMLSelectElement

  emit('update:modelValue', select.value === '' ? null : select.value)
}

function focus(): void {
  selectElement.value?.focus()
}

defineExpose({
  focus,
})
</script>

<template>
  <span class="relative block">
    <select
      ref="selectElement"
      v-bind="$attrs"
      :value="props.modelValue ?? ''"
      :disabled="props.disabled"
      :aria-invalid="props.invalid || undefined"
      :class="[
        'block w-full appearance-none rounded-lg border bg-white py-2 pl-3 pr-10 transition',
        'focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20',
        'disabled:cursor-not-allowed disabled:opacity-50',
        props.invalid ? 'border-red-500' : 'border-neutral-300',
      ]"
      @change="handleChange"
    >
      <option v-if="props.placeholder" value="" :disabled="props.placeholderDisabled">
        {{ props.placeholder }}
      </option>

      <option v-for="option in props.options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>

    <svg
      aria-hidden="true"
      class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path d="m6 8 4 4 4-4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
    </svg>
  </span>
</template>
