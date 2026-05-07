<!-- VISTA: Control de Gastos | Propósito: Registro y visualización de egresos operativos (Electricidad, Agua, Internet, etc.) para la contabilidad. -->
<template>
  <div class="app-layout">
    
    <Sidebar />

    <main class="main-content">
      
      <header class="page-header header-admin-left">
        <div class="title-container-left">
          <h2 class="title-admin-left">Control de Gastos y Egresos</h2>
          <p class="subtitle-admin-left">Gestiona los pagos operativos, compras y servicios del negocio.</p>
        </div>
        
        <div class="header-actions">
          <button class="btn-nuevo" @click="mostrarFormulario = !mostrarFormulario">
            {{ mostrarFormulario ? '✖ Cancelar' : '+ Registrar Gasto' }}
          </button>
          
          <div class="perfil-usuario-top" @click="router.push('/configuracion')">
            <div class="info-texto-top">
              <span class="nombre-top">{{ nombreRol }}</span>
              <span class="email-top">{{ emailUsuario }}</span>
            </div>
            <div class="avatar-top">👤</div>
          </div>
        </div>
      </header>

      <div class="vista-admin-dashboard">
        <!-- KPIs Premium de Gastos -->
        <div class="premium-kpi-grid">
          <div class="premium-kpi-card card-orange">
            <div class="kpi-icon-wrapper"><span class="kpi-icon">💸</span></div>
            <div class="kpi-info">
              <span class="kpi-label">Gastos del Mes</span>
              <h3 class="kpi-value">${{ kpiTotalMes.toFixed(2) }}</h3>
              <div class="kpi-trend neutral">
                <span>Acumulado de este mes</span>
              </div>
            </div>
          </div>
          
          <div class="premium-kpi-card card-purple">
            <div class="kpi-icon-wrapper"><span class="kpi-icon">📦</span></div>
            <div class="kpi-info">
              <span class="kpi-label">Compra de Insumos</span>
              <h3 class="kpi-value">${{ kpiInsumos.toFixed(2) }}</h3>
              <div class="kpi-trend neutral">
                <span>Tapas, filtros, etc.</span>
              </div>
            </div>
          </div>

          <div class="premium-kpi-card card-blue">
            <div class="kpi-icon-wrapper"><span class="kpi-icon">🔧</span></div>
            <div class="kpi-info">
              <span class="kpi-label">Mantenimiento</span>
              <h3 class="kpi-value">${{ kpiMantenimiento.toFixed(2) }}</h3>
              <div class="kpi-trend neutral">
                <span>Operatividad</span>
              </div>
            </div>
          </div>

          <div class="premium-kpi-card card-green">
            <div class="kpi-icon-wrapper"><span class="kpi-icon">🏢</span></div>
            <div class="kpi-info">
              <span class="kpi-label">Servicios Fijos</span>
              <h3 class="kpi-value">${{ kpiServicios.toFixed(2) }}</h3>
              <div class="kpi-trend neutral">
                <span>Luz, alquiler, otros</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="mostrarFormulario" class="tarjeta-formulario">
        <h3>Registrar Nuevo Egreso</h3>
        <p>Introduce los detalles de la factura o comprobante de pago.</p>
        
        <form @submit.prevent="guardarGastoReal" class="form-grid">
          <div class="input-group">
            <label>Descripción / Concepto</label>
            <input type="text" v-model="nuevoGasto.concepto" placeholder="Ej. Recibo de luz eléctrica" required />
          </div>
          <div class="input-group">
            <label>Categoría</label>
            <select v-model="nuevoGasto.categoria" required>
              <option value="" disabled selected>Selecciona una categoría...</option>
              <option value="insumos">Compra de Insumos</option>
              <option value="mantenimiento">Mantenimiento de Equipos</option>
              <option value="servicios">Servicios Básicos y Alquiler</option>
              <option value="nomina">Nómina / Pago a Empleados</option>
              <option value="otros">Otros Gastos</option>
            </select>
          </div>
          <div class="input-group">
            <label>Monto Total ($)</label>
            <input type="number" v-model.number="nuevoGasto.monto" step="0.01" placeholder="0.00" min="0.01" required />
          </div>
          <div class="input-group">
            <label>Método de Pago</label>
            <select v-model="nuevoGasto.metodo" required>
              <option value="efectivo">Efectivo de Caja</option>
              <option value="transferencia">Transferencia Bancaria</option>
              <option value="zelle">Zelle</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-guardar">Guardar Gasto</button>
          </div>
        </form>
      </div>

        <div class="premium-table-card">
          <div class="card-header-flex">
            <h3 class="card-title-premium">Historial de Egresos</h3>
            <div class="search-box">
              <input type="text" v-model="filtroGasto" placeholder="Buscar por concepto..." />
            </div>
          </div>
        
        <div class="table-responsive">
          <table class="tabla-gastos">
            <thead>
              <tr>
                <th>FECHA</th>
                <th>CONCEPTO</th>
                <th>CATEGORÍA</th>
                <th>MÉTODO</th>
                <th>MONTO</th>
                <th>COMPROBANTE</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="gasto in gastosFiltrados" :key="gasto.id">
                <td>{{ gasto.fechaSolo || gasto.fecha?.substring(0,10) }}</td>
                <td class="negrita">{{ gasto.concepto }}</td>
                <td><span class="badge" :class="colorCategoria(gasto.categoria)">{{ tituloCategoria(gasto.categoria) }}</span></td>
                <td style="text-transform: capitalize;">{{ gasto.metodo }}</td>
                <td class="monto-gasto">${{ (gasto.monto || 0).toFixed(2) }}</td>
                <td class="acciones-col" @click="verComprobante(gasto)">📄 Ver</td>
              </tr>
              <tr v-if="gastosFiltrados.length === 0">
                <td colspan="6" style="text-align: center; color: #94a3b8; font-style: italic; padding: 40px;">Todavía no hay egresos registrados.</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" class="texto-derecha negrita">TOTAL MOSTRADO:</td>
                <td class="monto-total">${{ totalGastosFiltrados.toFixed(2) }}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue';
