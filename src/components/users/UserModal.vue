<template>
  <BaseModal 
    :show="isOpen" 
    @close="handleClose"
  >
    <template #header>
      <h2 class="modal-title">{{ user ? 'Benutzer bearbeiten' : 'Neuen Benutzer erstellen' }}</h2>
    </template>
    
    <template #body>
      <form @submit.prevent="handleSubmit" class="legacy-form">
        <div class="legacy-form-group">
          <label for="userName" class="legacy-form-label">Name *</label>
          <input
            id="userName"
            v-model="formData.name"
            type="text"
            required
            placeholder="Max Mustermann"
            class="legacy-form-input"
            :class="{ error: errors.name }"
          />
          <span v-if="errors.name" class="legacy-form-error">{{ errors.name }}</span>
        </div>
        
        <div class="legacy-form-group">
          <label class="legacy-form-label">Tags</label>
          <div class="legacy-tags-container">
            <div v-for="tag in availableTags" :key="tag" class="legacy-tag-option">
              <label class="legacy-tag-label">
                <input
                  type="checkbox"
                  :value="tag"
                  v-model="formData.tags"
                  class="legacy-tag-checkbox"
                />
                <span :class="getTagClass(tag)" class="tag">{{ tag }}</span>
              </label>
            </div>
          </div>
        </div>
        
        <div v-if="isEdit" class="legacy-form-info">
          <p>Erstellt: {{ formatDate(user.createdAt) }}</p>
          <p v-if="user.updatedAt">Zuletzt bearbeitet: {{ formatDate(user.updatedAt) }}</p>
        </div>
        
        <div class="legacy-form-actions">
          <BaseButton type="button" @click="handleClose" variant="secondary" class="legacy-btn legacy-btn--secondary">
            Abbrechen
          </BaseButton>
          <BaseButton 
            type="submit" 
            variant="primary"
            class="legacy-btn legacy-btn--primary"
            :disabled="!isFormValid || isSubmitting"
          >
            {{ isSubmitting ? 'Speichern...' : (user ? 'Aktualisieren' : 'Erstellen') }}
          </BaseButton>
        </div>
      </form>
    </template>
  </BaseModal>
</template>

<script>
import BaseModal from '@/components/common/BaseModal.vue'
import BaseButton from '@/components/common/BaseButton.vue'

