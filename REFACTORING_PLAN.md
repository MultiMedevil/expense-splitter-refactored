# Expense Splitter Refaktorisierungsplan

## Übersicht

Dieser Plan beschreibt die vollständige Refaktorisierung des Expense Splitter Projekts von einer monolithischen Struktur zu einer modernen, modularen Vue.js-Anwendung.

## 🎯 Ziele der Refaktorisierung

1. **Modularität**: Klare Trennung von Concerns
2. **Wartbarkeit**: Strukturierter und nachvollziehbarer Code
3. **Erweiterbarkeit**: Einfache Hinzufügung neuer Features
4. **Testbarkeit**: Umfassende Testabdeckung
5. **Performance**: Optimierte Ladezeiten und Rendering
6. **Benutzerfreundlichkeit**: Verbesserte UX/UI

## 📋 Phasenübersicht

```
Phase 1: Vorbereitung & Setup (1-2 Tage)
Phase 2: Basis-Struktur (2-3 Tage)
Phase 3: Komponenten-Extraktion (3-4 Tage)
Phase 4: Services & Store (2-3 Tage)
Phase 5: Testing & QA (2-3 Tage)
Phase 6: Optimierung & Deployment (1-2 Tage)
```

## Phase 1: Vorbereitung & Setup

### 1.1 Repository Setup
```bash
# Neues Git-Repository erstellen
git init
git add .
git commit -m "Initial commit - original structure"

# Branch für Refaktorisierung erstellen
git checkout -b refactoring/modular-architecture
```

### 1.2 Build-Tool Setup
```bash
# Vite installieren
npm init -y
npm install -D vite @vitejs/plugin-vue
npm install vue@next

# Package.json anpassen
```

**package.json:**
```json
{
  "name": "expense-splitter-refactored",
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "pinia": "^2.1.7",
    "vue-router": "^4.2.5"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-vue": "^4.5.0",
    "vitest": "^1.0.0",
    "@vue/test-utils": "^2.4.0",
    "jsdom": "^23.0.0",
    "eslint": "^8.0.0",
    "@vue/eslint-config-prettier": "^8.0.0"
  }
}
```

### 1.3 Vite Configuration
**vite.config.js:**
```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@stores': resolve(__dirname, 'src/stores'),
      '@services': resolve(__dirname, 'src/services'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@assets': resolve(__dirname, 'src/assets')
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'pinia', 'vue-router']
        }
      }
    }
  }
})
```

## Phase 2: Basis-Struktur

### 2.1 Verzeichnisstruktur erstellen
```
src/
├── components/
│   ├── common/
│   │   ├── BaseButton.vue
│   │   ├── BaseModal.vue
│   │   ├── BaseInput.vue
│   │   └── BaseCard.vue
│   ├── users/
│   │   ├── UserList.vue
│   │   ├── UserCard.vue
│   │   ├── UserModal.vue
│   │   └── UserForm.vue
│   ├── expenses/
│   │   ├── ExpenseList.vue
│   │   ├── ExpenseCard.vue
│   │   ├── ExpenseModal.vue
│   │   ├── EventModal.vue
│   │   └── AccommodationModal.vue
│   └── layout/
│       ├── AppSidebar.vue
│       ├── AppHeader.vue
│       └── AppMain.vue
├── stores/
│   ├── index.js
│   ├── users.js
│   ├── expenses.js
│   └── calculator.js
├── services/
│   ├── storage.service.js
│   ├── calculator.service.js
│   ├── validation.service.js
│   └── export.service.js
├── utils/
│   ├── constants.js
│   ├── formatters.js
│   ├── validators.js
│   └── helpers.js
├── composables/
│   ├── useUsers.js
│   ├── useExpenses.js
│   ├── useCalculator.js
│   └── useStorage.js
├── styles/
│   ├── base.css
│   ├── components.css
│   ├── variables.css
│   └── themes.css
└── main.js
```

### 2.2 Basis-Dateien erstellen

**src/main.js:**
```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './styles/base.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')
```

**src/App.vue:**
```vue
<template>
  <div id="app" class="app">
    <AppSidebar />
    <AppMain />
  </div>
</template>

<script>
import AppSidebar from './components/layout/AppSidebar.vue'
import AppMain from './components/layout/AppMain.vue'

export default {
  name: 'App',
  components: {
    AppSidebar,
    AppMain
  }
}
</script>

<style scoped>
.app {
  display: flex;
  min-height: 100vh;
}
</style>
```

