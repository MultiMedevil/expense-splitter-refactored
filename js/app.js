const { createApp } = Vue;

createApp({
  data() {
    return {
      users: [],
      newUserName: '',
      error: '',
      showDeleteModal: false,
      showItemTagDropdown: null,
      dropdownPortalCoords: { left: 0, top: 0, width: 0 },
      missingTagsInExpenseItems: [],
      userToDelete: null,
      showUserMenu: false,
      userMenuIndex: null,
      showEditModal: false,
      editUser: null,
      editUserName: '',
      // Tags System: Jeder Tag hat eine Konfiguration, die angibt wo er verwendet werden kann
      tagOptions: {
        'Alkohol': { forUsers: true, forExpenses: true },
        'Allgemein': { forUsers: false, forExpenses: true }, // Nur für Sammelausgaben
        'Fleisch': { forUsers: true, forExpenses: true },
        'Fructose-Frei': { forUsers: true, forExpenses: true },
        'Glutenfrei': { forUsers: true, forExpenses: true },
        'Laktosefrei': { forUsers: true, forExpenses: true },
        'Vegan': { forUsers: true, forExpenses: true },
        'Vegetarisch': { forUsers: true, forExpenses: true }
      },
      editUserTags: [],
      // User Modal
      showUserModal: false,
      showUserDeleteConfirm: false,
      editingUserIdx: null,
      selectedUserTags: [],
      currentView: 'users',
      expenses: [],
      showExpenseModal: false,
      newExpenseName: '',
      newExpenseItems: [],
      expenseError: '',
      editExpenseNameMode: false,
      missingTagsInExpenseItems: [],
      showExpenseMissingTagsModal: false,
      allowSaveWithMissingTags: false,
      showDeleteExpenseModal: false,
      expenseToDeleteIdx: null,
      expenseToDeleteName: '',
      editingExpenseIdx: null,
      expandedExpenseIds: [], // IDs der ausgeklappten Ausgaben

      // Event-Modal
      showEventModal: false,
      showAccommodationModal: false,
      expenseNameTouched: false, // Flag für Input-Clearing
      newAccommodationName: '',
      newAccommodationPricePerNight: '',
      accommodationParticipants: [],
      accommodationNights: {},
      accommodationExtras: [],
      newAccommodationExtraLabel: '',
      newAccommodationExtraPrice: '',
      editingAccommodationIdx: null,
      newEventName: '',
      newEventPrice: '',
      newEventParticipants: [],
      newEventExtras: [],
      showEventDropdown: false,
      showExtraDropdown: null,
      editingEventIdx: null,
      showItemTagDropdown: null,
      dropdownPortalIdx: null,
      dropdownPortalCoords: { left: 0, top: 0, width: 0 },

    };
  },
  computed: {
    validExpenses() {
      // Notfall-Schutz: Falls expenses nicht existiert oder kein Array ist
      if (!Array.isArray(this.expenses)) {
        return [];
      }
      
      return this.expenses.filter(e => {
        return e && 
               typeof e === 'object' && 
               e.id && 
               e.name && 
               typeof e.name === 'string';
      });
    },
    hasMissingTagsInExpenseItems() {
      return this.newExpenseItems.some(item => !item.tag);
    },
    // Filtert alle Tags, die für Benutzer verwendet werden können
    availableUserTags() {
      return Object.keys(this.tagOptions).filter(tag => this.tagOptions[tag].forUsers === true).sort();
    },
    // Filtert alle Tags, die für Sammelausgaben verwendet werden können
    availableExpenseTags() {
      return Object.keys(this.tagOptions).filter(tag => this.tagOptions[tag].forExpenses === true).sort();
    },
    // Berechnet die Kosten für alle Benutzer
    userCosts() {
      if (!window.ExpenseCalculator) return {};
      return window.ExpenseCalculator.calculateUserCosts(this.users, this.expenses);
    },
  },
  methods: {
    // Gibt die Gesamtkosten für einen Benutzer zurück
    getUserTotalAmount(userName) {
      return this.userCosts[userName] || 0;
    },
    
    // Hierarchische Benutzer-Statistik mit mehreren Ebenen
    getUserDetailedStats(userName) {
      const stats = {
        total: 0,
        expenses: { count: 0, amount: 0, items: [] },
        events: { count: 0, amount: 0, items: [] },
        accommodations: { count: 0, amount: 0, items: [] }
      };
      
      if (!userName) return stats;
      
      // Erste Ebene: Übersicht pro Ausgabe
      this.expenses.forEach(expense => {
        if (expense.type === 'expense') {
          const expenseDetails = this.getExpenseLevelDetails(expense, userName);
          if (expenseDetails.userAmount > 0) {
            stats.expenses.amount += expenseDetails.userAmount;
            stats.expenses.count++;
            stats.expenses.items.push(expenseDetails);
          }
        } else if (expense.type === 'event') {
          const eventDetails = this.getEventLevelDetails(expense, userName);
          if (eventDetails.userAmount > 0) {
            stats.events.amount += eventDetails.userAmount;
            stats.events.count++;
            stats.events.items.push(eventDetails);
          }
        } else if (expense.type === 'accommodation') {
          const accommodationDetails = this.getAccommodationLevelDetails(expense, userName);
          if (accommodationDetails.userAmount > 0) {
            stats.accommodations.amount += accommodationDetails.userAmount;
            stats.accommodations.count++;
            stats.accommodations.items.push(accommodationDetails);
          }
        }
      });
      
      // Gesamtsumme aus der calculator.js
      if (this.userCosts[userName]) {
        stats.total = this.userCosts[userName];
      }
      
      return stats;
    },
    
    // Detaillierte Ebene: Übersicht pro Sammelausgabe
    getExpenseLevelDetails(expense, userName) {
      const details = {
        id: expense.id,
        name: expense.name,
        totalAmount: 0,
        userAmount: 0,
        count: 0,
        items: [],
        type: 'expense'
      };
      
      if (!expense.items || !Array.isArray(expense.items)) return details;
      
      const currentUser = this.users.find(u => u.name === userName);
      if (!currentUser) return details;
      
      expense.items.forEach(item => {
        if (!item.price || !item.tag) return;
        
        const price = parseFloat(item.price) || 0;
        let userShare = 0;
        let eligibleUsers = [];
        
        if (item.tag === 'Allgemein') {
          eligibleUsers = this.users.map(u => u.name);
          userShare = price / Math.max(eligibleUsers.length, 1);
        } else {
          eligibleUsers = this.users.filter(user => 
            user.tags && user.tags.includes(item.tag)
          ).map(u => u.name);
          userShare = price / Math.max(eligibleUsers.length, 1);
        }
        
        if (eligibleUsers.includes(userName)) {
          details.userAmount += userShare;
          details.count++;
          details.totalAmount += price;
          details.items.push({
            name: item.name || 'Einzelposten',
            userShare: userShare,
            total: price,
            tag: item.tag || 'Kein Tag',
            participants: eligibleUsers.length
          });
        }
      });
      
      return details;
    },
    
    // Detaillierte Ebene: Übersicht pro Event
    getEventLevelDetails(expense, userName) {
      const details = {
        id: expense.id,
        name: expense.name,
        totalAmount: 0,
        userAmount: 0,
        count: 0,
        items: [],
        type: 'event'
      };
      
      if (!expense.participants || expense.participants.length === 0) return details;
      
      const participants = expense.participants;
      const isParticipant = participants.includes(userName);
      
      // Hauptpreis
      const eventPrice = parseFloat(expense.price) || 0;
      if (isParticipant && eventPrice > 0) {
        const costPerParticipant = eventPrice / participants.length;
        details.userAmount += costPerParticipant;
        details.totalAmount += eventPrice;
        details.items.push({
          name: expense.name || 'Event',
          userShare: costPerParticipant,
          total: eventPrice,
          participants: participants.length,
          type: 'main'
        });
        details.count++;
      }
      
      // Extra-Ausgaben
      if (expense.extras && Array.isArray(expense.extras)) {
        expense.extras.forEach(extra => {
          if (!extra.price || !extra.participants || extra.participants.length === 0) return;
          
          const extraPrice = parseFloat(extra.price) || 0;
          const extraParticipants = extra.participants;
          
          if (extraParticipants.includes(userName)) {
            const costPerExtraParticipant = extraPrice / extraParticipants.length;
            details.userAmount += costPerExtraParticipant;
            details.totalAmount += extraPrice;
            details.items.push({
              name: extra.label || 'Event Extra',
              userShare: costPerExtraParticipant,
              total: extraPrice,
              participants: extraParticipants.length,
              type: 'extra'
            });
            details.count++;
          }
        });
      }
      
      return details;
    },
    
    // Detaillierte Ebene: Übersicht pro Übernachtung
    getAccommodationLevelDetails(expense, userName) {
      const details = {
        id: expense.id,
        name: expense.name,
        totalAmount: 0,
        userAmount: 0,
        count: 0,
        items: [],
        type: 'accommodation'
      };
      
      if (!expense.participants || expense.participants.length === 0) return details;
      
      const userParticipant = expense.participants.find(p => p.name === userName);
      if (!userParticipant) return details;
      
      const nights = userParticipant.nights || 1;
      const pricePerNight = parseFloat(expense.pricePerNight) || 0;
      const userAccommodationCost = nights * pricePerNight;
      
      details.userAmount += userAccommodationCost;
      details.totalAmount += userAccommodationCost;
      details.items.push({
        name: expense.name || 'Unterkunft',
        userShare: userAccommodationCost,
        total: userAccommodationCost,
        participants: expense.participants.length,
        nights: nights,
        type: 'main'
      });
      details.count++;
      
      // Extras verarbeiten
      if (expense.extras && Array.isArray(expense.extras)) {
        expense.extras.forEach(extra => {
          if (!extra.price || !extra.participants || extra.participants.length === 0) return;
          
          const extraPrice = parseFloat(extra.price) || 0;
          const extraParticipants = extra.participants;
          
          if (extraParticipants.includes(userName)) {
            const costPerExtraParticipant = extraPrice / extraParticipants.length;
            details.userAmount += costPerExtraParticipant;
            details.totalAmount += extraPrice;
            details.items.push({
              name: extra.label || 'Unterkunft Extra',
              userShare: costPerExtraParticipant,
              total: extraPrice,
              participants: extraParticipants.length,
              type: 'extra'
            });
            details.count++;
          }
        });
      }
      
      return details;
    },
    
    // Zweite Ebene: Details für einzelne Ausgabe
    getExpenseDetailedBreakdown(expenseId, userName) {
      const expense = this.expenses.find(e => e.id === expenseId);
      if (!expense) return null;
      
      if (expense.type === 'expense') {
        return this.getDetailedExpenseBreakdown(expense, userName);
      } else if (expense.type === 'event') {
        return this.getDetailedEventBreakdown(expense, userName);
      } else if (expense.type === 'accommodation') {
        return this.getDetailedAccommodationBreakdown(expense, userName);
      }
      
      return null;
    },
    
    // Zweite Ebene: Detaillierte Aufschlüsselung für Sammelausgabe
    getDetailedExpenseBreakdown(expense, userName) {
      const breakdown = {
        name: expense.name,
        type: 'expense',
        items: []
      };
      
      if (!expense.items || !Array.isArray(expense.items)) return breakdown;
      
      let userCost = 0;
      
      // Detaillierte Aufschlüsselung erstellen
      expense.items.forEach(item => {
        if (!item.price || !item.tag) return;
        
        const price = parseFloat(item.price) || 0;
        let userShare = 0;
        let eligibleUsers = [];
        
        if (item.tag === 'Allgemein') {
          eligibleUsers = this.users.map(u => u.name);
          userShare = price / Math.max(eligibleUsers.length, 1);
        } else {
          eligibleUsers = this.users.filter(user => 
            user.tags && user.tags.includes(item.tag)
          ).map(u => u.name);
          userShare = price / Math.max(eligibleUsers.length, 1);
        }
        
        if (eligibleUsers.includes(userName)) {
          breakdown.items.push({
            name: item.name || 'Einzelposten',
            userShare: userShare,
            total: price,
            tag: item.tag || 'Kein Tag',
            participants: eligibleUsers.length
          });
        }
      });
      
      // Berechne den tatsächlichen Kostenanteil basierend auf der Logik aus calculator.js
      let totalUserCost = 0;
      expense.items.forEach(item => {
        if (!item.price || !item.tag) return;
        
        const price = parseFloat(item.price) || 0;
        let eligibleUsers = [];
        
        if (item.tag === 'Allgemein') {
          eligibleUsers = this.users.map(u => u.name);
        } else {
          eligibleUsers = this.users.filter(user => 
            user.tags && user.tags.includes(item.tag)
          ).map(u => u.name);
        }
        
        if (eligibleUsers.includes(userName)) {
          totalUserCost += price / Math.max(eligibleUsers.length, 1);
        }
      });
      
      breakdown.total = breakdown.items.reduce((sum, item) => sum + item.userShare, 0);
      
      return breakdown;
    },
    
    // Zweite Ebene: Detaillierte Aufschlüsselung für Event
    getDetailedEventBreakdown(expense, userName) {
      const breakdown = {
        name: expense.name,
        type: 'event',
        items: []
      };
      
      if (!expense.participants || expense.participants.length === 0) return breakdown;
      
      const participants = expense.participants.map(p => p.name || p);
      
      // Hauptkosten
      const totalCost = parseFloat(expense.totalCost) || parseFloat(expense.price) || 0;
      if (participants.includes(userName) && totalCost > 0) {
        const costPerParticipant = totalCost / participants.length;
        breakdown.items.push({
          name: expense.name || 'Event',
          userShare: costPerParticipant,
          total: totalCost,
          participants: participants.length,
          type: 'main'
        });
      }
      
      // Extras verarbeiten
      if (expense.extras && Array.isArray(expense.extras)) {
        expense.extras.forEach(extra => {
          if (!extra.price || !extra.participants || extra.participants.length === 0) return;
          
          const extraPrice = parseFloat(extra.price) || 0;
          const extraParticipants = extra.participants.map(p => p.name || p);
          
          if (extraParticipants.includes(userName)) {
            const costPerExtraParticipant = extraPrice / extraParticipants.length;
            breakdown.items.push({
              name: extra.label || 'Event Extra',
              userShare: costPerExtraParticipant,
              total: extraPrice,
              participants: extraParticipants.length,
              type: 'extra'
            });
          }
        });
      }
      
      // Berechne den tatsächlichen Kostenanteil basierend auf der Logik aus calculator.js
      let totalUserCost = 0;
      
      const eventParticipants = expense.participants.map(p => p.name || p);
      
      // Hauptkosten
      const eventTotalCost = parseFloat(expense.totalCost) || parseFloat(expense.price) || 0;
      if (eventParticipants.includes(userName) && eventTotalCost > 0) {
        totalUserCost += eventTotalCost / eventParticipants.length;
      }
      
      // Extras verarbeiten
      if (expense.extras && Array.isArray(expense.extras)) {
        expense.extras.forEach(extra => {
          if (!extra.price || !extra.participants || extra.participants.length === 0) return;
          
          const extraPrice = parseFloat(extra.price) || 0;
          const extraParticipants = extra.participants.map(p => p.name || p);
          
          if (extraParticipants.includes(userName)) {
            totalUserCost += extraPrice / extraParticipants.length;
          }
        });
      }
      
      breakdown.total = breakdown.items.reduce((sum, item) => sum + item.userShare, 0);
      
      return breakdown;
    },
    
    // Zweite Ebene: Detaillierte Aufschlüsselung für Übernachtung
    getDetailedAccommodationBreakdown(expense, userName) {
      const breakdown = {
        name: expense.name,
        type: 'accommodation',
        items: []
      };
      
      if (!expense.participants || expense.participants.length === 0) return breakdown;
      
      const participants = expense.participants.map(p => p.name || p);
      
      // Hauptkosten pro Nacht
      const userParticipant = expense.participants.find(p => p.name === userName);
      if (userParticipant) {
        const nights = userParticipant.nights || 1;
        const pricePerNight = parseFloat(expense.pricePerNight) || 0;
        const totalCost = nights * pricePerNight;
        
        breakdown.items.push({
          name: expense.name || 'Übernachtung',
          userShare: totalCost,
          total: totalCost,
          participants: participants.length,
          type: 'main'
        });
      }
      
      // Extras verarbeiten - bei Übernachtungen werden Extras auf alle Teilnehmer gleichmäßig verteilt
      if (expense.extras && Array.isArray(expense.extras)) {
        expense.extras.forEach(extra => {
          if (!extra.price) return;
          
          const extraPrice = parseFloat(extra.price) || 0;
          const costPerParticipant = extraPrice / participants.length;
          
          if (participants.includes(userName)) {
            breakdown.items.push({
              name: extra.label || 'Accommodation Extra',
              userShare: costPerParticipant,
              total: costPerParticipant,
              participants: participants.length,
              type: 'extra'
            });
          }
        });
      }
      
      // Die Gesamtsumme wird direkt aus den breakdown.items berechnet
      breakdown.total = breakdown.items.reduce((sum, item) => sum + item.userShare, 0);
      return breakdown;
    },

    // Methoden für die Detail-Ansicht mit sofortiger Reaktivität
    showExpenseDetails(expenseId, userName) {
      const expense = this.expenses.find(e => e.id === expenseId);
      if (!expense) return;
      
      const breakdown = this.getDetailedExpenseBreakdown(expense, userName);
      if (breakdown) {
        // Direkte Aktualisierung ohne Modal-Schließen
        this.selectedDetailItem = {
          ...breakdown,
          id: expenseId,
          user: userName,
          key: `${expenseId}-${userName}-${Date.now()}`,
          total: breakdown.total
        };
        
        // Explizite Reaktivitätsaktualisierung
        this.$forceUpdate();
      }
    },
    
    showEventDetails(expenseId, userName) {
      const expense = this.expenses.find(e => e.id === expenseId);
      if (!expense) return;
      
      const breakdown = this.getDetailedEventBreakdown(expense, userName);
      if (breakdown) {
        // Direkte Aktualisierung ohne Modal-Schließen
        this.selectedDetailItem = {
          ...breakdown,
          id: expenseId,
          user: userName,
          key: `${expenseId}-${userName}-${Date.now()}`,
          total: breakdown.total
        };
        
        // Explizite Reaktivitätsaktualisierung
        this.$forceUpdate();
      }
    },
    
    showAccommodationDetails(expenseId, userName) {
      const expense = this.expenses.find(e => e.id === expenseId);
      if (!expense) return;
      
      const breakdown = this.getDetailedAccommodationBreakdown(expense, userName);
      if (breakdown) {
        // Direkte Aktualisierung ohne Modal-Schließen
        this.selectedDetailItem = {
          ...breakdown,
          id: expenseId,
          user: userName,
          key: `${expenseId}-${userName}-${Date.now()}`,
          total: breakdown.total
        };
        
        // Explizite Reaktivitätsaktualisierung
        this.$forceUpdate();
      }
    },
    
    // Methode zum Schließen der Detail-Ansicht
    closeDetailView() {
      this.selectedDetailItem = null;
    },
    
    // Detaillierte Kostenberechnung für Sammelausgaben
    calculateDetailedExpenseItemCosts(expense, userName, stats) {
      if (!expense.items || !Array.isArray(expense.items)) return;
      
      const currentUser = this.users.find(u => u.name === userName);
      if (!currentUser) return;
      
      expense.items.forEach(item => {
        if (!item.price || !item.tag) return;
        
        const price = parseFloat(item.price) || 0;
        let userShare = 0;
        let eligibleUsers = [];
        
        if (item.tag === 'Allgemein') {
          // Allgemein-Tag: Gleichmäßig auf ALLE Benutzer verteilen
          eligibleUsers = this.users.map(u => u.name);
          userShare = price / Math.max(eligibleUsers.length, 1);
        } else {
          // Andere Tags: Nur auf Benutzer mit entsprechendem Tag verteilen
          eligibleUsers = this.users.filter(user => 
            user.tags && user.tags.includes(item.tag)
          ).map(u => u.name);
          userShare = price / Math.max(eligibleUsers.length, 1);
        }
        
        // Prüfe ob der aktuelle Benutzer teilnehmen darf
        if (eligibleUsers.includes(userName)) {
          stats.expenses.amount += userShare;
          stats.expenses.count++;
          stats.expenses.details.push({
            name: item.name || 'Einzelposten',
            price: userShare,
            tag: item.tag || 'Kein Tag',
            total: price,
            participants: eligibleUsers.length
          });
        }
      });
    },
    
    // Detaillierte Kostenberechnung für Events
    calculateDetailedEventCosts(expense, userName, stats) {
      if (!expense.participants || expense.participants.length === 0) return;
      
      const eventPrice = parseFloat(expense.price) || 0;
      const participants = expense.participants;
      
      // Hauptpreis
      if (participants.includes(userName) && eventPrice > 0) {
        const costPerParticipant = eventPrice / participants.length;
        stats.events.amount += costPerParticipant;
        stats.events.count++;
        stats.events.details.push({
          name: expense.name || 'Event',
          price: costPerParticipant,
          total: eventPrice,
          participants: participants.length
        });
      }
      
      // Extra-Ausgaben
      if (expense.extras && Array.isArray(expense.extras)) {
        expense.extras.forEach(extra => {
          if (!extra.price || !extra.participants || extra.participants.length === 0) return;
          
          const extraPrice = parseFloat(extra.price) || 0;
          const extraParticipants = extra.participants;
          
          if (extraParticipants.includes(userName)) {
            const costPerExtraParticipant = extraPrice / extraParticipants.length;
            stats.events.amount += costPerExtraParticipant;
            stats.events.details.push({
              name: extra.label || 'Event Extra',
              price: costPerExtraParticipant,
              total: extraPrice,
              participants: extraParticipants.length
            });
          }
        });
      }
    },
    
    // Detaillierte Kostenberechnung für Übernachtungen
    calculateDetailedAccommodationCosts(expense, userName, stats) {
      if (!expense.participants || expense.participants.length === 0) return;
      
      const userParticipant = expense.participants.find(p => p.name === userName);
      if (!userParticipant) return;
      
      const nights = userParticipant.nights || 1;
      const pricePerNight = parseFloat(expense.pricePerNight) || 0;
      const userAccommodationCost = nights * pricePerNight;
      
      stats.accommodations.amount += userAccommodationCost;
      stats.accommodations.count++;
      stats.accommodations.details.push({
        name: expense.name || 'Unterkunft',
        price: userAccommodationCost,
        total: userAccommodationCost,
        participants: expense.participants.length,
        nights: nights
      });
      
      // Extras verarbeiten
      if (expense.extras && Array.isArray(expense.extras)) {
        expense.extras.forEach(extra => {
          if (!extra.price || !extra.participants || extra.participants.length === 0) return;
          
          const extraPrice = parseFloat(extra.price) || 0;
          const extraParticipants = extra.participants;
          
          if (extraParticipants.includes(userName)) {
            const costPerExtraParticipant = extraPrice / extraParticipants.length;
            stats.accommodations.amount += costPerExtraParticipant;
            stats.accommodations.details.push({
              name: extra.label || 'Unterkunft Extra',
              price: costPerExtraParticipant,
              total: extraPrice,
              participants: extraParticipants.length
            });
          }
        });
      }
    },
    closeAllDropdowns(event) {
      // Schließe das Dropdown, wenn der Klick außerhalb erfolgt ist
      // Prüfe ob das Dropdown überhaupt offen ist
      if (this.showItemTagDropdown === null) return;
      
      // Prüfe ob der Klick innerhalb des Dropdowns oder Labels war
      const dropdownList = event.target.closest('.dropdown-list');
      const dropdownLabel = event.target.closest('.dropdown-label');
      const dropdownMultiselect = event.target.closest('.dropdown-multiselect');
      
      // Wenn der Klick außerhalb war, schließe das Dropdown
      if (!dropdownList && !dropdownLabel && !dropdownMultiselect) {
        this.showItemTagDropdown = null;
      }
    },
    closeExpenseModal() {
      this.showExpenseModal = false;
      this.showItemTagDropdown = null; // Schließe das Dropdown beim Schließen des Modals
      this.expenseError = '';
    },
    closeDropdownOnModalClick(event) {
      // Schließe das Dropdown nur, wenn nicht auf Dropdown-Elemente geklickt wurde
      const isDropdownClick = event.target.closest('.dropdown-list') || 
                             event.target.closest('.dropdown-label') ||
                             event.target.closest('.dropdown-multiselect');
      
      if (!isDropdownClick && this.showItemTagDropdown !== null) {
        this.showItemTagDropdown = null;
      }
    },
    openExpenseModal(idx) {
      this.showExpenseModal = true;
      this.showItemTagDropdown = null; // Schließe eventuell offene Dropdowns
      this.editingEventIdx = null;
      if (typeof idx === 'number') {
        const expense = this.expenses[idx];
        this.newExpenseName = expense.name;
        this.newExpenseItems = expense.items ? expense.items.map(item => ({ ...item })) : [];
        this.editingExpenseIdx = idx;
        this.editExpenseNameMode = false;
        // Prüfe auf fehlende Tags beim Öffnen
        this.missingTagsInExpenseItems = [];
        this.newExpenseItems.forEach((item, index) => {
          if (!item.tag) {
            this.missingTagsInExpenseItems.push(index);
          }
        });
      } else {
        this.newExpenseName = '';
        this.newExpenseItems = [{ name: '', price: '', tag: '' }];
        this.editingExpenseIdx = null;
        this.editExpenseNameMode = false;
        this.missingTagsInExpenseItems = [];
      }
      this.expenseError = '';
    },

    getExpenseTotal(expense) {
      if (expense.type === 'event') {
        const extrasTotal = Array.isArray(expense.extras)
          ? expense.extras.reduce((sum, ex) => sum + (Number(ex.price) || 0), 0)
          : 0;
        return (Number(expense.price) || 0) + extrasTotal;
      }
      
      if (expense.type === 'accommodation') {
        // Berechne Gesamtkosten: Summe aller Übernachtungen + Extras
        const nightsTotal = expense.participants.reduce((sum, p) => {
          return sum + (expense.pricePerNight * (p.nights || 1));
        }, 0);
        const extrasTotal = Array.isArray(expense.extras)
          ? expense.extras.reduce((sum, ex) => sum + (Number(ex.price) || 0), 0)
          : 0;
        return nightsTotal + extrasTotal;
      }
      
      // Sammelausgabe
      return Array.isArray(expense.items)
        ? expense.items.reduce((sum, item) => sum + (Number(item.price) || 0), 0)
        : 0;
    },

    toggleExpenseDropdown(expenseId) {
      const index = this.expandedExpenseIds.indexOf(expenseId);
      if (index > -1) {
        // Ausgabe ist bereits ausgeklappt, also zuklappen
        this.expandedExpenseIds.splice(index, 1);
      } else {
        // Ausgabe aufklappen
        this.expandedExpenseIds.push(expenseId);
      }
    },
    getTotalOfAllExpenses() {
      return this.expenses.reduce((total, expense) => total + this.getExpenseTotal(expense), 0);
    },

    editExpense(expenseId) {
      const idx = this.expenses.findIndex(e => e && e.id === expenseId);
      if (idx === -1) return;
      const expense = this.expenses[idx];
      if (expense.type === 'event') {
        // Event bearbeiten
        this.editingEventIdx = idx;
        this.newEventName = expense.name;
        this.newEventPrice = expense.price;
        this.newEventParticipants = [...expense.participants];
        this.newEventExtras = expense.extras ? expense.extras.map(e => ({
          label: e.label,
          price: e.price,
          participants: [...e.participants]
        })) : [];
        this.showEventModal = true;
      } else if (expense.type === 'accommodation') {
        // Übernachtungskosten bearbeiten
        this.editingAccommodationIdx = idx;
        this.newAccommodationName = expense.name;
        this.newAccommodationPricePerNight = expense.pricePerNight;
        this.accommodationParticipants = expense.participants.map(p => p.name);
        this.accommodationNights = {};
        expense.participants.forEach(p => {
          this.accommodationNights[p.name] = p.nights;
        });
        this.accommodationExtras = expense.extras ? expense.extras.map(e => ({
          label: e.label,
          price: e.price
        })) : [];
        this.showAccommodationModal = true;
      } else {
        // Sammelausgabe bearbeiten wie bisher
        this.openExpenseModal(idx);
      }
    },
    confirmDeleteExpense(expenseId) {
      const idx = this.expenses.findIndex(e => e && e.id === expenseId);
      if (idx === -1) return;
      this.showDeleteExpenseModal = true;
      this.expenseToDeleteIdx = idx;
      this.expenseToDeleteName = this.expenses[idx].name;
    },
    deleteExpense() {
      if (this.expenseToDeleteIdx !== null) {
        this.expenses.splice(this.expenseToDeleteIdx, 1);
        this.saveExpenses();
      }
      this.cancelDeleteExpense();
    },
    cancelDeleteExpense() {
      this.showDeleteExpenseModal = false;
      this.expenseToDeleteIdx = null;
      this.expenseToDeleteName = '';
    },
    closeExpenseModal() {
      this.showExpenseModal = false;
      this.newExpenseName = '';
      this.newExpenseItems = [];
      this.expenseError = '';
      this.editExpenseNameMode = false;
    },
    addExpenseItem() {
      this.newExpenseItems.push({ name: '', price: '', tag: '' });
    },
    removeExpenseItem(idx) {
      this.newExpenseItems.splice(idx, 1);
    },

    saveExpense() {
      const name = (this.newExpenseName && this.newExpenseName.trim()) ? this.newExpenseName.trim() : 'Neue Sammelausgabe';
      if (!name) {
        this.expenseError = 'Bitte gib einen Namen für die Sammelausgabe an!';
        return;
      }
      if (!this.newExpenseItems.length || this.newExpenseItems.some(item => !item.name.trim() || !item.price || item.price <= 0)) {
        this.expenseError = 'Alle Einzelposten brauchen Namen und einen Preis > 0!';
        return;
      }
      // Prüfe auf fehlende Tags
      this.missingTagsInExpenseItems = this.newExpenseItems.map((item, idx) => item.tag ? null : idx).filter(idx => idx !== null);
      if (this.missingTagsInExpenseItems.length > 0 && !this.allowSaveWithMissingTags) {
        this.showExpenseMissingTagsModal = true;
        return;
      }
      // Speichern
      this.allowSaveWithMissingTags = false;
      if (this.editingExpenseIdx !== null) {
        this.expenses[this.editingExpenseIdx] = {
          ...this.expenses[this.editingExpenseIdx],
          name: name,
          items: this.newExpenseItems.map(item => ({...item}))
        };
      } else {
        this.expenses.push({
          id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
          type: 'sammelausgabe',
          name: name,
          items: this.newExpenseItems.map(item => ({...item}))
        });
      }
      this.saveExpenses();
      this.closeExpenseModal();
    },
    confirmSaveExpenseWithMissingTags() {
      this.allowSaveWithMissingTags = true;
      this.showExpenseMissingTagsModal = false;
      this.saveExpense();
    },
    cancelSaveExpenseWithMissingTags() {
      this.showExpenseMissingTagsModal = false;
      // Jetzt erst hervorheben
      // (missingTagsInExpenseItems ist schon gesetzt)
    },
    saveExpenses() {
      window.localStorage.setItem('expenses', JSON.stringify(this.expenses));
    },
    loadExpenses() {
      const data = window.localStorage.getItem('expenses');
      let loaded = data ? JSON.parse(data) : [];
      
      // Erst komplett ungültige Einträge herausfiltern
      loaded = loaded.filter(exp => {
        return exp && typeof exp === 'object' && exp.id && exp.name;
      });
      
      // Dann defensive Heilung: fehlende Felder ergänzen
      loaded = loaded.map(exp => {
        if (exp.type === 'event') {
          return { 
            ...exp, 
            extras: Array.isArray(exp.extras) ? exp.extras : [], 
            participants: Array.isArray(exp.participants) ? exp.participants : [], 
            price: Number(exp.price) || 0 
          };
        } else {
          return { 
            ...exp, 
            items: Array.isArray(exp.items) ? exp.items : [],
            type: exp.type || 'sammelausgabe'
          };
        }
      });
      
      this.expenses = loaded;
      
      // Bereinigten Zustand sofort speichern
      this.saveExpenses();
    },
    addUser() {
      const name = this.newUserName.trim();
      if (!name) {
        this.error = 'Name darf nicht leer sein!';
        return;
      }
      if (this.users.some(u => u.name === name)) {
        this.error = 'Benutzername existiert bereits!';
        return;
      }
      this.users.push({ name });
      this.newUserName = '';
      this.error = '';
      this.saveUsers();
    },
    saveUsers() {
      window.DataManager.saveUsers(this.users);
    },
    loadUsers() {
      this.users = window.DataManager.loadUsers();
    },
    openUserMenu(index) {
      this.userMenuIndex = index;
      this.showUserMenu = true;
    },
    closeUserMenu() {
      this.showUserMenu = false;
      this.userMenuIndex = null;
    },
    editUserStart(user) {
      this.editUser = user;
      this.editUserName = user.name;
      
      // Stelle sicher, dass wir nur gültige Benutzer-Tags haben
      const validUserTags = Array.isArray(user.tags) ? user.tags.filter(tag => 
        Object.keys(this.tagOptions).includes(tag) && this.tagOptions[tag].forUsers === true
      ) : [];
      
      this.editUserTags = [...validUserTags];
      this.showEditModal = true;
      this.closeUserMenu();
    },
    saveEditUser() {
      if (!this.editUserName.trim()) {
        this.error = 'Name darf nicht leer sein!';
        return;
      }
      if (this.users.some(u => u.name === this.editUserName.trim() && u !== this.editUser)) {
        this.error = 'Benutzername existiert bereits!';
        return;
      }
      this.editUser.name = this.editUserName.trim();
      this.editUser.tags = [...this.editUserTags];
      this.saveUsers();
      this.showEditModal = false;
      this.editUser = null;
      this.editUserName = '';
      this.editUserTags = [];
      this.error = '';
    },
    cancelEditUser() {
      this.showEditModal = false;
      this.editUser = null;
      this.editUserName = '';
      this.editUserTags = [];
      this.error = '';
    },
    deleteUser(name) {
      this.userToDelete = name;
      this.showDeleteModal = true;
      this.closeUserMenu();
    },
    confirmDelete() {
      if (this.userToDelete) {
        this.users = this.users.filter(u => u.name !== this.userToDelete);
        this.saveUsers();
        this.userToDelete = null;
        this.showDeleteModal = false;
      }
    },
    cancelDelete() {
      this.userToDelete = null;
      this.showDeleteModal = false;
    },
    // --- Event-Modal Methoden ---
    // --- Expense Methods ---
    openExpenseModal() {
      this.showExpenseModal = true;
      this.editingExpenseIdx = null;
      this.newExpenseName = '';
      this.newExpenseItems = [];
    },
    
    closeExpenseModal() {
      this.showExpenseModal = false;
      this.newExpenseName = '';
      this.newExpenseItems = [];
    },
    
    addExpenseItem() {
      this.newExpenseItems.push({
        name: '',
        price: '',
        tag: ''
      });
    },
    
    removeExpenseItem(idx) {
      this.newExpenseItems.splice(idx, 1);
    },
    
    saveExpense() {
      if (!this.newExpenseName.trim() || this.newExpenseItems.length === 0) {
        alert('Bitte Namen und mindestens einen Posten angeben!');
        return;
      }
      
      const expense = {
        type: 'expense',
        name: this.newExpenseName.trim(),
        items: this.newExpenseItems.map(item => ({
          name: item.name || '',
          price: Number(item.price) || 0,
          tag: item.tag || 'Allgemein'
        }))
      };
      
      if (this.editingExpenseIdx !== null) {
        expense.id = this.expenses[this.editingExpenseIdx].id;
        expense.created = this.expenses[this.editingExpenseIdx].created;
        this.expenses[this.editingExpenseIdx] = expense;
      } else {
        expense.id = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        expense.created = new Date().toISOString();
        this.expenses.push(expense);
      }
      
      this.saveExpenses();
      this.closeExpenseModal();
    },
    
    openEventModal() {
      this.showEventModal = true;
      this.editingEventIdx = null;
      this.newEventName = '';
      this.newEventPrice = '';
      this.newEventParticipants = []; // Standard: leer
      this.newEventExtras = [];
    },
    closeEventModal() {
      this.showEventModal = false;
      this.newEventName = '';
      this.newEventPrice = '';
      this.newEventParticipants = [];
      this.newEventExtras = [];
    },
    toggleEventParticipant(userName) {
      const idx = this.newEventParticipants.indexOf(userName);
      if (idx >= 0) {
        this.newEventParticipants.splice(idx, 1);
      } else {
        this.newEventParticipants.push(userName);
      }
      this.newEventParticipants = [...this.newEventParticipants];
    },
    addEventExtra() {
      this.newEventExtras.push({ label: '', price: '', participants: [] });
    },
    removeEventExtra(idx) {
      this.newEventExtras.splice(idx, 1);
    },
    toggleExtraParticipant(extraIdx, userName) {
      const arr = this.newEventExtras[extraIdx].participants;
      const i = arr.indexOf(userName);
      if (i >= 0) {
        arr.splice(i, 1);
      } else {
        arr.push(userName);
      }
      this.newEventExtras[extraIdx].participants = [...arr];
    },
    saveEvent() {
  if (!this.newEventName.trim() || !this.newEventPrice || this.newEventParticipants.length === 0) {
    this.closeEventModal();
    return;
  }
  
  // Sichere ID-Generierung
  const eventId = this.editingEventIdx !== null 
    ? this.expenses[this.editingEventIdx].id 
    : Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  
  const eventObj = {
    id: eventId,
    type: 'event',
    name: this.newEventName.trim(),
    price: Number(this.newEventPrice) || 0,
    participants: Array.isArray(this.newEventParticipants) ? [...this.newEventParticipants] : [],
    extras: Array.isArray(this.newEventExtras) ? this.newEventExtras.map(e => ({
      label: e.label || '',
      price: Number(e.price) || 0,
      participants: Array.isArray(e.participants) ? [...e.participants] : []
    })) : []
  };
  
  // Prüfe, dass das Objekt vollständig ist
  if (!eventObj.id || !eventObj.name) {
    console.error('Event-Objekt unvollständig:', eventObj);
    this.closeEventModal();
    return;
  }
  
  if (this.editingEventIdx !== null) {
    this.expenses.splice(this.editingEventIdx, 1, eventObj);
  } else {
    this.expenses.push(eventObj);
  }
  
  this.saveExpenses();
  this.closeEventModal();
},
    toggleEventDropdown() {
      this.showEventDropdown = !this.showEventDropdown;
      this.showExtraDropdown = null;
    },
    toggleExtraDropdown(idx) {
      this.showExtraDropdown = this.showExtraDropdown === idx ? null : idx;
      this.showEventDropdown = false;
    },
    closeAllDropdowns() {
      this.showEventDropdown = false;
      this.showExtraDropdown = null;
    },
    
    // --- Accommodation Methods ---
    openAccommodationModal() {
      this.showAccommodationModal = true;
    },
    
    toggleAccommodationParticipant(name) {
      // Wenn der Teilnehmer hinzugefügt wurde, initialisiere seine Nächte
      if (this.accommodationParticipants.includes(name)) {
        this.accommodationNights[name] = this.accommodationNights[name] || 1;
      } else {
        // Wenn entfernt, lösche die Nächte
        delete this.accommodationNights[name];
      }
    },
    
    closeAccommodationModal() {
      this.showAccommodationModal = false;
      this.newAccommodationName = '';
      this.newAccommodationPricePerNight = '';
      this.accommodationParticipants = [];
      this.accommodationNights = {};
      this.accommodationExtras = [];
      this.newAccommodationExtraLabel = '';
      this.newAccommodationExtraPrice = '';
      this.editingAccommodationIdx = null;
    },
    
    addAccommodationExtra() {
      if (this.newAccommodationExtraLabel && this.newAccommodationExtraPrice > 0) {
        this.accommodationExtras.push({
          label: this.newAccommodationExtraLabel,
          price: Number(this.newAccommodationExtraPrice)
        });
        this.newAccommodationExtraLabel = '';
        this.newAccommodationExtraPrice = '';
      }
    },
    
    removeAccommodationExtra(idx) {
      this.accommodationExtras.splice(idx, 1);
    },
    
    saveAccommodation() {
      if (!this.newAccommodationPricePerNight || this.accommodationParticipants.length === 0) {
        alert('Bitte Preis pro Nacht und mindestens einen Teilnehmer angeben!');
        return;
      }
      
      const accommodation = {
        type: 'accommodation',
        name: this.newAccommodationName.trim() || 'Unterkunft',
        pricePerNight: Number(this.newAccommodationPricePerNight),
        participants: this.accommodationParticipants.map(name => ({
          name: name,
          nights: this.accommodationNights[name] || 1
        })),
        extras: [...this.accommodationExtras]
      };
      
      if (this.editingAccommodationIdx !== null) {
        // Bearbeiten: ID beibehalten
        accommodation.id = this.expenses[this.editingAccommodationIdx].id;
        accommodation.created = this.expenses[this.editingAccommodationIdx].created;
        this.expenses[this.editingAccommodationIdx] = accommodation;
      } else {
        // Neu erstellen
        accommodation.id = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        accommodation.created = new Date().toISOString();
        this.expenses.push(accommodation);
      }
      
      this.saveExpenses();
      this.closeAccommodationModal();
    },
    toggleItemTagDropdown(idx) {
      // Wenn wir das bereits geöffnete Dropdown schließen
      if (this.showItemTagDropdown === idx) {
        this.showItemTagDropdown = null;
        return;
      }
      
      // Wir öffnen ein neues Dropdown
      this.showItemTagDropdown = idx;
      
      // Wir müssen ein wenig warten bis Vue das DOM aktualisiert hat
      this.$nextTick(() => {
        // Finde das dropdown-label Element für diesen Index
        const labelElements = document.querySelectorAll('.dropdown-label');
        const labelElement = labelElements[idx]; // Das entsprechende Label finden
        
        if (labelElement) {
          const rect = labelElement.getBoundingClientRect();
          
          // Berechne Position und setze das Koordinatenobjekt
          this.dropdownPortalCoords = {
            left: rect.left,
            top: rect.bottom,
            width: rect.width
          };
        }
      });
      
      // Andere Dropdowns schließen
      this.showEventDropdown = false;
      this.showExtraDropdown = null;
    },
    selectItemTag(idx, tag) {
      // Überprüfe, ob der Index gültig ist
      if (this.newExpenseItems && this.newExpenseItems[idx] !== undefined) {
        this.newExpenseItems[idx].tag = tag;
        this.showItemTagDropdown = null;
        
        // Aktualisiere die Liste der fehlenden Tags
        if (!tag && !this.missingTagsInExpenseItems.includes(idx)) {
          this.missingTagsInExpenseItems.push(idx);
        } else if (tag && this.missingTagsInExpenseItems.includes(idx)) {
          const index = this.missingTagsInExpenseItems.indexOf(idx);
          this.missingTagsInExpenseItems.splice(index, 1);
        }
      } else {
        console.error('Ungültiger Index für selectItemTag:', idx);
        this.showItemTagDropdown = null; // Schließe das Dropdown trotzdem
      }
    },



    // User Modal Methods
    openUserModal(idx) {
      this.showUserModal = true;
      if (typeof idx === 'number') {
        this.editingUserIdx = idx;
        this.selectedUserTags = [...(this.users[idx].tags || [])];
      } else {
        this.editingUserIdx = null;
        this.newUserName = '';
        this.selectedUserTags = [];
        this.error = '';
      }
    },

    closeUserModal() {
      this.showUserModal = false;
      this.editingUserIdx = null;
      this.newUserName = '';
      this.selectedUserTags = [];
      this.error = '';
    },

    toggleUserTag(tag) {
      if (this.editingUserIdx !== null) {
        // Bearbeite existierenden User
        const user = this.users[this.editingUserIdx];
        if (!user.tags) user.tags = [];
        const tagIndex = user.tags.indexOf(tag);
        if (tagIndex > -1) {
          user.tags.splice(tagIndex, 1);
        } else {
          user.tags.push(tag);
        }
      } else {
        // Neuer User
        const tagIndex = this.selectedUserTags.indexOf(tag);
        if (tagIndex > -1) {
          this.selectedUserTags.splice(tagIndex, 1);
        } else {
          this.selectedUserTags.push(tag);
        }
      }
    },

    saveNewUser() {
      if (!this.newUserName || this.newUserName.trim() === '') {
        this.error = 'Bitte einen Namen eingeben';
        return;
      }
      if (this.users.some(u => u.name === this.newUserName)) {
        this.error = 'Benutzer existiert bereits';
        return;
      }
      this.users.push({
        name: this.newUserName,
        tags: [...this.selectedUserTags]
      });
      this.saveUsers();
      this.closeUserModal();
    },

    updateUser() {
      if (this.editingUserIdx !== null) {
        this.saveUsers();
        this.closeUserModal();
      }
    },

    confirmDeleteUser() {
      this.showUserDeleteConfirm = true;
      this.showUserModal = false;
    },

    deleteUserConfirmed() {
      if (this.editingUserIdx !== null) {
        this.users.splice(this.editingUserIdx, 1);
        this.saveUsers();
      }
      this.showUserDeleteConfirm = false;
      this.editingUserIdx = null;
    },

    cancelUserDelete() {
      this.showUserDeleteConfirm = false;
      this.showUserModal = true;
    },

    getUserExpenseCount(userName) {
      return this.expenses.filter(expense => {
        if (expense.type === 'event') {
          return expense.participants && expense.participants.includes(userName);
        } else if (expense.type === 'accommodation') {
          return expense.participants && expense.participants.some(p => p.name === userName);
        } else if (expense.items) {
          return expense.items.some(item => item.tag === userName);
        }
        return false;
      }).length;
    },



    getUserTagStyle(tag) {
      // Prüfe, ob der Tag ausgewählt ist
      const isSelected = this.editingUserIdx !== null 
        ? (this.users[this.editingUserIdx].tags || []).includes(tag)
        : this.selectedUserTags.includes(tag);
      
      // Füge besondere Stile hinzu, wenn der Tag speziell ist
      let styles = {};
      
      // Wenn der Tag ausgewählt ist, zeige das an
      if (isSelected) {
        styles.background = '#e3f2fd';
        styles.borderColor = '#2196f3';
      }
      
      // Kennzeichne Tags, die nur für Sammelausgaben sind
      if (this.tagOptions[tag] && this.tagOptions[tag].forUsers === false) {
        styles.display = 'none'; // Verstecke Tags, die nicht für Benutzer sind
      }
      
      return styles;
    },

    saveUsers() {
      localStorage.setItem('users', JSON.stringify(this.users));
    },

    loadUsers() {
      const saved = localStorage.getItem('users');
      if (saved) {
        this.users = JSON.parse(saved);
      }
    },
  },
  mounted() {
    this.loadUsers();
    this.loadExpenses();
    // Arrow-Funktion für Event-Listener, damit 'this' korrekt ist
    this._boundCloseAllDropdowns = (event) => this.closeAllDropdowns(event);
    document.addEventListener('click', this._boundCloseAllDropdowns);
  },
  beforeUnmount() {
    document.removeEventListener('click', this._boundCloseAllDropdowns);
  }
}).mount('#app');