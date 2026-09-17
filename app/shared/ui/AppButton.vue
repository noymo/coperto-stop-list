<script setup lang="ts">
type TButtonVariant = 'primary' | 'outline' | 'dark' | 'ghost'

type TButtonSize = 'sm' | 'md' | 'lg' | 'icon'

const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    variant?: TButtonVariant
    size?: TButtonSize
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    type: 'button',
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
  },
)

const variantClasses: Record<TButtonVariant, string> = {
  primary: 'bg-brand text-white hover:bg-brand/90',
  outline: 'border border-brand text-brand hover:bg-brand hover:text-white',
  dark: 'bg-app-text text-white hover:bg-black',
  ghost: 'text-neutral-500 hover:bg-neutral-100',
}

const sizeClasses: Record<TButtonSize, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-4 py-3',
  icon: 'h-10 w-10 p-0 text-xl',
}
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.disabled || props.loading"
    :aria-busy="props.loading || undefined"
    :class="[
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40',
      'disabled:cursor-not-allowed disabled:opacity-50',
      variantClasses[props.variant],
      sizeClasses[props.size],
    ]"
  >
    <span v-if="props.loading" class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />

    <slot />
  </button>
</template>
