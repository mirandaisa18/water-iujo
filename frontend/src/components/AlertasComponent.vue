<template>
  <div v-if="alertas.length > 0" class="alert-container">
    <div class="alert-header">
      <span class="icon">🔔</span>
      <h3>Alertas del Sistema ({{ alertas.length }})</h3>
    </div>
    <div class="alert-list">
      <div 
        v-for="(alerta, index) in alertas" 
        :key="index" 
        class="alert-item" 
        :class="alerta.prioridad"
      >
        <div class="alert-content">
          <span class="alert-badge">{{ alerta.tipo.toUpperCase() }}</span>
          <p>{{ alerta.mensaje }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import api from '../services/api';

const alertas = ref([]);
let intervalId = null;

const fetchAlertas = async () => {
  try {
    const response = await api.get('/alertas');
    alertas.value = response.data;
  } catch (error) {
    console.error('Error fetching alerts:', error);
  }
};

onMounted(() => {
  fetchAlertas();
  // Actualización automática cada 30 segundos
  intervalId = setInterval(fetchAlertas, 30000);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<style scoped>
.alert-container {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-left: 6px solid #ff4757;
  animation: slideIn 0.5s ease-out;
}

.alert-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.alert-header h3 {
  margin: 0;
  color: #2f3542;
  font-size: 1.2rem;
}

.alert-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.alert-item {
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  transition: transform 0.2s;
}

.alert-item:hover {
  transform: translateX(5px);
}

.alert-item.alta {
  background: #ffecec;
  color: #c0392b;
}

.alert-item.media {
  background: #fff9e6;
  color: #d35400;
}

.alert-badge {
  font-size: 0.7rem;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(0,0,0,0.1);
  margin-right: 10px;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
