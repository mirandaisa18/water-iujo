<!-- VISTA: Panel de Repartidores | Propósito: Gestión de rutas, visualización de pedidos en estado de entrega y mapa geográfico de despachos. -->
<template>
  <div class="app-layout">
    <Sidebar />
    <main class="main-content">
      <header class="page-header header-admin-left">
        <div class="title-container-left">
          <h2 class="title-admin-left">Panel de Despacho (Delivery)</h2>
          <p class="subtitle-admin-left">Gestiona tus rutas, entregas y pedidos asignados para hoy.</p>
        </div>
        <div class="header-actions">
          <div class="perfil-usuario-top" @click="router.push('/configuracion')">
            <div class="info-texto-top">
              <span class="nombre-top">{{ nombreUsuario }}</span>
              <span class="email-top">Repartidor (Activo)</span>
            </div>
            <div class="avatar-top">🛵</div>
          </div>
        </div>
      </header>
      
      <div class="dashboard-delivery">
         <!-- KPIs Rápidos -->
         <div class="premium-kpi-grid"><div class="premium-kpi-card card-blue">
              <div class="kpi-icon-wrapper"><span class="kpi-icon">📋</span></div>
              <div class="kpi-info">
                <span class="kpi-label">Pendientes</span>
                <h3 class="kpi-value">{{ pedidosPendientes.length }}</h3>
                <div class="kpi-trend neutral"><span>Por despachar</span></div>
              </div>
            </div>
            <div class="premium-kpi-card card-green">
              <div class="kpi-icon-wrapper"><span class="kpi-icon">✅</span></div>
              <div class="kpi-info">
                <span class="kpi-label">Entregados</span>
                <h3 class="kpi-value">{{ pedidosEntregados.length }}</h3>
                <div class="kpi-trend neutral"><span>Hoy</span></div>
              </div>
            </div>
         </div>

         <!-- Sección de Rutas/Pedidos -->
         <div class="premium-table-card" style="margin-top: 30px;">
            <div class="tarjeta-header">
               <div class="header-con-icono">
                  <span class="icono-seccion azul">📍</span>
                  <h3>Mis Pedidos de Ruta</h3>
               </div>
            </div>

            <div v-if="listaPedidos.length === 0" class="tarjeta-vacia">
               <div class="icono-vacia">📦</div>
               <h2>No hay pedidos asignados</h2>
               <p>Regresa más tarde o consulta con el administrador.</p>
            </div>

            <table v-else class="tabla-premium">
               <thead>
                  <tr>
                     <th># TICKET</th>
                     <th>CLIENTE</th>
                     <th>DIRECCIÓN</th>
                     <th>DETALLE</th>
                     <th>ESTATUS</th>
                     <th>ACCIONES</th>
                  </tr>
               </thead>
               <tbody>
                  <tr v-for="p in listaPedidos" :key="p.id">
                     <td><strong>#{{ p.id }}</strong></td>
                     <td>{{ p.cliente }}</td>
                     <td>{{ p.direccion }}</td>
                     <td>{{ p.detalle }}</td>
                     <td>
                        <span class="badge" :class="p.estatus === 'Entregado' ? 'badge-verde' : p.estatus === 'En Ruta' ? 'badge-azul' : 'badge-naranja'">
                           {{ p.estatus }}
                        </span>
                     </td>
                     <td>
                        <button v-if="p.estatus === 'Pendiente'" class="btn-accion azul" @click="aceptarPedido(p)">Aceptar</button>
                        <button v-if="p.estatus === 'En Ruta'" class="btn-accion" @click="visualizarMapa(p)">Gestionar y Ver Mapa</button>
                        <span v-if="p.estatus === 'Entregado'" class="txt-finalizado">Completado ✓</span>
                     </td>
                  </tr>
               </tbody>
            </table>

            <!-- MODAL DE MAPA PARA EL DELIVERY -->
            <div v-if="showMapaModal" class="super-modal-overlay">
               <div class="modal-mapa-delivery anim-bounce">
                  <header class="modal-header">
                     <h3>📍 Ruta de Entrega: #{{ pedidoActivoMapa?.id }}</h3>
                     <button class="btn-cerrar-modal" @click="cerrarMapa">✕</button>
                  </header>
                  <div class="cuerpo-mapa">
                     <div class="info-cliente-delivery" style="background: #f8fafc; padding: 10px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #e2e8f0; font-size: 14px; display: flex; flex-direction: column; gap: 5px;">
                       <div><strong style="color: #475569;">Cliente:</strong> <span style="color: #0f172a; font-weight: 600;">{{ pedidoActivoMapa?.cliente }}</span></div>
                       <div style="display: flex; justify-content: space-between; align-items: center;">
                          <div><strong style="color: #475569;">Celular:</strong> <span style="color: #0f172a; font-weight: 600;">{{ pedidoActivoMapa?.telefono }}</span></div>
                          <a v-if="pedidoActivoMapa?.origen !== 'cliente'" :href="enlaceWhatsApp" target="_blank" style="background: #25D366; color: white; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: bold; text-decoration: none;">💬 WhatsApp</a>
                       </div>
                       <div><strong style="color: #475569;">Destino:</strong> <span style="color: #0f172a; font-weight: 600;">{{ pedidoActivoMapa?.direccion }}</span></div>
                     </div>

                     <!-- Mini Chat si el origen es de la app cliente web -->
                     <div class="chat-interno" v-if="pedidoActivoMapa?.origen === 'cliente'" style="margin-bottom: 15px; border: 1px solid #e2e8f0; border-radius: 8px;">
                        <div style="background: #f1f5f9; padding: 6px 10px; font-weight: 700; border-top-left-radius: 8px; border-top-right-radius: 8px; font-size: 11px;">💬 Chat con Cliente Web</div>
                        <div style="height: 100px; overflow-y: auto; padding: 10px; display: flex; flex-direction: column; gap: 8px; font-size: 12px;">
                           <div v-for="(msg, idx) in pedidoActivoMapa?.mensajes" :key="idx" :style="{ alignSelf: msg.de === 'delivery' ? 'flex-end' : 'flex-start', background: msg.de === 'delivery' ? '#dcfce7' : '#eff6ff', padding: '6px 10px', borderRadius: '8px', maxWidth: '80%' }">
                              {{ msg.texto }}
                           </div>
                        </div>
                        <div style="display: flex; gap: 5px; padding: 8px; border-top: 1px solid #e2e8f0;">
                           <input type="text" v-model="nuevoMensajeDelivery" placeholder="Escribe algo..." style="flex:1; border: 1px solid #cbd5e1; border-radius: 6px; padding: 4px 8px;" @keyup.enter="enviarMensajeDelivery" />
                           <button @click="enviarMensajeDelivery" style="background: #3b82f6; color: white; border: none; border-radius: 6px; padding: 0 10px; font-weight: bold; cursor:pointer; font-size: 11px;">Enviar</button>
                        </div>
                     </div>

                     <div id="mapa-despacho-repartidor" class="map-frame-delivery" style="height: 250px;"></div>
                     
                     <div class="seccion-foto-seguridad" style="margin-top: 15px;">
                       <p style="font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 8px;">📸 Evidencia de Integridad (Foto)</p>
                       <div class="upload-container" style="display: flex; align-items: center; gap: 15px;">
                         <input type="file" accept="image/*" @change="onFotoAdjuntada" class="input-foto" id="foto-evidencia" style="display: none;" />
                         <label for="foto-evidencia" class="btn-subir-foto" style="background: #e2e8f0; padding: 10px 15px; border-radius: 8px; cursor: pointer; font-size: 12px; font-weight: 700; color: #475569;">+ Tomar / Elegir Foto</label>
                         <img v-if="fotoEvidenciaPreview" :src="fotoEvidenciaPreview" class="preview-foto" style="height: 60px; width: 60px; object-fit: cover; border-radius: 8px; border: 2px solid #3b82f6;" />
                       </div>
                     </div>
                  </div>
                  <footer class="modal-footer" style="display: flex; justify-content: space-between;">
                     <button class="btn-cerrar-reparto" @click="cerrarMapa" style="background: #f1f5f9; color: #64748b;">Atrás</button>
                     <button v-if="pedidoActivoMapa?.estatus !== 'Entregado'" class="btn-cerrar-reparto" @click="marcarEntregadoDesdeMapa" style="background: #10b981; color: white;">Confirmar Entrega ✓</button>
                  </footer>
               </div>
            </div>
         </div>
      </div>
    </main>
  </div>
