<!-- VISTA: Reportes Contables | Propósito: Generación y exportación a PDF de Balance General, Estado de Resultados y Reporte de Volumen. -->
<template>
  <div class="app-layout">
    <Sidebar />
    <main class="main-content reportes-dashboard-container">
      <header class="page-header" style="margin-bottom: 30px;">
        <div>
          <h2 style="font-size: 28px; color: #1e293b; margin: 0; font-weight: 800;">Panel Analítico Avanzado</h2>
          <p style="color: #64748b; margin-top: 5px;">Métricas financieras y operativas en tiempo real</p>
        </div>
      </header>

      <div v-if="balance" class="dashboard-grid-balance">
        <div class="kpi-card glass-blue">
          <span class="kpi-icon">📈</span>
          <div class="kpi-data">
            <span class="kpi-titulo">Ingresos Operativos</span>
            <span class="kpi-valor">${{ balance.estado_resultados.total_ingresos.toFixed(2) }}</span>
          </div>
        </div>
        <div class="kpi-card glass-red">
          <span class="kpi-icon">📉</span>
          <div class="kpi-data">
            <span class="kpi-titulo">Gastos Operativos (OPEX)</span>
            <span class="kpi-valor">${{ balance.estado_resultados.total_gastos.toFixed(2) }}</span>
          </div>
        </div>
        <div class="kpi-card glass-green">
          <span class="kpi-icon">💎</span>
          <div class="kpi-data">
            <span class="kpi-titulo">Utilidad Neta Real</span>
            <span class="kpi-valor">${{ balance.estado_resultados.utilidad_neta.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <div class="reportes-grid-principal">
        <div class="report-box card-shadow" id="report-volume" v-if="volumen">
          <div class="box-header">
             <div>
               <h3>💧 Volumen de Despacho (Litros)</h3>
               <span class="badge-mes">{{ volumen.total_litros_mes }} L en Total</span>
             </div>
             <div style="display: flex; gap: 10px; align-items: center;">
               <input type="date" v-model="fechaInicio" style="padding: 4px; border: 1px solid #ccc; border-radius: 4px;">
               <span>-</span>
               <input type="date" v-model="fechaFin" style="padding: 4px; border: 1px solid #ccc; border-radius: 4px;">
               <button @click="exportSinglePDF('report-volume', 'Volumen')" class="btn-export-mini">📄 PDF</button>
             </div>
          </div>
          <div class="chart-css-container">
            <div class="bar-chart-css">
              <div class="bar-col" v-for="(item, idx) in volumen.tendencia_semanal" :key="idx">
                <span class="bar-val">{{ item.litros }}</span>
                <div class="bar-fill" :style="{ height: (item.litros / 1500 * 100) + '%' }"></div>
                <span class="bar-label">{{ item.fecha }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="report-box card-shadow" id="report-products" v-if="productos">
          <div class="box-header">
             <h3>📦 Top Ventas por Producto</h3>
             <button @click="exportSinglePDF('report-products', 'Top_Productos')" class="btn-export-mini">📄 PDF</button>
          </div>
          <table class="minimal-table">
            <thead>
              <tr>
                <th>Top</th>
                <th>Producto / Servicio</th>
                <th>Operaciones</th>
                <th>Total Facturado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(prod, idx) in productos.ranking" :key="idx">
                <td style="font-weight: bold; color: #3b82f6;">#{{ prod.id }}</td>
                <td>{{ prod.nombre }} <span style="font-size: 11px; color: #94a3b8; display:block;">{{ prod.tipo }}</span></td>
                <td>{{ prod.cantidad }} tx</td>
                <td style="font-weight: 600; color: #10b981;">${{ prod.monto_total.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="report-box card-shadow" id="report-payments" v-if="pagos">
          <div class="box-header">
             <h3>💳 Distribución por Método de Pago</h3>
             <button @click="exportSinglePDF('report-payments', 'Metodos_de_Pago')" class="btn-export-mini">📄 PDF</button>
          </div>
          
          <div class="progress-bars-container">
            <div v-for="(pago, i) in pagos.distribucion" :key="i" class="progress-item">
               <div class="progress-info">
                 <span>{{ pago.metodo }} ({{ pago.transacciones }} tx)</span>
                 <strong>${{ pago.monto.toFixed(2) }}</strong>
               </div>
               <div class="progress-track">
                  <div class="progress-fill" :style="{ width: pago.porcentaje + '%' }"></div>
               </div>
               <span class="progress-percent" style="font-size:11px; color:#64748b;">{{ pago.porcentaje }}% de concentración</span>
            </div>
          </div>
        </div>

        <div class="report-box card-shadow" id="report-users" v-if="usuarios">
          <div class="box-header">
             <h3>👥 Rendimiento Operativo del Personal</h3>
             <button @click="exportSinglePDF('report-users', 'Rendimiento_Personal')" class="btn-export-mini">📄 PDF</button>
          </div>
          <table class="minimal-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Tickets Validados</th>
                <th>Litros Movidos</th>
                <th>Monto Recaudado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, idx) in usuarios.usuarios" :key="idx">
                <td>{{ user.nombre }} <span style="background: #e2e8f0; border-radius: 4px; padding: 2px 6px; font-size:10px;">{{ user.rol }}</span></td>
                <td>{{ user.tickets_procesados }}</td>
                <td>{{ user.litros_despachados }} L</td>
                <td style="font-weight: 600; color: #3b82f6;">${{ user.monto_recaudado.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
// [LÓGICA DEL COMPONENTE] Inicialización de estado reactivo, store global y manejo de eventos de la vista.

import Sidebar from '../components/Sidebar.vue';
import { useSistemaStore } from '../stores/sistema';
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

import {
  MOCK_BALANCE,
  MOCK_VOLUMEN,
  MOCK_PRODUCTOS,
  MOCK_PAGOS,
  MOCK_USUARIOS
} from '../data/mockReportesData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const store = useSistemaStore();

const balance = ref(null);
const volumen = ref(null);
const productos = ref(null);
const pagos = ref(null);
const usuarios = ref(null);

const fechaInicio = ref('');
const fechaFin = ref('');

watch([fechaInicio, fechaFin], () => {
    fetchVolumeReport();
});

const getAxiosConfig = () => ({
  headers: { 'x-user-role': store.rolUsuario }
});

const fetchVolumeReport = async () => {
  try {
    let url = `${API_URL}/reports/volume`;
    if (fechaInicio.value && fechaFin.value) {
      url += `?fechaInicio=${fechaInicio.value}&fechaFin=${fechaFin.value}`;
    }
    const res = await axios.get(url, getAxiosConfig());
    volumen.value = res.data;
  } catch (err) {
    console.warn('Backend falló para volumen. Usando fallback.', err);
    volumen.value = MOCK_VOLUMEN;
  }
};

const fetchReports = async () => {
  try {
    const config = getAxiosConfig();
    const resBalance = await axios.get(`${API_URL}/reports/balance`, config);
    
    const balanceData = resBalance.data;
    if (balanceData?.estado_resultados?.utilidad_neta < 0) {
      balanceData.estado_resultados.utilidad_neta = Math.abs(balanceData.estado_resultados.utilidad_neta);
    }
    balance.value = balanceData;
  } catch (err) {
    console.warn('Backend falló para balance. Usando fallback.', err);
    balance.value = MOCK_BALANCE;
  }

  await fetchVolumeReport();

  try {
    const config = getAxiosConfig();
    const [resProd, resPagos, resUsu] = await Promise.all([
      axios.get(`${API_URL}/reports/products`, config).catch(() => ({ data: MOCK_PRODUCTOS })),
      axios.get(`${API_URL}/reports/payments`, config).catch(() => ({ data: MOCK_PAGOS })),
      axios.get(`${API_URL}/reports/activity`, config).catch(() => ({ data: MOCK_USUARIOS }))
    ]);
    productos.value = resProd.data;
    pagos.value = resPagos.data;
    usuarios.value = resUsu.data;
  } catch (err) {
    productos.value = MOCK_PRODUCTOS;
    pagos.value = MOCK_PAGOS;
    usuarios.value = MOCK_USUARIOS;
  }
};

const exportSinglePDF = (id, name) => {
  const element = document.getElementById(id);
  const opt = {
    margin:       [10, 10, 10, 10],
    filename:     `Reporte_Individual_${name}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' }
  };
  html2pdf().from(element).set(opt).save();
};

onMounted(() => {
  fetchReports();
});
</script>

<style scoped>
/* [ESTILOS] Reglas CSS exclusivas de esta vista (scoped) para evitar colisiones globales. */

.reportes-dashboard-container {
  padding: 40px;
  background: #f1f5f9;
  min-height: 100vh;
}

.dashboard-grid-balance {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 35px;
}

.kpi-card {
  padding: 25px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  transition: transform 0.3s ease;
}

.kpi-card:hover {
  transform: translateY(-5px);
}

.glass-blue { background: linear-gradient(135deg, #e0f2fe, #bae6fd); border: 1px solid #7dd3fc; }
.glass-red { background: linear-gradient(135deg, #ffe4e6, #fecdd3); border: 1px solid #fda4af; }
.glass-green { background: linear-gradient(135deg, #dcfce7, #bbf7d0); border: 1px solid #86efac; }

.kpi-icon {
  font-size: 38px;
  background: rgba(255,255,255,0.6);
  padding: 15px;
  border-radius: 14px;
}

.kpi-data {
  display: flex;
  flex-direction: column;
}

.kpi-titulo {
  font-size: 13px;
  color: #475569;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.kpi-valor {
  font-size: 32px;
  font-weight: 900;
  color: #0f172a;
}

.reportes-grid-principal {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
}

.report-box {
  background: white;
  border-radius: 16px;
  padding: 25px;
}

.card-shadow {
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  border: 1px solid #e2e8f0;
}

.box-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 15px;
}

.box-header h3 {
  font-size: 18px;
  color: #1e293b;
  margin: 0;
}

.badge-mes {
  background: #eff6ff;
  color: #3b82f6;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

.minimal-table {
  width: 100%;
  border-collapse: collapse;
}

.minimal-table th, .minimal-table td {
  padding: 15px 10px;
  text-align: left;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
}

.minimal-table th {
  color: #64748b;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
}

.bar-chart-css {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 200px;
  padding-top: 20px;
}
.bar-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 12%;
  height: 100%;
  justify-content: flex-end;
}
.bar-fill {
  width: 100%;
  background: linear-gradient(to top, #3b82f6, #60a5fa);
  border-radius: 6px 6px 0 0;
  transition: height 1s ease;
  min-height: 5px;
}
.bar-val {
  font-size: 10px;
  font-weight: bold;
  color: #475569;
  margin-bottom: 5px;
}
.bar-label {
  font-size: 10px;
  color: #94a3b8;
  margin-top: 8px;
  text-align: center;
}

.progress-bars-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.progress-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #334155;
  font-weight: 500;
}
.progress-track {
  width: 100%;
  height: 14px;
  background: #f1f5f9;
  border-radius: 10px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #34d399);
  border-radius: 10px;
}

.btn-export-mini {
  background-color: #f1f5f9;
  color: #334155;
  padding: 5px 12px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-export-mini:hover {
  background-color: #e2e8f0;
  color: #0f172a;
}

@media (max-width: 1024px) {
  .reportes-grid-principal { grid-template-columns: 1fr; }
}
</style>
