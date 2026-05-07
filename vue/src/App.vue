<template>
  <router-view />
</template>

<script setup lang="ts">
// No logic needed here for now
</script>

<style>
:root {
  --bg-main: #f8fafc;
  --font-main: 'Inter', 'Segoe UI', system-ui, sans-serif;
  --text-color: #1e293b;
}

body, html {
  margin: 0;
  padding: 0;
  font-family: var(--font-main);
  background-color: var(--bg-main);
  color: var(--text-color);
}

#app {
  width: 100%;
}

.app-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: var(--bg-main);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
</style>