## Phase 3: Komponenten-Extraktion

### 3.1 User Komponenten

**src/components/users/UserCard.vue:**
```vue
<template>
  <div class="user-card" @click="$emit('click')">
    <div class="user-avatar">
      {{ user.name.charAt(0).toUpperCase() }}
    </div>
    <div class="user-info">
      <h3 class="user-name">{{ user.name }}</h3>
      <div class="user-tags">
        <span v-for="tag in user.tags" :key="tag" class="user-tag">
          {{ tag }}
        </span>
      </div>
    </div>
    <div class="user-stats">
      <span class="stat">{{ totalExpenses }}€</span>
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
      return calculatorStore.getUserTotalAmount(props.user.name)
    })

    return {
      totalExpenses
    }
  }
}
</script>
```

**src/components/users/UserModal.vue:**
```vue
<template>
  <BaseModal :show="show" @close="$emit('close')">
    <template #header>
      <h2>{{ isEdit ? 'Benutzer bearbeiten' : 'Neuer Benutzer' }}</h2>
    </template>
    
    <template #body>
      <UserForm 
        :user="user" 
        :is-edit="isEdit"
        @save="saveUser"
      />
    </template>
  </BaseModal>
</template>

<script>
import BaseModal from '@/components/common/BaseModal.vue'
import UserForm from './UserForm.vue'

export default {
  name: 'UserModal',
  components: {
    BaseModal,
    UserForm
  },
  props: {
    show: Boolean,
    user: Object,
    isEdit: Boolean
  },
  emits: ['close', 'save']
}
</script>
```

### 3.2 Expense Komponenten

**src/components/expenses/ExpenseList.vue:**
```vue
<template>
  <div class="expense-list">
    <div class="expense-header">
      <h2>Ausgaben</h2>
      <BaseButton @click="openExpenseModal" variant="primary">
        Neue Ausgabe
      </BaseButton>
    </div>
    
    <div class="expense-grid">
      <ExpenseCard
        v-for="expense in expenses"
        :key="expense.id"
        :expense="expense"
        @edit="editExpense"
        @delete="deleteExpense"
      />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useExpensesStore } from '@/stores/expenses'
import ExpenseCard from './ExpenseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'

export default {
  name: 'ExpenseList',
  components: {
    ExpenseCard,
    BaseButton
  },
  setup() {
    const expensesStore = useExpensesStore()
    
    const expenses = computed(() => expensesStore.expenses)
    
    const openExpenseModal = () => {
      // Implementierung
    }
    
    const editExpense = (expense) => {
      // Implementierung
    }
    
    const deleteExpense = (expense) => {
      // Implementierung
    }

    return {
      expenses,
      openExpenseModal,
      editExpense,
      deleteExpense
    }
  }
}
</script>
```

## Phase 4: Services & Store

### 4.1 Storage Service
**src/services/storage.service.js:**
```javascript
class StorageService {
  constructor() {
    this.storageKey = 'expenseSplitter'
  }

  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data))
      return { success: true }
    } catch (error) {
      console.error('Save error:', error)
      return { success: false, error: error.message }
    }
  }

  load(key) {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Load error:', error)
      return null
    }
  }

  clear(key) {
    localStorage.removeItem(key)
  }

  exportData() {
    const data = {
      users: this.load('users'),
      expenses: this.load('expenses'),
      timestamp: new Date().toISOString()
    }
    return JSON.stringify(data, null, 2)
  }

  importData(jsonData) {
    try {
      const data = JSON.parse(jsonData)
      if (data.users) this.save('users', data.users)
      if (data.expenses) this.save('expenses', data.expenses)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

export const storageService = new StorageService()
```

