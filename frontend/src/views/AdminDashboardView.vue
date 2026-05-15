<!-- VISTA: Dashboard Administrativo | Propósito: Mostrar métricas principales, ventas del periodo, estado del inventario y gráficos de desempeño. -->
<template>
  <div class="app-layout">
    
    <Sidebar />

    <main class="dashboard-contenedor">
      <header class="page-header header-admin-left">
        <div class="title-container-left">
          <h2 class="title-admin-left">Dashboard WATER IUJO</h2>
          <p class="subtitle-admin-left">Has iniciado sesión como: <strong>{{ nombreRol }}</strong></p>
        </div>
        <div class="perfil-usuario-top" @click="router.push('/configuracion')">
          <div class="info-texto-top">
            <span class="nombre-top">{{ nombreRol }}</span>
            <span class="email-top">{{ emailUsuario }}</span>
          </div>
          <div class="avatar-top">👤</div>
        </div>
      </header>

      <AlertasComponent />

      <div class="vista-admin-dashboard">
        
        <!-- KPIs Premium -->
        <div class="premium-kpi-grid">
          <div class="premium-kpi-card card-blue">
            <div class="kpi-icon-wrapper"><span class="kpi-icon">💰</span></div>
            <div class="kpi-info">
              <span class="kpi-label">Ventas Periodo</span>
              <h3 class="kpi-value">${{ totalVentasPeriodo.toFixed(2) }}</h3>
              <div class="kpi-trend positive">
                <span class="trend-icon">↗</span>
                <span>{{ ticketsFiltrados.length }} facturas</span>
              </div>
            </div>
          </div>
          
          <div class="premium-kpi-card card-purple">
            <div class="kpi-icon-wrapper"><span class="kpi-icon">💧</span></div>
            <div class="kpi-info">
              <span class="kpi-label">Lts Despachados</span>
              <h3 class="kpi-value">{{ isNaN(totalLitros) ? 0 : totalLitros.toLocaleString() }}L</h3>
              <div class="kpi-trend neutral">
                <span class="trend-icon">→</span>
                <span>Operatividad óptima</span>
              </div>
            </div>
          </div>

          <div class="premium-kpi-card card-orange">
            <div class="kpi-icon-wrapper"><span class="kpi-icon">👥</span></div>
            <div class="kpi-info">
              <span class="kpi-label">Clientes Atendidos</span>
              <h3 class="kpi-value">{{ totalClientes }}</h3>
              <div class="kpi-trend positive">
                <span class="trend-icon">↗</span>
                <span>Base de datos activa</span>
              </div>
            </div>
          </div>

          <div class="premium-kpi-card card-green">
            <div class="kpi-icon-wrapper"><span class="kpi-icon">🚚</span></div>
            <div class="kpi-info">
              <span class="kpi-label">Cantidad de Delivery</span>
              <h3 class="kpi-value">{{ totalDeliveries }}</h3>
              <div class="kpi-trend positive">
                <span class="trend-icon">↗</span>
                <span>Servicios del periodo</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Widget Tasa del Dólar en Tiempo Real (ve.dolarapi.com) -->
        <div class="dolar-widget-container">
          <div class="dolar-widget-header">
            <div class="dolar-title-group">
              <span class="dolar-badge-live" :class="{ pulsing: !tasaCargando }">● EN VIVO</span>
              <h3 class="dolar-titulo">Tasas del Dólar en Venezuela</h3>
              <p class="dolar-subtitulo">Actualización automática cada 5 minutos</p>
            </div>
            <div class="dolar-actualiza">
              <span v-if="tasaCargando" class="dolar-spin">⏳ Cargando...</span>
              <span v-else class="dolar-hora">Última actualización: {{ tasaHoraActualizacion }}</span>
              <button class="btn-refresh-tasa" @click="fetchTasas" :disabled="tasaCargando" title="Actualizar manualmente">
                <span :style="{ display: 'inline-block', transition: 'transform 0.5s', transform: tasaCargando ? 'rotate(360deg)' : 'rotate(0deg)' }">↻</span>
              </button>
            </div>
          </div>

          <div v-if="tasaError" class="dolar-error">
            ⚠️ No se pudo conectar a la API de tasas. Verifica tu conexión a internet.
          </div>

          <div v-else class="dolar-cards-grid">
            <div
              v-for="tasa in tasas"
              :key="tasa.nombre"
              class="dolar-card"
              :class="tasa.claseCard"
            >
              <div class="dolar-card-top">
                <span class="dolar-fuente-badge">{{ tasa.fuente }}</span>
                <span class="dolar-nombre">{{ tasa.nombre }}</span>
              </div>
              <div class="dolar-precio-main">
                <span class="dolar-simbolo">Bs.</span>
                <span class="dolar-valor" :class="{ 'skeleton-load': tasaCargando }">{{ tasaCargando ? '...' : tasa.precio }}</span>
              </div>
              <div class="dolar-footer-card">
                <span class="dolar-equivalencia">1 USD = {{ tasaCargando ? '...' : tasa.precio }} Bs</span>
                <span class="dolar-actualiza-card" v-if="tasa.actualizado && !tasaCargando">
                  Actualizado: {{ tasa.actualizado }}
                </span>
              </div>
            </div>

            <div v-if="tasas.length === 0 && !tasaCargando" class="dolar-sin-datos">
              No hay datos disponibles en este momento.
            </div>
          </div>
        </div>

        <div class="premium-dashboard-row">
          <!-- Gráfico de Litros -->
          <div class="premium-chart-card">
            <div class="card-header-flex">
              <div class="card-title-group">
                <h3 class="card-title-premium" style="font-size: 20px;">Litros despachados WATER IUJO</h3>
                <div class="date-navigation">
                  <button class="nav-arrow" @click="cambiarSemana(-1)">‹</button>
                  <span class="subtitle-admin date-text-large">{{ textoRangoSemana }}</span>
                  <button class="nav-arrow" @click="cambiarSemana(1)">›</button>
                </div>
              </div>
              <button class="btn-more-options">⋮</button>
            </div>
            <div class="chart-wrapper">
              <div class="barras-simuladas">
                <div v-for="(h, i) in barrasAlturas" :key="i" class="barra" :style="{ height: (h || 0) + '%' }">
                  <span v-if="litrosPorDia[i] > 0" class="barra-label-interna">{{ litrosPorDia[i] }}L</span>
                </div>
              </div>
              <div class="dias-semana"><span>LUN</span><span>MAR</span><span>MIE</span><span>JUE</span><span>VIE</span><span>SAB</span><span>DOM</span></div>
            </div>
          </div>

          <!-- Distribución -->
          <div class="premium-table-card">
            <div class="card-header-flex">
              <h3 class="card-title-premium">Distribución de Ventas</h3>
              <button class="btn-more-options">⋮</button>
            </div>
            <div class="circulo-container">
              <div class="circulo-simulado" :style="{ background: `conic-gradient(#10b981 0% ${distribucion.recarga}%, #3b82f6 ${distribucion.recarga}% ${distribucion.recarga + distribucion.botellon}%, #f59e0b ${distribucion.recarga + distribucion.botellon}% 100%)` }">
                <div class="circulo-interno">
                   <span class="texto-centro">TOTAL<br><small>PRODUCTOS</small></span>
                </div>
              </div>
            </div>
            <ul class="leyenda">
              <li><span class="punto verde"></span> Recarga <span class="porcentaje">{{ distribucion.recarga }}%</span></li>
              <li><span class="punto azul"></span> Botellón <span class="porcentaje">{{ distribucion.botellon }}%</span></li>
              <li><span class="punto naranja"></span> Combo <span class="porcentaje">{{ distribucion.combo }}%</span></li>
            </ul>
          </div>
        </div>

        <!-- Stock Bajo -->
        <div class="premium-table-card card-full-width">
          <div class="card-header-flex">
            <h3 class="card-title-premium">Alertas de Stock Bajo</h3>
            <a href="#" class="view-all-link">Ver inventario completo</a>
          </div>
          <div class="contenedor-tabla-responsive">
            <table class="tabla-stock">
              <thead>
                <tr><th>INSUMO</th><th>CANTIDAD</th><th>ESTATUS</th></tr>
              </thead>
              <tbody>
                <tr v-for="prod in productosBajoStock" :key="prod.id">
                  <td><span class="icono-insumo">⭕</span> {{ prod.nombre }} ({{ prod.tipo }})</td>
                  <td>{{ prod.stock }} uds</td>
                  <td><span class="badge critico">{{ prod.stock === 0 ? 'AGOTADO' : 'CRÍTICO' }}</span></td>
                </tr>
                <tr v-if="productosBajoStock.length === 0">
                  <td colspan="3" style="text-align: center; color: #10b981; font-weight: 700; padding: 20px;">✅ Todos los insumos están en niveles óptimos</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
