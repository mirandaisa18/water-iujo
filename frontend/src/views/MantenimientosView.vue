<template>
  <div class="app-layout">
    <Sidebar />

    <main class="main-content">
      <header class="page-header header-admin-left fade-in">
        <div class="title-container-left">
          <h2 class="title-admin-left">Mantenimiento de Equipos</h2>
          <p class="subtitle-admin-left">Control centralizado de reparaciones, repuestos y filtros.</p>
        </div>
        
        <div class="header-actions">
          <button v-if="esAdmin" class="btn-nuevo btn-mantenimiento-premium" @click="mostrarModal = true">
            + Registrar Mantenimiento
          </button>
        </div>
      </header>

      <div class="vista-admin-dashboard fade-in">
        
        <!-- KPIs Premium -->
        <div class="premium-kpi-grid">
          <div class="premium-kpi-card card-blue">
            <div class="kpi-icon-wrapper"><span class="kpi-icon">🛠️</span></div>
            <div class="kpi-info">
              <span class="kpi-label">Costo Histórico</span>
              <h3 class="kpi-value">${{ kpiCostoTotal.toFixed(2) }}</h3>
              <div class="kpi-trend neutral">
                <span>Inversión Total</span>
              </div>
            </div>
          </div>
          
          <div class="premium-kpi-card card-green">
            <div class="kpi-icon-wrapper"><span class="kpi-icon">✅</span></div>
            <div class="kpi-info">
              <span class="kpi-label">Equipos al Día</span>
              <h3 class="kpi-value">{{ kpiAlDia }}</h3>
              <div class="kpi-trend positive">
                <span>En estado óptimo</span>
              </div>
            </div>
          </div>

          <div class="premium-kpi-card card-orange">
            <div class="kpi-icon-wrapper"><span class="kpi-icon">⏳</span></div>
            <div class="kpi-info">
              <span class="kpi-label">Próximos a Vencer</span>
              <h3 class="kpi-value">{{ kpiProximos }}</h3>
              <div class="kpi-trend neutral" style="color: #ea580c;">
                <span>Atención en <= 7 días</span>
              </div>
            </div>
          </div>

          <div class="premium-kpi-card card-purple">
            <div class="kpi-icon-wrapper" style="background: rgba(239, 68, 68, 0.1); color: #ef4444;"><span class="kpi-icon">🚨</span></div>
            <div class="kpi-info">
              <span class="kpi-label">Mantenimientos Vencidos</span>
              <h3 class="kpi-value" :style="{color: kpiVencidos > 0 ? '#ef4444' : '#0f172a'}">{{ kpiVencidos }}</h3>
              <div class="kpi-trend" :class="kpiVencidos > 0 ? 'negative' : 'positive'">
                <span>Requieren acción inmediata</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabla Premium -->
        <div class="premium-table-card mt-20">
          <div class="card-header-flex">
            <h3 class="card-title-premium">Historial de Intervenciones Técnicas</h3>
          </div>
          
          <div class="table-responsive">
            <table class="tabla-moderna">
              <thead>
                <tr>
                  <th>FECHA SERVICIO</th>
                  <th>DESCRIPCIÓN DEL MANTENIMIENTO</th>
                  <th>REALIZADO POR</th>
                  <th>INVERSIÓN</th>
                  <th>FECHA PRÓXIMA</th>
                  <th>ESTADO ACTUAL</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="mant in mantenimientos" :key="mant.id" :class="{'fila-highlight-orange': esProximo(mant.fecha_proximo), 'fila-highlight-red': esVencido(mant.fecha_proximo)}">
                  <td>
                    <div class="fecha-cell">
                      <span class="icon-calendar">📅</span>
                      {{ formatearFecha(mant.fecha_cambio) }}
                    </div>
                  </td>
                  <td class="col-descripcion">{{ mant.tipo_mantenimiento }}</td>
                  <td>
                    <div class="tecnico-pill">
                      <span class="tecnico-avatar">{{ mant.realizado_por ? mant.realizado_por.charAt(0).toUpperCase() : 'N' }}</span>
                      <span class="tecnico-name">{{ mant.realizado_por || 'N/A' }}</span>
                    </div>
                  </td>
                  <td class="col-monto">${{ mant.costo.toFixed(2) }}</td>
                  <td>
                    <span class="badge-fecha-proxima" :class="getBadgeClass(mant.fecha_proximo)">
                      {{ formatearFecha(mant.fecha_proximo) }}
                    </span>
                  </td>
                  <td>
                    <div class="status-modern" :class="getStatusClass(mant.fecha_proximo)">
                      <span class="status-dot"></span>
                      {{ getStatusText(mant.fecha_proximo) }}
                    </div>
                  </td>
                </tr>
                <tr v-if="mantenimientos.length === 0">
                  <td colspan="6" class="empty-state-modern">
                    <span class="empty-icon">🔧</span>
                    <p>El historial de mantenimientos está vacío.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- MODAL REGISTRO PREMIUM -->
      <div v-if="mostrarModal" class="modal-glassmorphism fade-in">
        <div class="modal-content-premium slide-down">
          <div class="modal-header-gradient">
            <div class="header-icon-circle">🔧</div>
            <h3>Registrar Nuevo Mantenimiento</h3>
            <button class="btn-close-premium" @click="mostrarModal = false">✕</button>
          </div>
          
          <div class="modal-body-premium">
            <form @submit.prevent="guardarMantenimiento">
              
              <div class="form-group-premium">
                <label>Descripción / Tipo de Mantenimiento <span class="req">*</span></label>
                <div class="input-modern-wrapper">
                  <span class="input-icon">⚙️</span>
                  <input type="text" v-model="form.tipo_mantenimiento" placeholder="Ej: Reemplazo de filtros de carbón activado" required>
                </div>
              </div>

              <div class="form-row-premium">
                <div class="form-group-premium half">
                  <label>Costo de Inversión ($) <span class="req">*</span></label>
                  <div class="input-modern-wrapper">
                    <span class="input-icon">💵</span>
                    <input type="number" v-model.number="form.costo" step="0.01" min="0" placeholder="0.00" required>
                  </div>
                </div>
                <div class="form-group-premium half">
                  <label>Empresa / Técnico</label>
                  <div class="input-modern-wrapper">
                    <span class="input-icon">👷</span>
                    <input type="text" v-model="form.realizado_por" placeholder="Nombre del técnico">
                  </div>
                </div>
              </div>

              <div class="form-group-premium">
                <label>Próxima Intervención (Vencimiento) <span class="req">*</span></label>
                <div class="input-modern-wrapper">
                  <span class="input-icon">📆</span>
                  <input type="date" v-model="form.fecha_proximo" required class="date-input">
                </div>
                <small class="help-text">El sistema te alertará automáticamente 7 días antes de esta fecha.</small>
              </div>

              <div class="form-group-premium">
                <label>Observaciones Adicionales</label>
                <div class="input-modern-wrapper">
                  <span class="input-icon" style="align-self: flex-start; margin-top: 12px;">📝</span>
                  <textarea v-model="form.observaciones" rows="3" placeholder="Detalles de piezas reemplazadas o anomalías..."></textarea>
                </div>
              </div>

              <div class="modal-footer-premium">
                <button type="button" class="btn-cancel-glass" @click="mostrarModal = false">Cancelar</button>
                <button type="submit" class="btn-save-gradient" :disabled="guardando">
                  <span v-if="!guardando">Confirmar Registro</span>
                  <span v-else class="loading-spinner"></span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue';
