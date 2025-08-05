<template>
  <BaseModal :show="show" @close="$emit('close')">
    <template #header>
      <h2>{{ isEdit ? 'Benutzer bearbeiten' : 'Neuer Benutzer' }}</h2>
    </template>
    
    <template #body>
      <form @submit.prevent="saveUser">
        <div class="form-group">
          <label for="userName">Name</label>
          <input
            id="userName"
            v-model="formData.name"
            type="text"
            required
            placeholder="Name eingeben"
          />
        </div>

        <div class="form-group">
          <label>Tags</label>
          <div class="tags-container">
            <label
              v-for="tag in availableTags"
              :key="tag"
              class="tag-option"
            >
              <input
                type="checkbox"
                :value="tag"
                v-model="formData.tags"
              />
              {{ tag }}
            </label>
          </div>
        </div>

        <div class="form-actions">
          <BaseButton type="button" variant="secondary" @click="$emit('close')">
            Abbrechen
          </BaseButton>
          <BaseButton type="submit" variant="primary">
            {{ isEdit ? 'Speichern' : 'Anlegen' }}
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
    show: Boolean,
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
    },
    saveUser() {
      this.$emit('save', this.formData)
    }
  }
}
</script>

<style scoped>
.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input[type="text"] {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: normal;
}

.tag-option:hover {
  background: var(--surface-color);
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}
</style>
