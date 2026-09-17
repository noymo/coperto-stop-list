<script setup lang="ts">
type TBadgeVariant = 'success' | 'danger' | 'neutral'

const props = withDefaults(
  defineProps<{
    variant?: TBadgeVariant
  }>(),
  {
    variant: 'neutral',
  },
)

const variantClasses: Record<TBadgeVariant, string> = {
  success: 'bg-green-100 text-green-800',
  danger: 'bg-red-100 text-red-800',
  neutral: 'bg-neutral-100 text-neutral-700',
}
</script>

<template>
  <span :class="['inline-flex items-center rounded-full px-3 py-1 text-sm', variantClasses[props.variant]]">
    <slot />
  </span>
</template>