### 4.2 Calculator Service
**src/services/calculator.service.js:**
```javascript
export class CalculatorService {
  calculateUserCosts(users, expenses) {
    const userCosts = {}
    
    // Initialisierung
    users.forEach(user => {
      userCosts[user.name] = 0
    })

    // Kostenberechnung
    expenses.forEach(expense => {
      switch (expense.type) {
        case 'expense':
          this.calculateExpenseCosts(expense, users, userCosts)
          break
        case 'event':
          this.calculateEventCosts(expense, users, userCosts)
          break
        case 'accommodation':
          this.calculateAccommodationCosts(expense, users, userCosts)
          break
      }
    })

    return userCosts
  }

  calculateExpenseCosts(expense, users, userCosts) {
    if (!expense.items?.length) return

    expense.items.forEach(item => {
      const price = parseFloat(item.price) || 0
      const participants = this.getParticipantsForTag(users, item.tag)
      
      if (participants.length > 0) {
        const costPerPerson = price / participants.length
        participants.forEach(user => {
          userCosts[user.name] += costPerPerson
        })
      }
    })
  }

  calculateEventCosts(expense, users, userCosts) {
    const totalCost = parseFloat(expense.price) || 0
    const participants = expense.participants || []
    
    if (participants.length > 0) {
      const costPerPerson = totalCost / participants.length
      participants.forEach(participant => {
        if (userCosts[participant] !== undefined) {
          userCosts[participant] += costPerPerson
        }
      })
    }

    // Extras berechnen
    if (expense.extras?.length) {
      expense.extras.forEach(extra => {
        const extraParticipants = extra.participants || []
        if (extraParticipants.length > 0) {
          const extraCostPerPerson = parseFloat(extra.price) / extraParticipants.length
          extraParticipants.forEach(participant => {
            if (userCosts[participant] !== undefined) {
              userCosts[participant] += extraCostPerPerson
            }
          })
        }
      })
    }
  }

  calculateAccommodationCosts(expense, users, userCosts) {
    const pricePerNight = parseFloat(expense.pricePerNight) || 0
    const nights = expense.nights || 1
    
    Object.keys(expense.nights || {}).forEach(userName => {
      const userNights = expense.nights[userName] || 0
      const cost = pricePerNight * userNights
      
      if (userCosts[userName] !== undefined) {
        userCosts[userName] += cost
      }
    })

    // Extras für Unterkunft
    if (expense.extras?.length) {
      expense.extras.forEach(extra => {
        const participants = extra.participants || []
        if (participants.length > 0) {
          const extraCostPerPerson = parseFloat(extra.price) / participants.length
          participants.forEach(participant => {
            if (userCosts[participant] !== undefined) {
              userCosts[participant] += extraCostPerPerson
            }
          })
        }
      })
    }
  }

  getParticipantsForTag(users, tag) {
    if (!tag) return users
    
    return users.filter(user => {
      if (!user.tags?.length) return true
      return user.tags.includes(tag)
    })
  }

  calculateSettlements(userCosts, userPayments = {}) {
    const settlements = []
    const balances = {}
    
    // Berechne Salden
    Object.keys(userCosts).forEach(userName => {
      const cost = userCosts[userName] || 0
      const paid = userPayments[userName] || 0
      balances[userName] = paid - cost
    })

    // Erstelle Transaktionen
    const creditors = []
    const debtors = []

    Object.keys(balances).forEach(userName => {
      const balance = balances[userName]
      if (balance > 0) {
        creditors.push({ userName, amount: balance })
      } else if (balance < 0) {
        debtors.push({ userName, amount: Math.abs(balance) })
      }
    })

    // Sortiere nach Betrag
    creditors.sort((a, b) => b.amount - a.amount)
    debtors.sort((a, b) => b.amount - a.amount)

    // Berechne Transaktionen
    let creditorIndex = 0
    let debtorIndex = 0

    while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
      const creditor = creditors[creditorIndex]
      const debtor = debtors[debtorIndex]
      
      const amount = Math.min(creditor.amount, debtor.amount)
      
      if (amount > 0.01) {
        settlements.push({
          from: debtor.userName,
          to: creditor.userName,
          amount: Math.round(amount * 100) / 100
        })
      }

      creditor.amount -= amount
      debtor.amount -= amount

      if (creditor.amount < 0.01) creditorIndex++
      if (debtor.amount < 0.01) debtorIndex++
    }

    return settlements
  }
}
```

### 4.3 Pinia Stores

