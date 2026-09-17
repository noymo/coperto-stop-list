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
  <select
    ref="selectElement"
    v-bind="$attrs"
    :value="props.modelValue ?? ''"
    :disabled="props.disabled"
    :aria-invalid="props.invalid || undefined"
    :class="[
      'w-full rounded-lg border bg-white px-3 py-2 transition',
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
</template>
