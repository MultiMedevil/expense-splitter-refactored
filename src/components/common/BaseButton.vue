<template>
  <button 
    :class="buttonClasses"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info'].includes(value)
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    },
    fullWidth: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    buttonClasses() {
      return [
        'base-button',
        `base-button--${this.variant}`,
        `base-button--${this.size}`,
        {
          'base-button--full-width': this.fullWidth,
          'base-button--disabled': this.disabled
        }
      ]
    }
  }
}
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: var(--border-radius);
  font-family: inherit;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: var(--transition);
  outline: none;
}

.base-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.base-button--small {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.base-button--medium {
  padding: 0.5rem 1rem;
  font-size: 1rem;
}

.base-button--large {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
}

.base-button--full-width {
  width: 100%;
}

.base-button--primary {
  background-color: var(--primary-color);
  color: white;
}

.base-button--primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.base-button--secondary {
  background-color: var(--secondary-color);
  color: white;
}

.base-button--secondary:hover:not(:disabled) {
  background-color: #545b62;
}

.base-button--success {
  background-color: var(--success-color);
  color: white;
}

.base-button--success:hover:not(:disabled) {
  background-color: #1e7e34;
}

.base-button--danger {
  background-color: var(--danger-color);
  color: white;
}

.base-button--danger:hover:not(:disabled) {
  background-color: #c82333;
}
</style>