// [LÓGICA DEL COMPONENTE] Inicialización de estado reactivo, store global y manejo de eventos de la vista.

import Sidebar from '../components/Sidebar.vue';
import AlertasComponent from '../components/AlertasComponent.vue';
import { onMounted, computed, ref, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSistemaStore } from '../stores/sistema';

const router = useRouter();
const store = useSistemaStore();

// --- INTEGRACIÓN API TASA DEL DÓLAR (ve.dolarapi.com) ---
const tasas = ref([]);
const tasaCargando = ref(true);
const tasaError = ref(false);
const tasaHoraActualizacion = ref('--');
let tasaIntervalId = null;

const NOMBRES_VISIBLES = {
  oficial: 'BCV Oficial',
  paralelo: 'Paralelo'
};

const FUENTES_VISIBLES = {
  oficial: 'Banco Central',
  paralelo: 'Mercado Paralelo'
};

const COLORES_CARD = {
  oficial: 'dolar-card-bcv',
  paralelo: 'dolar-card-paralelo'
};

const fetchTasas = async () => {
  tasaCargando.value = true;
  tasaError.value = false;
  try {
    const res = await fetch('https://ve.dolarapi.com/v1/dolares');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    const prioridad = ['oficial', 'paralelo'];
    const ordenadas = [...data].sort((a, b) =>
      prioridad.indexOf(a.fuente) - prioridad.indexOf(b.fuente)
    );
    tasas.value = ordenadas.map(d => ({
      nombre: NOMBRES_VISIBLES[d.fuente] || d.nombre,
      fuente: FUENTES_VISIBLES[d.fuente] || d.fuente,
      claseCard: COLORES_CARD[d.fuente] || 'dolar-card-paralelo',
      precio: Number(d.promedio).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      actualizado: d.fechaActualizacion
        ? new Date(d.fechaActualizacion).toLocaleDateString('es-VE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
        : '--'
    }));
    const ahora = new Date();
    tasaHoraActualizacion.value = ahora.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' });
  } catch (err) {
    console.error('Error al obtener tasa del dólar:', err);
    tasaError.value = true;
  } finally {
    tasaCargando.value = false;
  }
};

const nombreRol = computed(() => {
  if (store.rolUsuario === 'admin') return 'Administrador';
  if (store.rolUsuario === 'cajero') return 'Cajero';
  return 'Usuario';
});

const emailUsuario = computed(() => store.perfilUsuario?.email || (store.rolUsuario === 'admin' ? 'admin@wateriujo.com' : 'caja@wateriujo.com'));

// --- LÓGICA DE NAVEGACIÓN POR SEMANAS ---
const fechaReferencia = ref(new Date());

const getRangoSemana = (fecha) => {
  const d = new Date(fecha);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Lunes
  const lunes = new Date(d.setDate(diff));
  lunes.setHours(0,0,0,0);
  const domingo = new Date(lunes);
  domingo.setDate(lunes.getDate() + 6);
  domingo.setHours(23,59,59,999);
  return { lunes, domingo };
};

const cambiarSemana = (offset) => {
  const nueva = new Date(fechaReferencia.value);
  nueva.setDate(nueva.getDate() + (offset * 7));
  fechaReferencia.value = nueva;
};

const textoRangoSemana = computed(() => {
  const { lunes, domingo } = getRangoSemana(fechaReferencia.value);
  const opciones = { day: '2-digit', month: 'short' };
  return `${lunes.toLocaleDateString('es-ES', opciones)} - ${domingo.toLocaleDateString('es-ES', opciones)}`;
});

// --- FILTRADO DE TICKETS POR FECHA ---
const ticketsFiltrados = computed(() => {
  const { lunes, domingo } = getRangoSemana(fechaReferencia.value);
  const lista = store.tickets || [];
  return lista.filter(t => {
    if (!t.timestamp) {
       const hoy = new Date();
       return lunes <= hoy && hoy <= domingo;
    }
    const fechaT = new Date(t.timestamp);
    return fechaT >= lunes && fechaT <= domingo;
  });
});

// 1. Ventas del Periodo
const totalVentasPeriodo = computed(() => {
  return ticketsFiltrados.value.reduce((sum, t) => sum + (t.monto || 0), 0);
});

// 2. Litros Despachados
const totalLitros = computed(() => {
  let litros = 0;
  ticketsFiltrados.value.forEach(ticket => {
    if (ticket.items && Array.isArray(ticket.items)) {
      ticket.items.forEach(item => {
        const cant = Number(item.cant || item.cantidad) || 0;
        const nombreVal = String(item.nombre || '').toLowerCase();
        const match = nombreVal.match(/(\d+)l/);
        if (match) litros += parseInt(match[1]) * cant;
        else if (nombreVal.includes('botellón') || nombreVal.includes('botellon')) litros += 19 * cant; 
      });
    }
  });
  return litros;
});

// 3. Clientes en el periodo
const totalClientes = computed(() => {
  const clientesUnicos = new Set(ticketsFiltrados.value.map(t => t.cliente));
  return clientesUnicos.size;
});

// 4. Delivery y Stock Alerts
const totalDeliveries = computed(() => {
  return ticketsFiltrados.value.filter(t => (t.metodo || '').toLowerCase() === 'delivery' || (t.items && t.items.some(i => (i.nombre || '').toLowerCase().includes('delivery')))).length;
});

const productosBajoStock = computed(() => {
  return store.inventario.filter(p => {
    const stock = p.stock !== undefined ? p.stock : (p.Stock_Actual || 0);
    const minimo = p.minimo !== undefined ? p.minimo : (p.Stock_Minimo || 5);
    return stock <= minimo;
  });
});

// 5. Distribución de Ventas
const distribucion = computed(() => {
  let rec = 0, bot = 0, com = 0;
  ticketsFiltrados.value.forEach(t => {
    if (t.items) t.items.forEach(item => {
      const nom = String(item.nombre || '').toLowerCase();
      const cant = Number(item.cant || item.cantidad) || 0;
      if (nom.includes('recarga')) rec += cant;
      else if (nom.includes('botellón') || nom.includes('botellon')) bot += cant;
      else if (nom.includes('combo')) com += cant;
    });
  });
  const totalProd = rec + bot + com || 1;
  return {
    recarga: Math.round((rec / totalProd) * 100),
    botellon: Math.round((bot / totalProd) * 100),
    combo: Math.round((com / totalProd) * 100)
  };
});

// 6. Lógica de Barras por Día
const litrosPorDia = computed(() => {
  const result = [0, 0, 0, 0, 0, 0, 0];
  const { lunes } = getRangoSemana(fechaReferencia.value);
  const hoy = new Date();
  
  ticketsFiltrados.value.forEach(t => {
    const fechaT = t.timestamp ? new Date(t.timestamp) : hoy;
    const d = fechaT.getDay();
    const idx = d === 0 ? 6 : d - 1;

    if (t.items) {
      t.items.forEach(item => {
        const cant = Number(item.cant || item.cantidad) || 0;
        const nom = String(item.nombre || '').toLowerCase();
        const match = nom.match(/(\d+)l/);
        if (match) result[idx] += parseInt(match[1]) * cant;
        else if (nom.includes('botellón') || nom.includes('botellon')) result[idx] += 19 * cant;
      });
    }
  });
  return result;
});

const barrasAlturas = computed(() => {
  const valores = litrosPorDia.value;
  const max = Math.max(...valores, 50);
  return valores.map(v => (v / max) * 100);
});

onMounted(() => {
  if (store.rolUsuario !== 'admin') {
    alert('Acceso Denegado. Solo los administradores pueden ver esta pantalla.');
    router.push('/');
    return;
  }
  fetchTasas();
  store.fetchGeneralData(); // Carga inicial
  
  // PROBLEMA 3: Polling cada 5 segundos para tiempo real
  tasaIntervalId = setInterval(() => {
    fetchTasas();
    store.fetchGeneralData();
  }, 5000);
});

onUnmounted(() => {
  if (tasaIntervalId) clearInterval(tasaIntervalId);
});
</script>

<style scoped>
/* Reset básico */
* { box-sizing: border-box; margin: 0; padding: 0; }

.dashboard-contenedor {
  flex: 1;
  padding: 20px 45px;
  overflow-y: auto;
  color: #1e293b;
  background-color: #f8fafc;
  min-width: 0;
}

.page-header { display: flex; justify-content: space-between; align-items: center; border-bottom: none; margin-bottom: 30px; padding: 0; }
.header-admin-left { margin-bottom: 35px; }
.title-container-left h2 { font-size: 28px; color: #1e293b; font-weight: 800; margin: 0; letter-spacing: -0.5px; }
.title-container-left .subtitle-admin-left { color: #64748b; font-size: 14px; margin-top: 5px; font-weight: 500; }
.title-container-left .subtitle-admin-left strong { color: #3b82f6; text-transform: none; }

.perfil-usuario-top { display: flex; align-items: center; gap: 12px; background: white; padding: 12px 20px; border-radius: 20px; box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05); border: 1px solid rgba(226, 232, 240, 0.8); transition: transform 0.3s ease; cursor: pointer; }
.perfil-usuario-top:hover { transform: translateY(-2px); box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.08); }
.info-texto-top { display: flex; flex-direction: column; text-align: right; }
.nombre-top { font-size: 15px; font-weight: 800; color: #1e293b; line-height: 1; text-transform: capitalize; }
.email-top { font-size: 11px; font-weight: 500; color: #64748b; margin-top: 2px; }
.avatar-top { width: 40px; height: 40px; background: #e3f2fd; color: #2196F3; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 18px; border: 1px solid #2196F3; }

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
.kpi-trend.positive { color: #10b981; }
.kpi-trend.negative { color: #ef4444; }
.kpi-trend.neutral { color: #8b5cf6; }

.date-navigation { display: flex; align-items: center; gap: 10px; margin-top: 5px; }
.nav-arrow { background: #eff6ff; border: none; width: 32px; height: 32px; border-radius: 8px; display: flex; justify-content: center; align-items: center; cursor: pointer; color: #3b82f6; font-size: 22px; font-weight: 900; transition: 0.2s; }
.nav-arrow:hover { background: #3b82f6; color: white; transform: scale(1.1); }

.premium-dashboard-row { display: grid; grid-template-columns: 2fr 1.2fr; gap: 25px; align-items: stretch; }
.premium-chart-card, .premium-table-card { background: white; padding: 30px; border-radius: 20px; border: 1px solid rgba(226, 232, 240, 0.8); box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05); display: flex; flex-direction: column; }
.card-header-flex { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; }
.card-title-premium { font-size: 18px; font-weight: 800; color: #0f172a; margin: 0; }
.subtitle-admin { color: #64748b; font-size: 13px; font-weight: 500; display: block; margin-top: 4px; }
.date-text-large { font-size: 17px !important; font-weight: 800 !important; color: #1e293b !important; }

.btn-more-options { background: none; border: none; font-size: 20px; color: #94a3b8; cursor: pointer; transition: color 0.2s; padding: 5px; }
.btn-more-options:hover { color: #3b82f6; }
.view-all-link { font-size: 14px; font-weight: 700; color: #3b82f6; text-decoration: none; transition: 0.2s; }
.view-all-link:hover { color: #2563eb; text-decoration: underline; }

.barras-simuladas { display: flex; align-items: flex-end; height: 160px; gap: 15px; padding-bottom: 10px; border-bottom: 1px solid #f1f5f9; }
.barra { flex: 1; background: linear-gradient(to top, #3b82f6, #60a5fa); border-radius: 8px 8px 0 0; transition: height 1s ease; position: relative; display: flex; justify-content: center; align-items: center; overflow: hidden; }
.barra-label-interna { font-size: 14px; font-weight: 900; color: white; text-shadow: 0 1px 4px rgba(0,0,0,0.6); writing-mode: vertical-lr; transform: rotate(180deg); }
.dias-semana { display: flex; justify-content: space-between; margin-top: 15px; font-size: 12px; font-weight: 700; color: #94a3b8; padding: 0 10px; }

.circulo-container { display: flex; justify-content: center; margin: 20px 0; }
.circulo-simulado { width: 170px; height: 170px; border-radius: 50%; display: flex; justify-content: center; align-items: center; position: relative; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
.circulo-interno { width: 130px; height: 130px; background: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; }
.texto-centro { text-align: center; font-size: 16px; font-weight: 800; color: #1e293b; line-height: 1.2; }
.texto-centro small { font-size: 9px; color: #64748b; font-weight: 700; letter-spacing: 0.5px; }

.leyenda { list-style: none; padding: 0; margin-top: 10px; }
.leyenda li { display: flex; align-items: center; margin-bottom: 15px; font-size: 14px; font-weight: 600; color: #475569; }
.punto { width: 10px; height: 10px; border-radius: 50%; margin-right: 12px; }
.punto.verde { background-color: #10b981; } .punto.azul { background-color: #3b82f6; } .punto.naranja { background-color: #f59e0b; }
.porcentaje { margin-left: auto; font-weight: 800; color: #1e293b; }

.card-full-width { grid-column: 1 / -1; }
.contenedor-tabla-responsive { overflow-x: auto; margin-top: 10px; }
.tabla-stock { width: 100%; border-collapse: collapse; }
.tabla-stock th { text-align: left; font-size: 12px; font-weight: 700; color: #94a3b8; padding: 12px 0; border-bottom: 2px solid #f1f5f9; text-transform: uppercase; letter-spacing: 1px; }
.tabla-stock td { padding: 20px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 600; color: #1e293b; }
.icono-insumo { margin-right: 12px; font-size: 18px; }

.badge { padding: 6px 12px; border-radius: 20px; font-size: 10px; font-weight: 800; letter-spacing: 0.5px; }
.badge.critico { background-color: #fee2e2; color: #ef4444; } 

.dolar-widget-container {
  background: white;
  border-radius: 24px;
  padding: 28px 32px;
  border: 1px solid rgba(226,232,240,0.8);
  box-shadow: 0 10px 30px -5px rgba(0,0,0,0.05);
}
.dolar-widget-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}
.dolar-title-group { display: flex; flex-direction: column; gap: 4px; }
.dolar-badge-live { font-size: 10px; font-weight: 800; letter-spacing: 1.5px; color: #64748b; text-transform: uppercase; }
.dolar-badge-live.pulsing { color: #10b981; animation: pulseGreen 2s ease-in-out infinite; }
@keyframes pulseGreen { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
.dolar-titulo { font-size: 20px; font-weight: 800; color: #0f172a; margin: 0; }
.dolar-subtitulo { font-size: 12px; color: #94a3b8; font-weight: 500; margin: 0; }
.dolar-actualiza { display: flex; align-items: center; gap: 10px; }
.dolar-hora { font-size: 12px; color: #64748b; font-weight: 600; }
.dolar-spin { font-size: 12px; color: #94a3b8; }
.btn-refresh-tasa {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  width: 36px;
  height: 36px;
  font-size: 18px;
  font-weight: 700;
  color: #3b82f6;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-refresh-tasa:hover:not(:disabled) { background: #3b82f6; color: white; border-color: #3b82f6; transform: scale(1.05); }
.btn-refresh-tasa:disabled { opacity: 0.5; cursor: not-allowed; }
.dolar-cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
.dolar-card { border-radius: 18px; padding: 20px 22px; position: relative; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; }
.dolar-card:hover { transform: translateY(-4px); box-shadow: 0 16px 32px -8px rgba(0,0,0,0.12); }
.dolar-card-bcv { background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%); color: white; }
.dolar-card-paralelo { background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%); color: white; }
.dolar-card::before {
  content: '$';
  position: absolute;
  right: -10px;
  bottom: -20px;
  font-size: 100px;
  font-weight: 900;
  opacity: 0.06;
  color: white;
  line-height: 1;
}
.dolar-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.dolar-fuente-badge { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; background: rgba(255,255,255,0.15); padding: 3px 9px; border-radius: 20px; color: rgba(255,255,255,0.9); }
.dolar-nombre { font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.7); }
.dolar-precio-main { display: flex; align-items: flex-end; gap: 6px; margin-bottom: 10px; }
.dolar-simbolo { font-size: 16px; font-weight: 700; color: rgba(255,255,255,0.6); padding-bottom: 4px; }
.dolar-valor { font-size: 36px; font-weight: 900; color: white; line-height: 1; letter-spacing: -1px; }
.skeleton-load { opacity: 0.4; }
.dolar-footer-card { font-size: 11px; color: rgba(255,255,255,0.55); font-weight: 600; }
.dolar-equivalencia { display: block; }
.dolar-error { background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; border-radius: 12px; padding: 16px 20px; font-size: 14px; font-weight: 600; }
.dolar-sin-datos { color: #94a3b8; font-size: 14px; padding: 20px 0; }

@media (max-width: 1200px) { .premium-dashboard-row { grid-template-columns: 1fr; } }
@media (max-width: 768px) {
  .app-layout { flex-direction: column; }
  .dashboard-contenedor { padding: 20px; }
  .page-header { flex-direction: column; align-items: flex-start; gap: 20px; }
  .perfil-usuario-top { width: 100%; justify-content: space-between; }
  .info-texto-top { text-align: left; }
  .premium-kpi-grid { grid-template-columns: 1fr; }
  .premium-chart-card, .premium-table-card { padding: 20px; }
}
</style>