import { useSistemaStore } from '../stores/sistema';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const store = useSistemaStore();
const router = useRouter();
const mostrarFormulario = ref(false);
const nuevoGasto = ref({ concepto: '', categoria: '', monto: null, metodo: 'efectivo' });

const esAdmin = computed(() => store.rolUsuario === 'admin');
const nombreRol = computed(() => {
  if (store.rolUsuario === 'admin') return 'Administrador';
  if (store.rolUsuario === 'cajero') return 'Cajero';
  if (store.rolUsuario === 'delivery') return 'Repartidor';
  if (store.rolUsuario === 'cliente') return store.perfilUsuario?.nombre || 'Cliente';
  return 'Usuario';
});

const emailUsuario = computed(() => store.perfilUsuario?.email || 'admin@iujo.com');

onMounted(() => {
  if (esAdmin.value) {
    store.fetchGastos();
  }
});

const guardarGastoReal = async () => {
  if (!nuevoGasto.value.concepto || !nuevoGasto.value.categoria || !nuevoGasto.value.monto) return;
  
  const gasto = {
    concepto: nuevoGasto.value.concepto,
    categoria: nuevoGasto.value.categoria,
    monto: parseFloat(nuevoGasto.value.monto),
    metodo: nuevoGasto.value.metodo
  };
  
  await store.registrarGastoGlobal(gasto);
  mostrarFormulario.value = false;
  nuevoGasto.value = { concepto: '', categoria: '', monto: null, metodo: 'efectivo' };
  alert('Gasto registrado y persistido en el servidor.');
};

// Lógica de KPIs y Tabla
const curMonth = new Date().toISOString().substring(0, 7);
const gastosDelMes = computed(() => store.gastos.filter(g => (g.fecha || '').startsWith(curMonth)));

const kpiTotalMes = computed(() => gastosDelMes.value.reduce((s, g) => s + (g.monto || 0), 0));
const kpiInsumos = computed(() => gastosDelMes.value.filter(g=>g.categoria==='insumos').reduce((s,g)=>s+(g.monto || 0),0));
const kpiMantenimiento = computed(() => gastosDelMes.value.filter(g=>g.categoria==='mantenimiento').reduce((s,g)=>s+(g.monto || 0),0));
const kpiServicios = computed(() => gastosDelMes.value.filter(g=>g.categoria==='servicios').reduce((s,g)=>s+(g.monto || 0),0));

const filtroGasto = ref('');
const gastosFiltrados = computed(() => {
  const f = filtroGasto.value.toLowerCase().trim();
  if(!f) return store.gastos;
  return store.gastos.filter(g => (g.concepto || '').toLowerCase().includes(f) || (g.categoria || '').toLowerCase().includes(f));
});
const totalGastosFiltrados = computed(() => gastosFiltrados.value.reduce((s,g) => s+(g.monto || 0), 0));