**src/stores/users.js:**
```javascript
import { defineStore } from 'pinia'
import { storageService } from '@/services/storage.service'
import { validationService } from '@/services/validation.service'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
    loading: false,
    error: null,
    selectedUser: null
  }),

  getters: {
    userCount: (state) => state.users.length,
    
    getUserByName: (state) => (name) => {
      return state.users.find(user => user.name === name)
    },

    userNames: (state) => state.users.map(user => user.name)
  },

  actions: {
    async loadUsers() {
      this.loading = true
      try {
        const saved = storageService.load('users')
        this.users = saved || []
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async saveUsers() {
      try {
        storageService.save('users', this.users)
      } catch (error) {
        this.error = error.message
      }
    },

    addUser(userData) {
      const validation = validationService.validateUser(userData)
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '))
      }

      const existingUser = this.users.find(u => u.name === userData.name)
      if (existingUser) {
        throw new Error('Benutzer existiert bereits')
      }

      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        tags: userData.tags || [],
        createdAt: new Date().toISOString()
      }

      this.users.push(newUser)
      this.saveUsers()
      
      return newUser
    },

    updateUser(userId, updates) {
      const userIndex = this.users.findIndex(u => u.id === userId)
      if (userIndex === -1) {
        throw new Error('Benutzer nicht gefunden')
      }

      const validation = validationService.validateUser(updates)
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '))
      }

      this.users[userIndex] = { ...this.users[userIndex], ...updates }
      this.saveUsers()
      
      return this.users[userIndex]
    },

    deleteUser(userId) {
      const userIndex = this.users.findIndex(u => u.id === userId)
      if (userIndex === -1) {
        throw new Error('Benutzer nicht gefunden')
      }

      this.users.splice(userIndex, 1)
      this.saveUsers()
    },

    selectUser(user) {
      this.selectedUser = user
    },

    clearSelection() {
      this.selectedUser = null
    }
  }
})
```

**src/stores/expenses.js:**
```javascript
import { defineStore } from 'pinia'
import { storageService } from '@/services/storage.service'

export const useExpensesStore = defineStore('expenses', {
  state: () => ({
    expenses: [],
    loading: false,
    error: null,
    selectedExpense: null
  }),

  getters: {
    expenseCount: (state) => state.expenses.length,
    
    validExpenses: (state) => {
      return state.expenses.filter(e => e && e.id && e.name)
    },

    totalExpenses: (state) => {
      return state.expenses.reduce((sum, expense) => {
        return sum + this.getExpenseTotal(expense)
      }, 0)
    },

    getExpenseById: (state) => (id) => {
      return state.expenses.find(expense => expense.id === id)
    }
  },

  actions: {
    async loadExpenses() {
      this.loading = true
      try {
        const saved = storageService.load('expenses')
        this.expenses = saved || []
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async saveExpenses() {
      try {
        storageService.save('expenses', this.expenses)
      } catch (error) {
        this.error = error.message
      }
    },

    addExpense(expenseData) {
      const newExpense = {
        id: Date.now().toString(),
        ...expenseData,
        createdAt: new Date().toISOString()
      }

      this.expenses.push(newExpense)
      this.saveExpenses()
      
      return newExpense
    },

    updateExpense(expenseId, updates) {
      const expenseIndex = this.expenses.findIndex(e => e.id === expenseId)
      if (expenseIndex === -1) {
        throw new Error('Ausgabe nicht gefunden')
      }

      this.expenses[expenseIndex] = { 
        ...this.expenses[expenseIndex], 
        ...updates,
        updatedAt: new Date().toISOString()
      }
      this.saveExpenses()
      
      return this.expenses[expenseIndex]
    },

    deleteExpense(expenseId) {
      const expenseIndex = this.expenses.findIndex(e => e.id === expenseId)
      if (expenseIndex === -1) {
        throw new Error('Ausgabe nicht gefunden')
      }

      this.expenses.splice(expenseIndex, 1)
      this.saveExpenses()
    },

    getExpenseTotal(expense) {
      switch (expense.type) {
        case 'expense':
          return expense.items?.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0) || 0
        case 'event':
          return (parseFloat(expense.price) || 0) + 
                 (expense.extras?.reduce((sum, extra) => sum + (parseFloat(extra.price) || 0), 0) || 0)
        case 'accommodation':
          return (parseFloat(expense.pricePerNight) || 0) + 
                 (expense.extras?.reduce((sum, extra) => sum + (parseFloat(extra.price) || 0), 0) || 0)
        default:
          return 0
      }
    }
  }
})
```

## Phase 5: Testing & QA

### 5.1 Test-Setup
```bash
# Testing dependencies installieren
npm install -D vitest @vue/test-utils jsdom
npm install -D @testing-library/vue
npm install -D cypress
```

