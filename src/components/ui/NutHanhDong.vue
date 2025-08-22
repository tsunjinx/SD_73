<template>
  <button
    :class="[
      'action-btn',
      `action-btn--${variant}`,
      `action-btn--${size}`,
      { 'action-btn--disabled': disabled }
    ]"
    :disabled="disabled"
    :title="tooltip"
    @click="$emit('click', $event)"
  >
    <svg v-if="icon === 'view'" viewBox="0 0 24 24" fill="currentColor" class="action-btn__icon">
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
    </svg>
    <svg v-else-if="icon === 'edit'" viewBox="0 0 24 24" fill="currentColor" class="action-btn__icon">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    </svg>
    <svg v-else-if="icon === 'delete'" viewBox="0 0 24 24" fill="currentColor" class="action-btn__icon">
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
    </svg>
    <svg v-else-if="icon === 'add'" viewBox="0 0 24 24" fill="currentColor" class="action-btn__icon">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
    </svg>
    <svg v-else-if="icon === 'download'" viewBox="0 0 24 24" fill="currentColor" class="action-btn__icon">
      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
    </svg>
    <svg v-else-if="icon === 'upload'" viewBox="0 0 24 24" fill="currentColor" class="action-btn__icon">
      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
    </svg>
    <svg v-else-if="icon === 'search'" viewBox="0 0 24 24" fill="currentColor" class="action-btn__icon">
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
    </svg>
    <svg v-else viewBox="0 0 24 24" fill="currentColor" class="action-btn__icon">
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
    </svg>
    <span v-if="showLabel" class="action-btn__label">{{ label }}</span>
  </button>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: value => ['primary', 'secondary', 'success', 'warning', 'danger', 'info'].includes(value)
  },
  size: {
    type: String,
    default: 'sm',
    validator: value => ['xs', 'sm', 'md', 'lg'].includes(value)
  },
  icon: {
    type: String,
    required: true,
    validator: value => ['view', 'edit', 'delete', 'add', 'download', 'upload', 'search'].includes(value)
  },
  label: {
    type: String,
    default: ''
  },
  showLabel: {
    type: Boolean,
    default: false
  },
  tooltip: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])
</script>

<style scoped>
.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  white-space: nowrap;
  user-select: none;
  position: relative;
  overflow: hidden;
}

.action-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.action-btn:disabled,
.action-btn--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Sizes */
.action-btn--xs {
  padding: 0.25rem;
  min-width: 1.5rem;
  min-height: 1.5rem;
}

.action-btn--sm {
  padding: 0.375rem;
  min-width: 2rem;
  min-height: 2rem;
}

.action-btn--md {
  padding: 0.5rem 0.75rem;
  min-height: 2.25rem;
}

.action-btn--lg {
  padding: 0.75rem 1rem;
  min-height: 2.75rem;
  font-size: 1rem;
}

/* Icon sizes */
.action-btn--xs .action-btn__icon {
  width: 0.875rem;
  height: 0.875rem;
}

.action-btn--sm .action-btn__icon {
  width: 1rem;
  height: 1rem;
}

.action-btn--md .action-btn__icon {
  width: 1.125rem;
  height: 1.125rem;
}

.action-btn--lg .action-btn__icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Variants */
.action-btn--primary {
  background-color: #3b82f6;
  color: white;
}

.action-btn--primary:hover:not(:disabled) {
  background-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.action-btn--secondary {
  background-color: #6b7280;
  color: white;
}

.action-btn--secondary:hover:not(:disabled) {
  background-color: #4b5563;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.4);
}

.action-btn--success {
  background-color: #10b981;
  color: white;
}

.action-btn--success:hover:not(:disabled) {
  background-color: #059669;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.action-btn--warning {
  background-color: #f59e0b;
  color: white;
}

.action-btn--warning:hover:not(:disabled) {
  background-color: #d97706;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}

.action-btn--danger {
  background-color: #ef4444;
  color: white;
}

.action-btn--danger:hover:not(:disabled) {
  background-color: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.action-btn--info {
  background-color: var(--primary-500);
  color: white;
}

.action-btn--info:hover:not(:disabled) {
  background-color: var(--primary-600);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--primary-500-alpha-50);
}

.action-btn__icon {
  flex-shrink: 0;
}

.action-btn__label {
  font-size: inherit;
  font-weight: inherit;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .action-btn {
    min-width: 2.5rem;
    min-height: 2.5rem;
  }
  
  .action-btn--sm {
    padding: 0.5rem;
  }
  
  .action-btn--md {
    padding: 0.625rem;
  }
}

/* Hover effects */
.action-btn:active:not(:disabled) {
  transform: translateY(0);
}

/* Loading state */
.action-btn--loading {
  pointer-events: none;
}

.action-btn--loading .action-btn__icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>