const colorCategoria = (cat) => {
  const m = { insumos: 'naranja', mantenimiento: 'azul', servicios: 'morado', nomina: 'naranja', otros: 'naranja' };
  return m[cat] || 'azul';
};
const tituloCategoria = (cat) => {
  const m = { insumos: 'Insumos', mantenimiento: 'Mantenimiento', servicios: 'Servicios Fijos', nomina: 'Nómina', otros: 'Otro Gasto' };
  return m[cat] || cat;
};

const verComprobante = (gasto) => {
  const fechaStr = gasto.fechaSolo || (gasto.fecha ? gasto.fecha.substring(0,10) : 'N/A');
  alert(`C O M P R O B A N T E   D E   E G R E S O\n--------------------------------------------\nConcepto: ${gasto.concepto}\nCategoría: ${tituloCategoria(gasto.categoria)}\nMétodo de Pago: ${gasto.metodo.toUpperCase()}\nFecha del Sistema: ${fechaStr}\n--------------------------------------------\nTOTAL ABONADO:\n$${(gasto.monto || 0).toFixed(2)}\n\n* Autorizado y Registrado por Admin.`);
};
</script>

<style scoped>
/* [ESTILOS] Reglas CSS exclusivas de esta vista (scoped) para evitar colisiones globales. */
/* --- Estilo Base Content --- */
.main-content {
  flex: 1;
  padding: 20px 45px;
  background: #f8fafc;
  overflow-y: auto;
}

