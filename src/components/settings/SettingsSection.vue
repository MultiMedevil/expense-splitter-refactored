<template>
  <div class="settings-section">
    <div class="section-header">
      <h1>Einstellungen</h1>
    </div>

    <div class="settings-content">
      <div class="setting-group">
        <h3>Datenverwaltung</h3>
        <div class="setting-actions">
          <BaseButton @click="exportData" variant="secondary">
            📊 Daten exportieren
          </BaseButton>
          <BaseButton @click="importData" variant="secondary">
            📁 Daten importieren
          </BaseButton>
          <BaseButton @click="clearData" variant="danger">
            🗑️ Alle Daten löschen
          </BaseButton>
        </div>
      </div>

      <div class="setting-group">
        <h3>Erscheinungsbild</h3>
        <div class="setting-item">
          <label>
            <input type="checkbox" v-model="darkMode" />
            Dunkelmodus aktivieren
          </label>
        </div>
      </div>

      <div class="setting-group">
        <h3>Über die App</h3>
        <p>Expense Splitter v2.0 - Refactored mit Vue 3 & Vite</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { storageService } from '@/services/storage.service'

export default {
  name: 'SettingsSection',
  components: {
    BaseButton
  },
  setup() {
    const darkMode = ref(false)

    const exportData = () => {
      const data = storageService.exportData()
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `expense-splitter-backup-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
    }

    const importData = () => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json'
      input.onchange = (e) => {
        const file = e.target.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (e) => {
            const result = storageService.importData(e.target.result)
            if (result.success) {
              alert('Daten erfolgreich importiert!')
              location.reload()
            } else {
              alert('Fehler beim Import: ' + result.error)
            }
          }
          reader.readAsText(file)
        }
      }
      input.click()
    }

    const clearData = () => {
      if (confirm('Möchten Sie wirklich alle Daten löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
        storageService.clear('users')
        storageService.clear('expenses')
        location.reload()
      }
    }

    return {
      darkMode,
      exportData,
      importData,
      clearData
    }
  }
}
</script>

<style scoped>
.settings-section {
  max-width: 800px;
  margin: 0 auto;
}

.section-header {
  margin-bottom: 2rem;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.setting-group {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
}

.setting-group h3 {
  margin: 0 0 1rem 0;
  color: #333;
}

.setting-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.setting-item {
  padding: 0.5rem 0;
}

.setting-item label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}
</style>
