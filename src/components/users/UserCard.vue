<template>
  <div class="user-card" @click="handleUserClick" :class="{ 'user-card--clickable': !readonly }">
    <div class="user-card-header">
      <div class="user-avatar" :style="{ backgroundColor: getAvatarColor(user.name) }">
        {{ user.name.charAt(0).toUpperCase() }}
      </div>
      <div class="user-info">
        <h3 class="user-name">{{ user.name }}</h3>
        <div class="user-email" v-if="user.email">{{ user.email }}</div>
      </div>
    </div>
    
    <div class="user-stats">
      <div class="stat-item">
        <span class="stat-value">{{ formatCurrency(totalExpenses) }}</span>
        <span class="stat-label">Gesamt</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ userExpensesCount }}</span>
        <span class="stat-label">Ausgaben</span>
      </div>
      <div class="stat-item" v-if="userBalance !== 0">
        <span class="stat-value" :class="{ 'positive': userBalance > 0, 'negative': userBalance < 0 }">
          {{ formatCurrency(userBalance) }}
        </span>
        <span class="stat-label">Saldo</span>
      </div>
    </div>
    
    <div class="user-tags" v-if="user.tags?.length">
      <span v-for="tag in user.tags" :key="tag" class="tag" :class="getTagClass(tag)">
        {{ tag }}
      </span>
    </div>
    
    <div class="user-actions" v-if="!readonly">
      <button @click.stop="handleDelete" class="btn-delete" title="Löschen">🗑️</button>
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
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click', 'delete'],
  setup(props, { emit }) {
    const calculatorStore = useCalculatorStore()
    
    const totalExpenses = computed(() => {
      return calculatorStore.getUserTotalAmount(props.user.name) || 0
    })

    const userExpensesCount = computed(() => {
      return calculatorStore.getUserExpensesCount(props.user.name) || 0
    })

    const userBalance = computed(() => {
      return calculatorStore.getUserBalance(props.user.name) || 0
    })

    const getAvatarColor = (name) => {
      const colors = ['#3498db', '#f1c40f', '#2ecc71', '#e74c3c', '#9b59b6']
      return colors[name.charCodeAt(0) % colors.length]
    }

    const getTagClass = (tag) => {
      return `tag-${tag}`
    }

    const formatCurrency = (value) => {
      return `${value}€`
    }

    const handleUserClick = () => {
      if (!props.readonly) {
        emit('click', props.user)
      }
    }

    const handleDelete = () => {
      emit('delete', props.user)
    }

    // Expose to template
    return {
      totalExpenses,
      userExpensesCount,
      userBalance,
      getAvatarColor,
      getTagClass,
      formatCurrency,
      handleUserClick,
      handleDelete
    }
  }
}
</script>

<style scoped>
.user-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 1.5em;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border: 1px solid #e0e0e0;
}

.user-card--clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.user-card-header {
  display: flex;
  align-items: center;
  gap: 1em;
  margin-bottom: 1em;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #fff;
  font-size: 1.25em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-info h3 {
  margin: 0;
  font-size: 1.125em;
  color: #34495e;
  font-weight: 600;
}

.user-email {
  color: #666;
  font-size: 0.875em;
  margin-top: 0.25em;
}

.user-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  margin-bottom: 1em;
}

.user-stat-label {
  font-size: 0.75em;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.user-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1em;
}

.user-stat {
  text-align: center;
}

.user-stat-value {
  font-weight: 600;
  color: #34495e;
  font-size: 1.1em;
}


.user-actions {
  display: flex;
  gap: 0.5em;
  margin-top: 1em;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.5em 1em;
  border-radius: 8px;
  font-size: 0.875em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: 1px solid transparent;
  color: #34495e;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.action-btn.tag-green {
  background-color: #f0fdf4;
  color: #166534;
  border-color: #bbf7d0;
}

.tag-orange {
  background-color: #fff7ed;
  color: #9a3412;
  border-color: #fed7aa;
}

.tag-red {
  background-color: #fef2f2;
  color: #dc2626;
  border-color: #fca5a5;
}

.action-btn--edit {
  background-color: #eef2ff;
  border-color: #e0e7ff;
  color: #34495e;
}

.action-btn--edit:hover {
  background-color: #e0e7ff;
}

.action-btn--delete {
  background-color: #fff1f2;
  border-color: #ffe4e6;
  color: #34495e;
}

.action-btn--delete:hover {
  background-color: #ffe4e6;
}

.action-btn__icon {
  font-size: 0.875em;
}
</style>