/* --- Estilos Estándar del Perfil (IDÉNTICOS A VENTAS) --- */
.page-header { display: flex; justify-content: space-between; align-items: center; border-bottom: none; margin-bottom: 30px; padding: 0; }
.header-admin-left { margin-bottom: 35px; }
.title-container-left h2 { font-size: 28px; color: #1e293b; font-weight: 800; margin: 0; letter-spacing: -0.5px; }
.title-container-left .subtitle-admin-left { color: #64748b; font-size: 14px; margin-top: 5px; font-weight: 500; }

.perfil-usuario-top { display: flex; align-items: center; gap: 12px; background: white; padding: 12px 20px; border-radius: 20px; box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05); border: 1px solid rgba(226, 232, 240, 0.8); transition: transform 0.3s ease; cursor: pointer; }
.perfil-usuario-top:hover { transform: translateY(-2px); box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.08); }
.info-texto-top { display: flex; flex-direction: column; text-align: right; }
.nombre-top { font-size: 15px; font-weight: 800; color: #1e293b; line-height: 1; text-transform: capitalize; }
.email-top { font-size: 11px; font-weight: 500; color: #64748b; margin-top: 2px; }
.avatar-top { width: 40px; height: 40px; background: #e3f2fd; color: #2196F3; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 18px; border: 1px solid #2196F3; }

.btn-nuevo { background: #ef4444; color: white; border: none; padding: 10px 25px; border-radius: 10px; font-weight: 700; cursor: pointer; font-size: 14px; transition: 0.3s; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2); }
.btn-nuevo:hover { background: #dc2626; transform: translateY(-2px); box-shadow: 0 6px 15px rgba(239, 68, 68, 0.3); }

/* Estilos Premium Layout */
.vista-admin-dashboard { display: flex; flex-direction: column; gap: 30px; }
.premium-kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; }
.premium-kpi-card { background: white; padding: 25px; border-radius: 20px; display: flex; align-items: flex-start; gap: 20px; border: 1px solid rgba(226, 232, 240, 0.8); box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05); transition: transform 0.3s ease, box-shadow 0.3s ease; position: relative; overflow: hidden; }
.premium-kpi-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px -5px rgba(0, 0, 0, 0.08); }
.premium-kpi-card::before { content: ''; position: absolute; top: 0; left: 0; width: 6px; height: 100%; border-radius: 20px 0 0 20px; }

.card-blue::before { background: linear-gradient(to bottom, #3b82f6, #60a5fa); }
.card-purple::before { background: linear-gradient(to bottom, #8b5cf6, #a78bfa); }
.card-orange::before { background: linear-gradient(to bottom, #f59e0b, #fbbf24); }
.card-green::before { background: linear-gradient(to bottom, #10b981, #34d399); }

.kpi-icon-wrapper { width: 56px; height: 56px; border-radius: 16px; display: flex; justify-content: center; align-items: center; font-size: 24px; flex-shrink: 0; }
.card-blue .kpi-icon-wrapper { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
.card-purple .kpi-icon-wrapper { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }
.card-orange .kpi-icon-wrapper { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
.card-green .kpi-icon-wrapper { background: rgba(16, 185, 129, 0.1); color: #10b981; }

.kpi-info { display: flex; flex-direction: column; gap: 8px; }
.kpi-label { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
.kpi-value { font-size: 28px; font-weight: 800; color: #0f172a; margin: 0; line-height: 1; letter-spacing: -0.5px; }
.kpi-trend { font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 4px; }
.kpi-trend.negative { color: #ef4444; }
.kpi-trend.positive { color: #10b981; }
.kpi-trend.neutral { color: #8b5cf6; }

/* FORMULARIO PREMIUM */
.tarjeta-formulario { background: white; border: 1px solid rgba(226, 232, 240, 0.8); border-radius: 16px; padding: 25px 30px; margin-bottom: 20px; box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05); border-top: 4px solid #ef4444; }
.tarjeta-formulario h3 { font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 5px; }
.tarjeta-formulario p { font-size: 13px; color: #64748b; margin-bottom: 20px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.input-group { display: flex; flex-direction: column; gap: 8px; }
.input-group label { font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }
.input-group input, .input-group select { padding: 12px 15px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; outline: none; transition: 0.2s; background: #f8fafc; color: #1e293b; font-weight: 500; }
.input-group input:focus, .input-group select:focus { border-color: #ef4444; background: white; box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1); }
.form-actions { grid-column: 1 / -1; display: flex; justify-content: flex-end; margin-top: 10px; }
.btn-guardar { background: #ef4444; color: white; border: none; padding: 12px 30px; border-radius: 8px; font-weight: 700; cursor: pointer; transition: 0.2s; }
.btn-guardar:hover { background: #dc2626; transform: translateY(-1px); }

/* TABLAS PREMIUM */
.premium-table-card { background: white; padding: 30px; border-radius: 20px; border: 1px solid rgba(226, 232, 240, 0.8); box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05); display: flex; flex-direction: column; }
.card-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
.card-title-premium { font-size: 18px; font-weight: 800; color: #0f172a; margin: 0; }

.search-box { display: flex; align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 8px 15px; }
.search-box input { border: none; background: transparent; outline: none; font-size: 14px; color: #1e293b; width: 220px; font-weight: 500; }
.search-box input::placeholder { color: #94a3b8; }

.table-responsive { overflow-x: auto; }
.tabla-gastos { width: 100%; border-collapse: collapse; }
.tabla-gastos th { text-align: left; font-size: 11px; font-weight: 700; color: #94a3b8; padding: 12px 0; border-bottom: 2px solid #f1f5f9; text-transform: uppercase; letter-spacing: 1px; }
.tabla-gastos td { padding: 18px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 600; color: #1e293b; }

.negrita { font-weight: 700; color: #1e293b; }
.monto-gasto { font-weight: 800; color: #ef4444; font-size: 15px; }
.acciones-col { cursor: pointer; color: #3b82f6; font-weight: 700; }
.acciones-col:hover { text-decoration: underline; }

.badge { padding: 6px 12px; border-radius: 20px; font-size: 10px; font-weight: 800; letter-spacing: 0.5px; border: 1px solid transparent; }
.badge.naranja { background: #ffedd5; color: #ea580c; border-color: rgba(234, 88, 12, 0.1); }
.badge.morado { background: #f3e8ff; color: #7e22ce; border-color: rgba(126, 34, 206, 0.1); }
.badge.azul { background: #e0f2fe; color: #0284c7; border-color: rgba(2, 132, 199, 0.1); }

.tabla-gastos tfoot td { padding-top: 25px; border-bottom: none; }
.monto-total { font-weight: 900; color: #ef4444; font-size: 20px !important; }

/* RESPONSIVE */
@media (max-width: 768px) {
  .app-layout { flex-direction: column; }
  .main-content { padding: 20px; }
  .page-header { flex-direction: column; align-items: flex-start; gap: 20px; }
  .header-actions { width: 100%; justify-content: space-between; flex-direction: row-reverse; align-items: center; }
  .perfil-usuario-top { padding: 10px 15px; margin-top: 0; }
  .info-texto-top { text-align: left; }
  .premium-kpi-grid { grid-template-columns: 1fr; }
  .form-grid { grid-template-columns: 1fr; }
  .premium-table-card { padding: 20px; }
}
</style>