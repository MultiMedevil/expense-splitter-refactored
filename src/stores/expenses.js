import { defineStore } from 'pinia'
import { storageService } from '@/services/storage.service'

export const useExpensesStore = defineStore('expenses', {
  state: () => ({
    expenses: [],
    loading: false,
    error: null
  }),

  getters: {
    expenseCount: (state) => state.expenses.length,
    validExpenses: (state) => state.expenses.filter(expense => 
      expense && expense.id && expense.name
    ),
    getExpenseById: (state) => (id) => state.expenses.find(expense => expense.id === id),
    expensesByType: (state) => (type) => state.expenses.filter(expense => expense.type === type)
  },

  actions: {
    async loadExpenses() {
      this.loading = true
      try {
        const expenses = storageService.load('expenses') || []
        this.expenses = expenses
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async saveExpenses() {
      try {
        storageService.save('expenses', this.expenses)
        return { success: true }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      }
    },

    addExpense(expenseData) {
      const newExpense = {
        id: Date.now().toString(),
        ...expenseData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      this.expenses.push(newExpense)
      this.saveExpenses()
      return newExpense
    },

    updateExpense(id, expenseData) {
      const expenseIndex = this.expenses.findIndex(expense => expense.id === id)
      if (expenseIndex === -1) return false

      const updatedExpense = {
        ...this.expenses[expenseIndex],
        ...expenseData,
        updatedAt: new Date().toISOString()
      }

      this.expenses[expenseIndex] = updatedExpense
      this.saveExpenses()
      return updatedExpense
    },

    deleteExpense(id) {
      const expenseIndex = this.expenses.findIndex(expense => expense.id === id)
      if (expenseIndex === -1) return false

      this.expenses.splice(expenseIndex, 1)
      this.saveExpenses()
      return true
    },

    clearError() {
      this.error = null
    }
  }
})
