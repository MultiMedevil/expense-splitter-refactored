<template>
  <div id="app">
    <AppSidebar />
    <AppMain />
  </div>
</template>

<script>
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppMain from '@/components/layout/AppMain.vue'

export default {
  name: 'App',
  components: {
    AppSidebar,
    AppMain
  }
}
</script>

<style>
#app {
  display: flex;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Import layout styles */
@import '@/styles/layout.css';
</style>
