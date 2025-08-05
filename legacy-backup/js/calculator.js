/**
 * Calculator Module für Expense Splitter
 * Berechnet die Kostenverteilung für alle Ausgabentypen
 */

window.ExpenseCalculator = {
  /**
   * Berechnet die Gesamtkosten für jeden Benutzer basierend auf allen Ausgaben
   * @param {Array} users - Array von Benutzerobjekten
   * @param {Array} expenses - Array von Ausgabenobjekten
   * @returns {Object} Objekt mit Benutzernamen als Keys und Gesamtkosten als Values
   */
  calculateUserCosts(users, expenses) {
    // Initialisiere Kosten für jeden Benutzer mit 0
    const userCosts = {};
    users.forEach(user => {
      userCosts[user.name] = 0;
    });

    // Berechne Kosten für jede Ausgabe
    expenses.forEach(expense => {
      if (expense.type === 'expense') {
        // Sammelausgaben
        this.calculateExpenseItemCosts(expense, users, userCosts);
      } else if (expense.type === 'event') {
        // Event-Kosten
        this.calculateEventCosts(expense, users, userCosts);
      } else if (expense.type === 'accommodation') {
        // Unterkunftskosten
        this.calculateAccommodationCosts(expense, users, userCosts);
      }
    });

    return userCosts;
  },

  /**
   * Berechnet die Kostenverteilung für Sammelausgaben
   * @param {Object} expense - Sammelausgaben-Objekt
   * @param {Array} users - Array von Benutzerobjekten
   * @param {Object} userCosts - Objekt zum Akkumulieren der Kosten
   */
  calculateExpenseItemCosts(expense, users, userCosts) {
    if (!expense.items || !Array.isArray(expense.items)) return;

    expense.items.forEach(item => {
      if (!item.price || !item.tag) return;

      const price = parseFloat(item.price) || 0;
      
      if (item.tag === 'Allgemein') {
        // Allgemein-Tag: Gleichmäßig auf ALLE Benutzer verteilen
        const costPerUser = price / users.length;
        users.forEach(user => {
          userCosts[user.name] += costPerUser;
        });
      } else {
        // Andere Tags: Nur auf Benutzer mit entsprechendem Tag verteilen
        const eligibleUsers = users.filter(user => 
          user.tags && user.tags.includes(item.tag)
        );
        
        if (eligibleUsers.length > 0) {
          const costPerUser = price / eligibleUsers.length;
          eligibleUsers.forEach(user => {
            userCosts[user.name] += costPerUser;
          });
        }
      }
    });
  },

  /**
   * Berechnet die Kostenverteilung für Events
   * @param {Object} expense - Event-Objekt
   * @param {Array} users - Array von Benutzerobjekten
   * @param {Object} userCosts - Objekt zum Akkumulieren der Kosten
   */
  calculateEventCosts(expense, users, userCosts) {
    if (!expense.participants || expense.participants.length === 0) return;

    const eventPrice = parseFloat(expense.price) || 0;
    const participants = expense.participants;

    // Eventpreis gleichmäßig auf alle Teilnehmer verteilen
    if (eventPrice > 0) {
      const costPerParticipant = eventPrice / participants.length;
      participants.forEach(participantName => {
        if (userCosts.hasOwnProperty(participantName)) {
          userCosts[participantName] += costPerParticipant;
        }
      });
    }

    // Extra-Ausgaben verarbeiten
    if (expense.extras && Array.isArray(expense.extras)) {
      expense.extras.forEach(extra => {
        if (!extra.price || !extra.participants || extra.participants.length === 0) return;
        
        const extraPrice = parseFloat(extra.price) || 0;
        const costPerParticipant = extraPrice / extra.participants.length;
        
        extra.participants.forEach(participantName => {
          if (userCosts.hasOwnProperty(participantName)) {
            userCosts[participantName] += costPerParticipant;
          }
        });
      });
    }
  },

  /**
   * Berechnet die Kostenverteilung für Unterkünfte
   * @param {Object} expense - Unterkunfts-Objekt
   * @param {Array} users - Array von Benutzerobjekten
   * @param {Object} userCosts - Objekt zum Akkumulieren der Kosten
   */
  calculateAccommodationCosts(expense, users, userCosts) {
    if (!expense.participants || expense.participants.length === 0) return;

    // Preis pro Nacht ist für alle gleich, aber Anzahl der Nächte kann variieren
    const pricePerNight = parseFloat(expense.pricePerNight) || 0;
    
    expense.participants.forEach(participant => {
      if (!participant.name) return;
      
      const nights = parseInt(participant.nights) || 1;
      const totalCost = nights * pricePerNight;
      
      if (userCosts.hasOwnProperty(participant.name)) {
        userCosts[participant.name] += totalCost;
      }
    });

    // Extras gleichmäßig auf ALLE Teilnehmer verteilen
    if (expense.extras && Array.isArray(expense.extras)) {
      const totalExtras = expense.extras.reduce((sum, extra) => {
        return sum + (parseFloat(extra.price) || 0);
      }, 0);
      
      if (totalExtras > 0 && expense.participants.length > 0) {
        const extraCostPerParticipant = totalExtras / expense.participants.length;
        
        expense.participants.forEach(participant => {
          if (userCosts.hasOwnProperty(participant.name)) {
            userCosts[participant.name] += extraCostPerParticipant;
          }
        });
      }
    }
  },

  /**
   * Formatiert einen Betrag als Euro-String
   * @param {number} amount - Der zu formatierende Betrag
   * @returns {string} Formatierter Euro-Betrag
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  },

  /**
   * Berechnet wer wem wie viel schuldet
   * @param {Object} userCosts - Objekt mit Benutzernamen als Keys und Kosten als Values
   * @param {Object} userPayments - Objekt mit Benutzernamen als Keys und bereits gezahlten Beträgen als Values
   * @returns {Array} Array von Transaktionsobjekten {from, to, amount}
   */
  calculateSettlements(userCosts, userPayments = {}) {
    const balances = {};
    
    // Berechne Saldo für jeden Benutzer (gezahlt - geschuldet)
    Object.keys(userCosts).forEach(userName => {
      const paid = userPayments[userName] || 0;
      const owed = userCosts[userName] || 0;
      balances[userName] = paid - owed;
    });

    const settlements = [];
    const creditors = []; // Benutzer mit positivem Saldo (bekommen Geld)
    const debtors = []; // Benutzer mit negativem Saldo (schulden Geld)

    // Sortiere Benutzer in Gläubiger und Schuldner
    Object.entries(balances).forEach(([userName, balance]) => {
      if (balance > 0.01) { // Kleine Toleranz für Rundungsfehler
        creditors.push({ name: userName, amount: balance });
      } else if (balance < -0.01) {
        debtors.push({ name: userName, amount: -balance });
      }
    });

    // Sortiere nach Betrag (größte zuerst)
    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount);

    // Berechne optimale Transaktionen
    let i = 0, j = 0;
    while (i < creditors.length && j < debtors.length) {
      const creditor = creditors[i];
      const debtor = debtors[j];
      
      const amount = Math.min(creditor.amount, debtor.amount);
      
      if (amount > 0.01) {
        settlements.push({
          from: debtor.name,
          to: creditor.name,
          amount: Math.round(amount * 100) / 100 // Runde auf 2 Dezimalstellen
        });
      }
      
      creditor.amount -= amount;
      debtor.amount -= amount;
      
      if (creditor.amount <= 0.01) i++;
      if (debtor.amount <= 0.01) j++;
    }

    return settlements;
  }
};
