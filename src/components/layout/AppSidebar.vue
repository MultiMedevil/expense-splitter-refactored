<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h1 class="sidebar-title">Expense Splitter</h1>
    </div>
    
    <nav class="sidebar-nav">
      <button 
        v-for="view in views" 
        :key="view.name"
        :class="['nav-button', { active: currentView === view.value }]"
        @click="setCurrentView(view.value)"
      >
        <span class="nav-icon">{{ view.icon }}</span>
        {{ view.label }}
      </button>
    </nav>
  </aside>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'AppSidebar',
  setup() {
    const currentView = ref('users')
    
    const views = [
      { name: 'users', label: 'Benutzer', value: 'users', icon: '👥' },
      { name: 'expenses', label: 'Ausgaben', value: 'expenses', icon: '🛒' },
      { name: 'trips', label: 'Reisen', value: 'trips', icon: '✈️' },
      { name: 'settings', label: 'Einstellungen', value: 'settings', icon: '⚙️' }
    ]

    const setCurrentView = (view) => {
      currentView.value = view
    }

    return {
      currentView,
      views,
      setCurrentView
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar-header {
  margin-bottom: 2rem;
  text-align: center;
}

.sidebar-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  color: white;
  text-align: left;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.nav-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-button.active {
  background-color: var(--primary-color);
}

.nav-icon {
  font-size: 1.2rem;
}
</style>
