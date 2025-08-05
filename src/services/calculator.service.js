export class CalculatorService {
  calculateUserCosts(users, expenses) {
    const userCosts = {}
    
    // Initialize user costs
    users.forEach(user => {
      userCosts[user.name] = 0
    })

    // Calculate costs for each expense
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

    // Calculate extras
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
    
    Object.keys(expense.nights || {}).forEach(userName => {
      const userNights = expense.nights[userName] || 0
      const cost = pricePerNight * userNights
      
      if (userCosts[userName] !== undefined) {
        userCosts[userName] += cost
      }
    })

    // Calculate extras for accommodation
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
    
    // Calculate balances
    Object.keys(userCosts).forEach(userName => {
      const cost = userCosts[userName] || 0
      const paid = userPayments[userName] || 0
      balances[userName] = paid - cost
    })

    // Create transactions
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

    // Sort by amount
    creditors.sort((a, b) => b.amount - a.amount)
    debtors.sort((a, b) => b.amount - a.amount)

    // Calculate settlements
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

export const calculatorService = new CalculatorService()