export default {
  name: 'UserModal',
  components: {
    BaseModal,
    BaseButton
  },
  props: {
    isOpen: Boolean,
    user: Object,
    isEdit: Boolean
  },
  emits: ['close', 'save'],
  data() {
    return {
      formData: {
        name: '',
        tags: []
      },
      errors: {
        name: ''
      },
      isSubmitting: false,
      availableTags: [
        'Vegan',
        'Vegetarisch',
        'Fleisch',
        'Alkohol',
        'Glutenfrei',
        'Laktosefrei',
        'Fructose-Frei'
      ]
    }
  },
  computed: {
    isFormValid() {
      return !this.errors.name
    }
  },
  watch: {
    user: {
      immediate: true,
      handler(newUser) {
        if (newUser) {
          this.formData = {
            name: newUser.name,
            tags: [...newUser.tags]
          }
        } else {
          this.resetForm()
        }
      }
    }
  },
  methods: {
    resetForm() {
      this.formData = {
        name: '',
        tags: []
      }
      this.errors = {
        name: '',
      }
    },
    validateName() {
      if (!this.formData.name.trim()) {
        this.errors.name = 'Name ist erforderlich'
      } else {
        this.errors.name = ''
      }
    },
    getTagColor(tag) {
      switch (tag) {
        case 'Vegan':
          return 'green'
        case 'Vegetarisch':
          return 'orange'
        case 'Fleisch':
          return 'red'
        case 'Alkohol':
          return 'purple'
        case 'Glutenfrei':
          return 'blue'
        case 'Laktosefrei':
          return 'pink'
        case 'Fructose-Frei':
          return 'brown'
        default:
          return 'gray'
      }
    },
    getTagClass(tag) {
      return `tag-${tag}`
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('de-DE')
    },
    handleClose() {
      this.$emit('close')
    },
    handleSubmit() {
      if (this.isFormValid) {
        this.isSubmitting = true
        // Ensure ID is included when editing
        const userData = this.user 
          ? { ...this.formData, id: this.user.id }
          : this.formData
        this.$emit('save', userData)
        setTimeout(() => {
          this.isSubmitting = false
        }, 1000)
      }
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 12px;
  padding: 2em;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid #e0e0e0;
}

.modal-header {
  margin-bottom: 1.5em;
}

.modal-header h2 {
  margin: 0;
  color: #34495e;
  font-weight: 600;
}

.legacy-form {
  max-width: 500px;
}

.legacy-form-group {
  margin-bottom: 1.5em;
}

.legacy-form-label {
  display: block;
  margin-bottom: 0.5em;
  font-weight: 600;
  color: #34495e;
  font-size: 0.9em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.legacy-form-input {
  width: 100%;
  padding: 0.8em;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1em;
  background: #fff;
  transition: all 0.2s ease;
  font-family: 'Roboto', sans-serif;
}

.legacy-form-input:focus {
  outline: none;
  border-color: #0074d9;
  box-shadow: 0 0 0 3px rgba(0, 116, 217, 0.1);
}

.legacy-form-input.error {
  border-color: #e74c3c;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.legacy-form-error {
  color: #e74c3c;
  font-size: 0.8em;
  margin-top: 0.25em;
}

.legacy-tags-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.5em;
  margin-top: 0.5em;
}

.legacy-tag-option {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.legacy-tag-label {
  display: flex;
  align-items: center;
  gap: 0.5em;
  cursor: pointer;
  font-weight: normal;
  font-family: 'Roboto', sans-serif;
}

.tag-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tag-checkbox {
  margin-right: 0.5rem;
}

.tag-display {
  padding: 0.2rem 0.5rem;
  border-radius: var(--border-radius);
  font-size: 0.8rem;
}

.legacy-form-actions {
  display: flex;
  gap: 1em;
  justify-content: flex-end;
  margin-top: 2em;
}

.legacy-form-info {
  margin-bottom: 1.5em;
  padding: 1em;
  background-color: #f8f9fa;
  border-radius: 8px;
  font-size: 0.9em;
  color: #6c757d;
}

.modal-title {
  margin: 0;
  color: #34495e;
  font-weight: 600;
  font-size: 1.4em;
}

.legacy-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.8em 1.6em;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: 1px solid transparent;
  color: #34495e;
}

.legacy-btn--primary {
  background-color: #eef2ff;
  border-color: #e0e7ff;
  color: #34495e;
}

.legacy-btn--primary:hover {
  background-color: #e0e7ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.legacy-btn--secondary {
  background-color: #f8f9fa;
  border-color: #e0e0e0;
  color: #34495e;
}

.legacy-btn--secondary:hover {
  background-color: #f1f3f4;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.legacy-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.tag-option {
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.5em;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  font-weight: normal;
}

.tag-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tag-checkbox {
  margin-right: 0.5rem;
}

.tag-display {
  padding: 0.2rem 0.5rem;
  border-radius: var(--border-radius);
  font-size: 0.8rem;
}

.tag-green {
  background-color: #c6efce;
  color: #3e8e41;
}

.tag-orange {
  background-color: #fbe4d5;
  color: #ffa07a;
}

.tag-red {
  background-color: #ffc6c6;
  color: #ff3737;
}

.tag-purple {
  background-color: #d9c4f7;
  color: #7a288a;
}

.tag-blue {
  background-color: #add8e6;
  color: #4682b4;
}

.tag-pink {
  background-color: #ffd7be;
  color: #ff69b4;
}

.tag-brown {
  background-color: #f5deb3;
  color: #964b00;
}

.tag-gray {
  background-color: #f7f7f7;
  color: #666;
}

.form-info {
  margin-top: 1.5rem;
  font-size: 0.8rem;
  color: var(--text-color);
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}
</style>