import { ref, computed, onMounted } from 'vue';
import { useSistemaStore } from '../stores/sistema';
import { useRouter } from 'vue-router';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const store = useSistemaStore();
const router = useRouter();

const esAdmin = computed(() => store.rolUsuario === 'admin');

const mantenimientos = ref([]);
const mostrarModal = ref(false);
const guardando = ref(false);

const form = ref({
  tipo_mantenimiento: '',
  costo: null,
  fecha_proximo: '',
  observaciones: '',
  realizado_por: ''
});

onMounted(() => {
  if (!esAdmin.value) {
    router.push('/login');
    return;
  }
  cargarMantenimientos();
});

const getAxiosConfig = () => ({
  headers: { 'x-user-role': store.rolUsuario }
});

const cargarMantenimientos = async () => {
  try {
    const res = await axios.get(`${API_URL}/mantenimientos`, getAxiosConfig());
    mantenimientos.value = res.data;
  } catch (error) {
    console.error('Error cargando mantenimientos', error);
  }
};

const guardarMantenimiento = async () => {
  guardando.value = true;
  try {
    const payload = { ...form.value, costo: parseFloat(form.value.costo) || 0 };
    const res = await axios.post(`${API_URL}/mantenimientos/registrar`, payload, getAxiosConfig());
    if (res.data.success) {
      mostrarModal.value = false;
      form.value = { tipo_mantenimiento: '', costo: null, fecha_proximo: '', observaciones: '', realizado_por: '' };
      await cargarMantenimientos();
      store.fetchAlertas(); // Refrescar alertas globales
    }
  } catch (error) {
    alert(error.response?.data?.error || 'Error al registrar mantenimiento');
  } finally {
    guardando.value = false;
  }
};

