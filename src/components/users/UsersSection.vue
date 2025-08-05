<template>
  <div class="users-section">
    <div class="section-header">
      <h1>Benutzerverwaltung</h1>
      <div class="section-actions">
        <BaseButton @click="openUserModal" variant="primary">
          <span class="btn-icon">➕</span>
          Neuer Benutzer
        </BaseButton>
        <BaseButton @click="exportUsers" variant="secondary">
          <span class="btn-icon">📤</span>
          Exportieren
        </BaseButton>
      </div>
    </div>
    
    <div class="users-stats" v-if="users.length > 0">
      <div class="stat-card">
        <div class="stat-value">{{ users.length }}</div>
        <div class="stat-label">Gesamt Benutzer</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ totalExpensesFormatted }}</div>
        <div class="stat-label">Gesamt Ausgaben</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ averageExpensesFormatted }}</div>
        <div class="stat-label">Ø pro Benutzer</div>
      </div>
    </div>
    
    <div class="users-controls">
      <div class="search-filter">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Benutzer suchen..."
          class="search-input"
        >
        <select v-model="selectedTag" class="filter-select">
          <option value="">Alle Tags</option>
          <option v-for="tag in allTags" :key="tag" :value="tag">{{ tag }}</option>
        </select>
      </div>
    </div>
    
    <div class="users-grid" v-if="filteredUsers.length > 0">
      <UserCard 
        v-for="user in filteredUsers" 
        :key="user.id" 
        :user="user"
        @click="editUser(user)"
        @edit="editUser(user)"
        @delete="deleteUser(user)"
      />
    </div>
    
    <div v-else-if="users.length > 0" class="empty-state">
      <div class="empty-icon">🔍</div>
      <h3>Keine Benutzer gefunden</h3>
      <p>Keine Benutzer entsprechen den aktuellen Filtern.</p>
    </div>
    
    <div v-else class="empty-state">
      <div class="empty-icon">👥</div>
      <h3>Noch keine Benutzer</h3>
      <p>Legen Sie Ihre ersten Benutzer an, um Ausgaben zu verwalten.</p>
      <BaseButton @click="openUserModal" variant="primary">
        Ersten Benutzer anlegen
      </BaseButton>
    </div>
    
    <UserModal 
      :show="showModal" 
      :user="editingUser"
      @close="closeModal"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useExpensesStore } from '@/stores/expenses'
import UserCard from './UserCard.vue'
import UserModal from './UserModal.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const usersStore = useUsersStore()
const expensesStore = useExpensesStore()

const showModal = ref(false)
const editingUser = ref(null)
const searchQuery = ref('')
const selectedTag = ref('')

// Computed properties
const users = computed(() => usersStore.users)
const isLoading = computed(() => usersStore.loading)
const error = computed(() => usersStore.error)

const totalExpenses = computed(() => {
  return expensesStore.expenses.reduce((sum, expense) => sum + expense.amount, 0)
})

// Methods
const openUserModal = () => {
  editingUser.value = null
  showModal.value = true
}

const editUser = (user) => {
  editingUser.value = user
  showModal.value = true
}

const deleteUser = async (user) => {
  if (confirm(`Möchten Sie "${user.name}" wirklich löschen?`)) {
    try {
      await usersStore.deleteUser(user.id)
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }
}

const closeModal = () => {
  showModal.value = false
  editingUser.value = null
}

const handleSave = async (userData) => {
  try {
    if (editingUser.value) {
      const { id, ...rest } = userData
      await usersStore.updateUser(id, rest)
    } else {
      await usersStore.addUser(userData)
    }
    closeModal()
  } catch (error) {
    console.error('Error saving user:', error)
  }
}

const exportUsers = () => {
  const data = {
    users: users.value,
    exportDate: new Date().toISOString(),
    totalUsers: users.value.length
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `users-export-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const totalExpensesFormatted = computed(() => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(totalExpenses.value)
})

const averageExpensesFormatted = computed(() => {
  const avg = users.value.length > 0 ? totalExpenses.value / users.value.length : 0
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(avg)
})

const allTags = computed(() => {
  const tags = new Set()
  users.value.forEach(user => {
    user.tags?.forEach(tag => tags.add(tag))
  })
  return Array.from(tags).sort()
})

const filteredUsers = computed(() => {
  let filtered = users.value
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    )
  }

  return filtered
})

// Lifecycle
onMounted(async () => {
  await Promise.all([
    usersStore.loadUsers(),
    expensesStore.loadExpenses()
  ])
})

// Lifecycle
onMounted(async () => {
  await Promise.all([
    usersStore.loadUsers(),
    expensesStore.loadExpenses()
  ])
})

// Watchers
watch(error, (newError) => {
  if (newError) {
    console.error('Users section error:', newError)
  }
})
</script>

<style scoped>
.users-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2em;
  font-family: 'Roboto', sans-serif;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2em;
  flex-wrap: wrap;
  gap: 1em;
}

.section-header h1 {
  font-size: 1.8em;
  font-weight: 700;
  color: #34495e;
  margin: 0;
}

.section-actions {
  display: flex;
  gap: 0.8em;
  align-items: center;
}

.btn-icon {
  margin-right: 0.5em;
}

.users-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1em;
  margin-bottom: 2em;
}

.stat-card {
  background: #fff;
  padding: 1.5em;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  text-align: center;
  border: 1px solid #e0e0e0;
}

.stat-value {
  font-size: 2em;
  font-weight: 700;
  color: #388e3c;
  display: block;
}

.stat-label {
  font-size: 0.875em;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.5em;
}

.users-controls {
  margin-bottom: 2em;
}

.search-filter {
  display: flex;
  gap: 1em;
  align-items: center;
  flex-wrap: wrap;
}

.search-input,
.filter-select {
  padding: 0.8em;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1em;
  background: #fff;
}

.search-input {
  flex: 1;
  min-width: 200px;
}

.filter-select {
  min-width: 150px;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5em;
}

.empty-state {
  text-align: center;
  padding: 3em;
  color: #666;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.empty-icon {
  font-size: 3em;
  margin-bottom: 1em;
}

.empty-state h3 {
  font-size: 1.25em;
  margin-bottom: 0.5em;
  color: #34495e;
}

.empty-state p {
  margin-bottom: 1em;
  color: #666;
}

/* Legacy Design Integration */
:deep(.action-btn) {
  display: inline-flex;
  align-items: center;
  gap: 0.8em;
  padding: 0.8em 1.6em;
  border-radius: 12px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: 1px solid transparent;
  color: #34495e;
}

:deep(.action-btn--primary) {
  background-color: #eef2ff;
  border-color: #e0e7ff;
  color: #34495e;
}

:deep(.action-btn--primary:hover) {
  background-color: #e0e7ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

:deep(.action-btn--secondary) {
  background-color: #fff1f2;
  border-color: #ffe4e6;
  color: #34495e;
}

:deep(.action-btn--secondary:hover) {
  background-color: #ffe4e6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

@media (max-width: 768px) {
  .users-section {
    padding: 1em;
  }
  
  .section-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .section-actions {
    justify-content: center;
  }
  
  .search-filter {
    flex-direction: column;
  }
  
  .search-input,
  .filter-select {
    width: 100%;
  }
}
</style>
