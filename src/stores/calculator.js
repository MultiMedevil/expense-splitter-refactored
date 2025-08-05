import { defineStore } from 'pinia'
import { calculatorService } from '@/services/calculator.service'
import { useUsersStore } from './users'
import { useExpensesStore } from './expenses'

export const useCalculatorStore = defineStore('calculator', {
  state: () => ({
    userCosts: {},
    settlements: [],
    loading: false,
    error: null
  }),

  getters: {
    totalCosts: (state) => Object.values(state.userCosts).reduce((sum, cost) => sum + cost, 0),
    
    userNames: () => {
      const usersStore = useUsersStore()
      return usersStore.userNames
    },

    formattedSettlements: (state) => {
      return state.settlements.map(settlement => ({
        ...settlement,
        formattedAmount: settlement.amount.toFixed(2)
      }))
    }
  },

  actions: {
    calculateAll() {
      const usersStore = useUsersStore()
      const expensesStore = useExpensesStore()

      if (usersStore.users.length === 0 || expensesStore.expenses.length === 0) {
        this.userCosts = {}
        this.settlements = []
        return
      }

      this.loading = true
      try {
        // Calculate user costs
        this.userCosts = calculatorService.calculateUserCosts(
          usersStore.users,
          expensesStore.validExpenses
        )

        // Calculate settlements
        this.settlements = calculatorService.calculateSettlements(this.userCosts)
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    getUserTotalAmount(userName) {
      return this.userCosts[userName] || 0
    },

    getUserDetailedStats(userName) {
      const expensesStore = useExpensesStore()
      const userExpenses = expensesStore.expenses.filter(expense => {
        // This will be implemented based on expense structure
        return false // Placeholder
      })

      return {
        total: this.userCosts[userName] || 0,
        count: userExpenses.length,
        breakdown: {} // Placeholder for detailed breakdown
      }
    },

    clearError() {
      this.error = null
    }
  }
})