</template>

<script setup>
// [LÓGICA DEL COMPONENTE] Inicialización de estado reactivo, store global y manejo de eventos de la vista.

import Sidebar from '../components/Sidebar.vue';
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useSistemaStore } from '../stores/sistema';

const router = useRouter();
const store = useSistemaStore();

const esDelivery = computed(() => store.rolUsuario === 'delivery' || store.rolUsuario === 'admin');

onMounted(() => {
  if (!esDelivery.value) {
    alert('Acceso restringido: Solo para Repartidores o Administradores.');
    router.push('/');
  }
});

const nombreUsuario = computed(() => store.perfilUsuario?.nombre || 'Repartidor');

const listaPedidos = computed(() => store.listaEntregas);
const pedidosPendientes = computed(() => listaPedidos.value.filter(p => p.estatus === 'Pendiente' || p.estatus === 'En Ruta'));
const pedidosEntregados = computed(() => listaPedidos.value.filter(p => p.estatus === 'Entregado'));

const showMapaModal = ref(false);
const pedidoActivoMapa = ref(null);
const leafletMap = ref(null);
const fotoEvidenciaPreview = ref(null);

const enlaceWhatsApp = computed(() => {
  if (!pedidoActivoMapa.value || !pedidoActivoMapa.value.telefono) return '#';
  const tel = pedidoActivoMapa.value.telefono.replace(/\D/g, '');
  return `https://wa.me/${tel}?text=Hola,%20soy%20el%20repartidor%20de%20Water%20Iujo!%20Voy%20en%20camino%20con%20tu%20pedido.`;
});

