<template>
  <div class="user-card" @click="$emit('click')">
    <div class="user-avatar">
      {{ user.name.charAt(0).toUpperCase() }}
    </div>
    
    <div class="user-info">
      <h3 class="user-name">{{ user.name }}</h3>
      <div class="user-tags">
        <span 
          v-for="tag in user.tags" 
          :key="tag" 
          class="user-tag"
          :style="getTagStyle(tag)"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <div class="user-stats">
      <span class="stat-amount">{{ totalExpenses }}€</span>
      <span class="stat-label">Gesamt</span>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useCalculatorStore } from '@/stores/calculator'

export default {
  name: 'UserCard',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  emits: ['click'],
  setup(props) {
    const calculatorStore = useCalculatorStore()
    
    const totalExpenses = computed(() => {
      return calculatorStore.getUserTotalAmount(props.user.name) || 0
    })

    const getTagStyle = (tag) => {
      const colors = {
        'Vegan': { background: '#d4edda', color: '#155724' },
        'Vegetarisch': { background: '#d1ecf1', color: '#0c5460' },
        'Fleisch': { background: '#f8d7da', color: '#721c24' },
        'Alkohol': { background: '#fff3cd', color: '#856404' },
        'Glutenfrei': { background: '#d1ecf1', color: '#0c5460' },
        'Laktosefrei': { background: '#fff3cd', color: '#856404' },
        'Fructose-Frei': { background: '#d4edda', color: '#155724' },
        'default': { background: '#e2e3e5', color: '#383d41' }
      }
      
      return colors[tag] || colors.default
    }

    return {
      totalExpenses,
      getTagStyle
    }
  }
}
</script>

<style scoped>
.user-card {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-card:hover {
  box-shadow: var(--shadow);
  transform: translateY(-2px);
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
}

.user-info {
  flex: 1;
}

.user-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.user-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.user-tag {
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
}

.user-stats {
  text-align: right;
}

.stat-amount {
  display: block;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-color);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-muted);
}
</style>
