<template>
  <div class="trips-section">
    <div class="section-header">
      <h1>Reisen & Events</h1>
      <BaseButton @click="openTripModal" variant="primary">
        ✈️ Neue Reise
      </BaseButton>
    </div>

    <div class="trips-content">
      <p class="placeholder-text">
        Reisenverwaltung wird in Phase 2 implementiert...
      </p>
    </div>
  </div>
</template>

<script>
import BaseButton from '@/components/common/BaseButton.vue'

export default {
  name: 'TripsSection',
  components: {
    BaseButton
  },
  methods: {
    openTripModal() {
      console.log('Trip modal will be implemented in Phase 2')
    }
  }
}
</script>

<style scoped>
.trips-section {
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