// -- KPIs Computados --
const kpiCostoTotal = computed(() => mantenimientos.value.reduce((acc, m) => acc + (m.costo || 0), 0));
const kpiVencidos = computed(() => mantenimientos.value.filter(m => esVencido(m.fecha_proximo)).length);
const kpiProximos = computed(() => mantenimientos.value.filter(m => esProximo(m.fecha_proximo)).length);
const kpiAlDia = computed(() => mantenimientos.value.filter(m => !esVencido(m.fecha_proximo) && !esProximo(m.fecha_proximo)).length);

// -- Lógica de Fechas e Indicadores --
const formatearFecha = (fechaISO) => {
  if (!fechaISO) return '';
  return new Date(fechaISO).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
};

const getDiffDays = (fechaISO) => {
  const hoy = new Date();
  hoy.setHours(0,0,0,0);
  const proximo = new Date(fechaISO);
  proximo.setHours(0,0,0,0);
  const diffTime = proximo - hoy;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const esProximo = (fechaISO) => {
  const diffDays = getDiffDays(fechaISO);
  return diffDays >= 0 && diffDays <= 7;
};

const esVencido = (fechaISO) => {
  return getDiffDays(fechaISO) < 0;
};

const getStatusText = (fechaISO) => {
  if (esVencido(fechaISO)) return 'Vencido';
  if (esProximo(fechaISO)) return 'Pronto';
  return 'Al día';
};

const getStatusClass = (fechaISO) => {
  if (esVencido(fechaISO)) return 'status-danger';
  if (esProximo(fechaISO)) return 'status-warning';
  return 'status-success';
};

const getBadgeClass = (fechaISO) => {
  if (esVencido(fechaISO)) return 'badge-danger';
  if (esProximo(fechaISO)) return 'badge-warning';
  return 'badge-normal';
};
</script>

<style scoped>
/* --- BASE LAYOUT --- */
.main-content {
  flex: 1;
  padding: 20px 45px;
  background: #f8fafc;
  overflow-y: auto;
}

.mt-20 { margin-top: 20px; }

/* --- HEADER --- */
.page-header { display: flex; justify-content: space-between; align-items: center; border-bottom: none; margin-bottom: 30px; padding: 0; }
.title-container-left h2 { font-size: 28px; color: #1e293b; font-weight: 800; margin: 0; letter-spacing: -0.5px; }
.title-container-left .subtitle-admin-left { color: #64748b; font-size: 14px; margin-top: 5px; font-weight: 500; }

/* Botón Premium Header */
.btn-mantenimiento-premium {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white; border: none; padding: 12px 28px; border-radius: 12px; font-weight: 700;
  cursor: pointer; font-size: 14px; transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
}
.btn-mantenimiento-premium:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(37, 99, 235, 0.4);
}

/* --- KPI GRID PREMIUM --- */
.premium-kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; }
.premium-kpi-card { background: white; padding: 25px; border-radius: 20px; display: flex; align-items: flex-start; gap: 20px; border: 1px solid rgba(226, 232, 240, 0.8); box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05); transition: transform 0.3s ease, box-shadow 0.3s ease; position: relative; overflow: hidden; }
.premium-kpi-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px -5px rgba(0, 0, 0, 0.08); }
.premium-kpi-card::before { content: ''; position: absolute; top: 0; left: 0; width: 6px; height: 100%; border-radius: 20px 0 0 20px; }

