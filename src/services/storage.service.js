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