const nuevoMensajeDelivery = ref('');

const enviarMensajeDelivery = () => {
  if (!nuevoMensajeDelivery.value.trim() || !pedidoActivoMapa.value) return;
  store.agregarMensajeChat(pedidoActivoMapa.value.id, { de: 'delivery', texto: nuevoMensajeDelivery.value });
  nuevoMensajeDelivery.value = '';
};

const onFotoAdjuntada = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      fotoEvidenciaPreview.value = ev.target.result;
      if (pedidoActivoMapa.value) {
         pedidoActivoMapa.value.fotoIntegridad = ev.target.result;
      }
    };
    reader.readAsDataURL(file);
  }
};

const cerrarMapa = () => {
  showMapaModal.value = false;
  fotoEvidenciaPreview.value = null;
};

const aceptarPedido = (pedido) => {
  const horaSalida = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  store.actualizarEstatusEntrega(pedido.id, 'En Ruta', { horaSalida });
  visualizarMapa(pedido);
};

const marcarEntregadoDesdeMapa = () => {
  if (!fotoEvidenciaPreview.value) {
    alert("❌ Debes adjuntar una foto (evidencia) para poder marcar el pedido como entregado.");
    return;
  }
  const horaEntrega = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  store.actualizarEstatusEntrega(pedidoActivoMapa.value.id, 'Entregado', { horaEntrega, fotoIntegridad: fotoEvidenciaPreview.value });
  showMapaModal.value = false;
};

const visualizarMapa = (pedido) => {
  pedidoActivoMapa.value = pedido;
  fotoEvidenciaPreview.value = pedido.fotoIntegridad || null;
  showMapaModal.value = true;
  nextTick(() => {
    initMapaReparto(pedido);
  });
};