.card-blue::before { background: linear-gradient(to bottom, #3b82f6, #60a5fa); }
.card-green::before { background: linear-gradient(to bottom, #10b981, #34d399); }
.card-orange::before { background: linear-gradient(to bottom, #f59e0b, #fbbf24); }
.card-purple::before { background: linear-gradient(to bottom, #ef4444, #f87171); }

.kpi-icon-wrapper { width: 56px; height: 56px; border-radius: 16px; display: flex; justify-content: center; align-items: center; font-size: 24px; flex-shrink: 0; }
.card-blue .kpi-icon-wrapper { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
.card-green .kpi-icon-wrapper { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.card-orange .kpi-icon-wrapper { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }

.kpi-info { display: flex; flex-direction: column; gap: 6px; }
.kpi-label { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
.kpi-value { font-size: 28px; font-weight: 800; color: #0f172a; margin: 0; line-height: 1; letter-spacing: -0.5px; }
.kpi-trend { font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 4px; }
.kpi-trend.negative { color: #ef4444; }
.kpi-trend.positive { color: #10b981; }
.kpi-trend.neutral { color: #8b5cf6; }

/* --- TABLA PREMIUM --- */
.premium-table-card { background: white; padding: 30px; border-radius: 20px; border: 1px solid rgba(226, 232, 240, 0.8); box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05); }
.card-title-premium { font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 20px 0; }

.table-responsive { overflow-x: auto; }
.tabla-moderna { width: 100%; border-collapse: collapse; }
.tabla-moderna th { text-align: left; font-size: 11px; font-weight: 700; color: #94a3b8; padding: 15px 10px; border-bottom: 2px solid #f1f5f9; text-transform: uppercase; letter-spacing: 1px; }
.tabla-moderna td { padding: 18px 10px; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 500; color: #334155; vertical-align: middle; transition: background 0.2s; }
.tabla-moderna tbody tr:hover { background-color: #f8fafc; }

/* Celdas especiales de la tabla */
.fecha-cell { display: flex; align-items: center; gap: 8px; font-weight: 600; color: #475569; }
.icon-calendar { font-size: 16px; opacity: 0.7; }

.col-descripcion { font-weight: 700; color: #1e293b; max-width: 250px; }
.col-monto { font-weight: 800; color: #10b981; }

.tecnico-pill { display: flex; align-items: center; gap: 10px; }
.tecnico-avatar { width: 32px; height: 32px; border-radius: 50%; background: #e0e7ff; color: #4f46e5; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; }
.tecnico-name { font-weight: 600; color: #475569; }

/* Status Moderno */
.status-modern { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; }
.status-dot { width: 8px; height: 8px; border-radius: 50%; }

.status-success { background: #d1fae5; color: #059669; }
.status-success .status-dot { background: #059669; }

.status-warning { background: #fef3c7; color: #d97706; }
.status-warning .status-dot { background: #d97706; }

.status-danger { background: #fee2e2; color: #dc2626; }
.status-danger .status-dot { background: #dc2626; }

/* Badges de Fecha Proxima */
.badge-fecha-proxima { padding: 4px 10px; border-radius: 6px; font-size: 13px; font-weight: 700; border: 1px solid transparent; }
.badge-normal { background: #f1f5f9; color: #475569; }
.badge-warning { background: #fffbeb; color: #b45309; border-color: #fde68a; }
.badge-danger { background: #fef2f2; color: #b91c1c; border-color: #fecaca; }

/* Filas con Higlight */
.fila-highlight-orange td { background: linear-gradient(90deg, rgba(254, 240, 138, 0.15) 0%, transparent 100%); }
.fila-highlight-red td { background: linear-gradient(90deg, rgba(254, 226, 226, 0.3) 0%, transparent 100%); }

/* Empty State */
.empty-state-modern { text-align: center; padding: 50px 0 !important; color: #94a3b8; }
.empty-icon { font-size: 40px; display: block; margin-bottom: 10px; opacity: 0.5; }

/* --- MODAL GLASSMORPHISM --- */
.modal-glassmorphism { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-content-premium { background: white; width: 100%; max-width: 550px; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }

.modal-header-gradient { background: linear-gradient(135deg, #1e293b, #0f172a); padding: 25px 30px; display: flex; align-items: center; gap: 15px; position: relative; }
.header-icon-circle { width: 45px; height: 45px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 22px; }
.modal-header-gradient h3 { margin: 0; color: white; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; }
.btn-close-premium { position: absolute; right: 25px; top: 35px; background: rgba(255,255,255,0.1); border: none; width: 30px; height: 30px; border-radius: 50%; color: white; display: flex; justify-content: center; align-items: center; cursor: pointer; transition: 0.3s; }
.btn-close-premium:hover { background: rgba(255,255,255,0.25); transform: rotate(90deg); }

.modal-body-premium { padding: 30px; }
.form-row-premium { display: flex; gap: 20px; }
.form-group-premium { margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px; }
.form-group-premium.half { flex: 1; }
.form-group-premium label { font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }
.req { color: #ef4444; }

.input-modern-wrapper { display: flex; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; transition: 0.3s; }
.input-modern-wrapper:focus-within { border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); background: white; }
.input-icon { padding: 12px 0 12px 15px; color: #94a3b8; font-size: 16px; }
.input-modern-wrapper input, .input-modern-wrapper textarea { border: none; background: transparent; padding: 12px 15px; flex: 1; outline: none; font-size: 14px; color: #1e293b; font-weight: 500; width: 100%; }
.input-modern-wrapper textarea { resize: vertical; min-height: 80px; }
.date-input { font-family: inherit; }

.help-text { font-size: 11px; color: #64748b; margin-top: -5px; }

.modal-footer-premium { display: flex; justify-content: flex-end; gap: 15px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #f1f5f9; }
.btn-cancel-glass { background: #f1f5f9; color: #475569; border: none; padding: 12px 25px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.3s; }
.btn-cancel-glass:hover { background: #e2e8f0; }

.btn-save-gradient { background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; padding: 12px 30px; border-radius: 12px; font-weight: 700; cursor: pointer; box-shadow: 0 8px 15px rgba(16, 185, 129, 0.2); transition: 0.3s; min-width: 150px; display: flex; justify-content: center; align-items: center; }
.btn-save-gradient:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 20px rgba(16, 185, 129, 0.3); }
.btn-save-gradient:disabled { opacity: 0.7; cursor: not-allowed; }

.loading-spinner { width: 18px; height: 18px; border: 3px solid rgba(255,255,255,0.3); border-top: 3px solid white; border-radius: 50%; animation: spin 1s linear infinite; }

/* ANIMACIONES */
.fade-in { animation: fadeIn 0.4s ease forwards; }
.slide-down { animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideDown { from { opacity: 0; transform: translateY(-20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

/* Responsive */
@media (max-width: 768px) {
  .premium-kpi-grid { grid-template-columns: 1fr; }
  .form-row-premium { flex-direction: column; gap: 0; }
  .modal-content-premium { width: 95%; }
}
</style>
