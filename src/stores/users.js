import { defineStore } from 'pinia'
import { storageService } from '@/services/storage.service'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
    loading: false,
    error: null
  }),

  getters: {
    userCount: (state) => state.users.length,
    userNames: (state) => state.users.map(user => user.name),
    getUserById: (state) => (id) => state.users.find(user => user.id === id),
    getUserByName: (state) => (name) => state.users.find(user => user.name === name)
  },

  actions: {
    async loadUsers() {
      this.loading = true
      try {
        const users = storageService.load('users') || []
        this.users = users
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async saveUsers() {
      try {
        storageService.save('users', this.users)
        return { success: true }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      }
    },

    addUser(userData) {
      const newUser = {
        id: Date.now().toString(),
        name: userData.name.trim(),
        tags: userData.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Check for duplicate names
      if (this.users.some(user => user.name.toLowerCase() === newUser.name.toLowerCase())) {
        this.error = 'Ein Benutzer mit diesem Namen existiert bereits'
        return false
      }

      this.users.push(newUser)
      this.saveUsers()
      return true
    },

    updateUser(id, userData) {
      const userIndex = this.users.findIndex(user => user.id === id)
      if (userIndex === -1) return false

      const updatedUser = {
        ...this.users[userIndex],
        ...userData,
        updatedAt: new Date().toISOString()
      }

      // Check for duplicate names (excluding current user)
      const otherUsers = this.users.filter(user => user.id !== id)
      if (otherUsers.some(user => user.name.toLowerCase() === userData.name.toLowerCase())) {
        this.error = 'Ein Benutzer mit diesem Namen existiert bereits'
        return false
      }

      this.users[userIndex] = updatedUser
      this.saveUsers()
      return true
    },

    deleteUser(id) {
      const userIndex = this.users.findIndex(user => user.id === id)
      if (userIndex === -1) return false

      this.users.splice(userIndex, 1)
      this.saveUsers()
      return true
    },

    clearError() {
      this.error = null
    }
  }
})