const initMapaReparto = (pedido) => {
  if (leafletMap.value) {
    leafletMap.value.remove();
  }
  
  if (!window.L) return;
  const L = window.L;
  
  // Coordenadas base (Water Iujo)
  const baseCoords = [10.067, -69.333];
  
  const map = L.map('mapa-despacho-repartidor', { zoomControl: false }).setView(baseCoords, 14);
  leafletMap.value = map;
  
  L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', { maxZoom: 20 }).addTo(map);

  const drawMap = (repartidorCoords) => {
    let customerCoords = null;
    if (pedido.ubicaciones && pedido.ubicaciones.length > 0) {
       const lastUbi = pedido.ubicaciones[pedido.ubicaciones.length - 1];
       if (lastUbi.lat && lastUbi.lng) {
          customerCoords = [lastUbi.lat, lastUbi.lng];
       }
    }

    const waypoints = [repartidorCoords, baseCoords];
    if (customerCoords) waypoints.push(customerCoords);

    if (waypoints.length > 1) {
      const coordsString = waypoints.map(c => `${c[1]},${c[0]}`).join(';');
      fetch(`https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`)
        .then(r => r.json())
        .then(data => {
          if (data && data.routes && data.routes.length > 0) {
             const route = data.routes[0];
             const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);
             const polyline = L.polyline(coords, { color: '#3b82f6', weight: 4 }).addTo(map);
             map.fitBounds(polyline.getBounds(), { padding: [20, 20] });
          }
        }).catch(() => {
             const polyline = L.polyline(waypoints, { color: '#3b82f6', weight: 4 }).addTo(map);
             map.fitBounds(polyline.getBounds(), { padding: [20, 20] });
        });
      
      // Repartidor
      L.marker(repartidorCoords, { icon: L.divIcon({ className: 'custom-m', html: `<div style="background:#f59e0b; width:24px; height:24px; border-radius:50%; border:2px solid white; display:flex; justify-content:center; align-items:center; box-shadow:0 0 5px rgba(0,0,0,0.5);"><span style="font-size:12px;">🛵</span></div>`, iconSize: [28,28] }) }).addTo(map);
      
      // Local
      L.marker(baseCoords, { icon: L.divIcon({ className: 'custom-m', html: `<div style="background:#1e293b; width:24px; height:24px; border-radius:50%; border:2px solid white; display:flex; justify-content:center; align-items:center; box-shadow:0 0 5px rgba(0,0,0,0.5);"><span style="font-size:12px;">🏪</span></div>`, iconSize: [28,28] }) }).addTo(map);

      // Cliente
      if (customerCoords) {
        L.marker(customerCoords, { icon: L.divIcon({ className: 'custom-m', html: `<div style="background:#00d26a; width:24px; height:24px; border-radius:50%; border:2px solid white; display:flex; justify-content:center; align-items:center; box-shadow:0 0 5px rgba(0,0,0,0.5);"><span style="font-size:12px;">📍</span></div>`, iconSize: [28,28] }) }).addTo(map);
      }
    }
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      drawMap([pos.coords.latitude, pos.coords.longitude]);
    }, () => {
      drawMap([10.07, -69.34]); // fallback if location rejected
    }, { enableHighAccuracy: false, maximumAge: 300000, timeout: 5000 });
  } else {
    drawMap([10.07, -69.34]);
  }
};
</script>

<style scoped>
/* [ESTILOS] Reglas CSS exclusivas de esta vista (scoped) para evitar colisiones globales. */

