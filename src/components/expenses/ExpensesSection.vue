<template>
  <div class="expenses-section">
    <div class="section-header">
      <h1>Ausgabenverwaltung</h1>
      <BaseButton @click="openExpenseModal" variant="primary">
        💰 Neue Ausgabe
      </BaseButton>
    </div>

    <div class="expenses-content">
      <p class="placeholder-text">
        Ausgabenverwaltung wird in Phase 2 implementiert...
      </p>
    </div>
  </div>
</template>

<script>
import BaseButton from '@/components/common/BaseButton.vue'

export default {
  name: 'ExpensesSection',
  components: {
    BaseButton
  },
  methods: {
    openExpenseModal() {
      console.log('Expense modal will be implemented in Phase 2')
    }
  }
}
</script>

<style scoped>
.expenses-section {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.placeholder-text {
  text-align: center;
  color: #666;
  font-style: italic;
}
</style>
