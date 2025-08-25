<template>
  <div :class="[
    'button-group',
    `button-group--${direction}`,
    `button-group--${spacing}`,
    { 'button-group--wrap': wrap }
  ]">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  direction: {
    type: String,
    default: 'horizontal',
    validator: value => ['horizontal', 'vertical'].includes(value)
  },
  spacing: {
    type: String,
    default: 'sm',
    validator: value => ['xs', 'sm', 'md', 'lg'].includes(value)
  },
  wrap: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.button-group {
  display: flex;
  align-items: center;
}

.button-group--horizontal {
  flex-direction: row;
}

.button-group--vertical {
  flex-direction: column;
}

.button-group--wrap {
  flex-wrap: wrap;
}

/* Spacing variants */
.button-group--xs {
  gap: 0.25rem;
}

.button-group--sm {
  gap: 0.5rem;
}

.button-group--md {
  gap: 0.75rem;
}

.button-group--lg {
  gap: 1rem;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .button-group--horizontal {
    flex-direction: column;
    align-items: stretch;
  }
  
  .button-group--horizontal .button-group > * {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .button-group {
    gap: 0.25rem;
  }
}
</style>