.main-content { flex: 1; padding: 20px 45px; background: #f8fafc; overflow-y: auto; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.header-admin-left { margin-bottom: 35px; }
.title-container-left h2 { font-size: 28px; color: #1e293b; font-weight: 800; margin: 0; letter-spacing: -0.5px; }
.title-container-left .subtitle-admin-left { color: #64748b; font-size: 14px; margin-top: 5px; font-weight: 500; }

.perfil-usuario-top { display: flex; align-items: center; gap: 12px; background: white; padding: 12px 20px; border-radius: 20px; box-shadow: 0 10px 30px -5px rgba(0,0,0,0.05); border: 1px solid rgba(226,232,240,0.8); cursor: pointer; }
.info-texto-top { display: flex; flex-direction: column; text-align: right; }
.nombre-top { font-size: 15px; font-weight: 800; color: #1e293b; text-transform: capitalize; }
.email-top { font-size: 11px; font-weight: 500; color: #64748b; margin-top: 2px; }
.avatar-top { width: 40px; height: 40px; background: #ffe4e6; color: #f43f5e; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 18px; border: 1px solid #f43f5e; }

/* KPIs */
.premium-kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; }
.premium-kpi-card { background: white; padding: 25px; border-radius: 20px; display: flex; align-items: center; gap: 20px; border: 1px solid rgba(226,232,240,0.8); box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05); }
.kpi-icon-wrapper { width: 54px; height: 54px; border-radius: 16px; display: flex; justify-content: center; align-items: center; font-size: 24px; }
.card-blue .kpi-icon-wrapper { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
.card-green .kpi-icon-wrapper { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.kpi-info .kpi-label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
.kpi-info .kpi-value { font-size: 24px; font-weight: 800; color: #1e293b; margin: 2px 0; }
.kpi-trend { font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 4px; color: #64748b; }

/* Tables and Cards */
.premium-table-card { background: white; padding: 30px; border-radius: 24px; border: 1px solid rgba(226,232,240,0.8); box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05); }
.tarjeta-header { margin-bottom: 25px; }
.header-con-icono { display: flex; align-items: center; gap: 15px; }
.icono-seccion { width: 44px; height: 44px; border-radius: 12px; display: flex; justify-content: center; align-items: center; font-size: 20px; }
.icono-seccion.azul { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
.tarjeta-header h3 { font-size: 18px; font-weight: 800; color: #0f172a; margin: 0; }

.tarjeta-vacia { padding: 60px 20px; text-align: center; color: #64748b; }
.icono-vacia { font-size: 48px; margin-bottom: 15px; opacity: 0.3; }
.tarjeta-vacia h2 { color: #334155; font-size: 20px; margin-bottom: 8px; font-weight: 800;}

.tabla-premium { width: 100%; border-collapse: collapse; margin-top: 10px; }
.tabla-premium th { text-align: left; padding: 15px; border-bottom: 2px solid #f1f5f9; color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; }
.tabla-premium td { padding: 18px 15px; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-size: 14px; font-weight: 600; }

.badge { padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
.badge-verde { background: #dcfce7; color: #15803d; }
.badge-naranja { background: #ffedd5; color: #c2410c; }

.btn-accion { padding: 8px 15px; border-radius: 8px; border: 1px solid #e2e8f0; background: white; color: #475569; font-weight: 700; font-size: 12px; cursor: pointer; transition: 0.2s; margin-right: 5px; }
.btn-accion:hover { background: #f8fafc; border-color: #cbd5e1; }
.btn-accion.verde { background: #10b981; color: white; border: none; }
.btn-accion.verde:hover { background: #059669; }
.btn-accion.azul { background: #3b82f6; color: white; border: none; }
.btn-accion.azul:hover { background: #2563eb; }

.txt-finalizado { font-size: 11px; color: #10b981; font-weight: 800; font-style: italic; }

/* MODAL MAPA */
.super-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal-mapa-delivery { background: white; border-radius: 24px; width: 100%; max-width: 600px; padding: 30px; box-shadow: 0 40px 100px rgba(0,0,0,0.25); }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.modal-header h3 { margin: 0; font-size: 18px; font-weight: 800; color: #1e293b; }
.btn-cerrar-modal { background: none; border: none; font-size: 20px; color: #94a3b8; cursor: pointer; }

.map-frame-delivery { height: 350px; background: #f1f5f9; border-radius: 16px; border: 1px solid #e2e8f0; margin-top: 15px; }
.txt-dest-mapa { font-size: 14px; color: #64748b; margin: 0; }

.modal-footer { margin-top: 25px; display: flex; justify-content: flex-end; }
.btn-cerrar-reparto { background: #1e293b; color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.2s; }
.btn-cerrar-reparto:hover { background: #0f172a; transform: scale(1.02); }

.anim-bounce { animation: bounceIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
@keyframes bounceIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
.badge-azul { background: #eff6ff; color: #3b82f6; }
</style>