### 5.2 Unit Tests
**tests/unit/services/calculator.service.test.js:**
```javascript
import { describe, it, expect, beforeEach } from 'vitest'
import { CalculatorService } from '@/services/calculator.service'

describe('CalculatorService', () => {
  let service

  beforeEach(() => {
    service = new CalculatorService()
  })

  describe('calculateUserCosts', () => {
    it('should calculate costs for simple expense', () => {
      const users = [{ name: 'Alice' }, { name: 'Bob' }]
      const expenses = [{
        type: 'expense',
        items: [{ price: '100', tag: 'Allgemein' }]
      }]

      const costs = service.calculateUserCosts(users, expenses)

      expect(costs).toEqual({
        Alice: 50,
        Bob: 50
      })
    })

    it('should handle tagged expenses correctly', () => {
      const users = [
        { name: 'Alice', tags: ['Vegan'] },
        { name: 'Bob', tags: [] },
        { name: 'Charlie', tags: ['Vegan'] }
      ]
      const expenses = [{
        type: 'expense',
        items: [{ price: '90', tag: 'Vegan' }]
      }]

      const costs = service.calculateUserCosts(users, expenses)

      expect(costs).toEqual({
        Alice: 45,
        Bob: 0,
        Charlie: 45
      })
    })
  })

  describe('calculateSettlements', () => {
    it('should calculate correct settlements', () => {
      const userCosts = {
        Alice: 100,
        Bob: 50,
        Charlie: 75
      }

      const settlements = service.calculateSettlements(userCosts)

      expect(settlements).toContainEqual({
        from: 'Bob',
        to: 'Alice',
        amount: 25
      })
    })
  })
})
```

### 5.3 Component Tests
**tests/unit/components/UserCard.test.js:**
```javascript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UserCard from '@/components/users/UserCard.vue'

describe('UserCard', () => {
  it('renders user name correctly', () => {
    const user = { name: 'Alice', tags: ['Vegan'] }
    const wrapper = mount(UserCard, {
      props: { user }
    })

    expect(wrapper.text()).toContain('Alice')
    expect(wrapper.text()).toContain('Vegan')
  })

  it('emits click event when clicked', async () => {
    const user = { name: 'Alice' }
    const wrapper = mount(UserCard, {
      props: { user }
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
```

## Phase 6: Optimierung & Deployment

### 6.1 Performance Optimierung
- Lazy Loading für Komponenten
- Code Splitting
- Image Optimization
- Caching Strategien

### 6.2 Deployment
```bash
# Build für Production
npm run build

# Statische Analyse
npm run lint

# Tests ausführen
npm run test
npm run test:e2e
```

### 6.3 Monitoring
- Error Tracking
- Performance Monitoring
- User Analytics

## 🔄 Migration Checkliste

### Vor der Migration
- [ ] Backup erstellen
- [ ] Git-Repository initialisieren
- [ ] Alte Daten exportieren

### Während der Migration
- [ ] Neue Verzeichnisstruktur erstellen
- [ ] Komponenten extrahieren
- [ ] Services implementieren
- [ ] Stores einrichten
- [ ] Tests schreiben

### Nach der Migration
- [ ] Alte Dateien entfernen
- [ ] Performance testen
- [ ] Cross-browser Kompatibilität prüfen
- [ ] Dokumentation aktualisieren

## 📊 Erfolgsmessung

### Metriken
- Code Coverage: >80%
- Bundle Size: <500KB
- Performance Score: >90
- Accessibility Score: >90

### Qualitätsindikatoren
- Cyclomatic Complexity: <10
- Duplizierter Code: <3%
- Testabdeckung: >80%

## 🎯 Nächste Schritte

1. **Phase 1**: Setup und Basis-Struktur
2. **Phase 2**: Komponenten-Extraktion
3. **Phase 3**: Services & Store
4. **Phase 4**: Testing
5. **Phase 5**: Performance-Optimierung
6. **Phase 6**: Deployment

## 🆘 Troubleshooting

### Häufige Probleme
1. **Vue Warnungen**: Check props validation
2. **Reactivity Issues**: Use `ref()` and `reactive()` correctly
3. **Build Errors**: Check import paths and aliases
4. **Test Failures**: Check async/await handling

### Support
- Vue.js Dokumentation: https://vuejs.org
- Pinia Dokumentation: https://pinia.vuejs.org
- Vitest Dokumentation: https://vitest.dev

---

**Dieser Plan ist ein lebendes Dokument und kann während der Implementierung angepasst werden.**
