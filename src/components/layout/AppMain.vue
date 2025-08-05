<template>
  <main class="main-content">
    <UsersSection v-if="currentView === 'users'" />
    <ExpensesSection v-if="currentView === 'expenses'" />
    <TripsSection v-if="currentView === 'trips'" />
    <SettingsSection v-if="currentView === 'settings'" />
  </main>
</template>

<script>
import UsersSection from '@/components/users/UsersSection.vue'
import ExpensesSection from '@/components/expenses/ExpensesSection.vue'
import TripsSection from '@/components/trips/TripsSection.vue'
import SettingsSection from '@/components/settings/SettingsSection.vue'

export default {
  name: 'AppMain',
  components: {
    UsersSection,
    ExpensesSection,
    TripsSection,
    SettingsSection
  },
  data() {
    return {
      currentView: 'users'
    }
  }
}
</script>

<style scoped>
.main-content {
  flex: 1;
  padding: 2rem;
  background-color: var(--background-color);
  overflow-y: auto;
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
}
</style>
