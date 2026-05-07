<!-- VISTA: Gestión de Pedidos Web | Propósito: Panel para que el cajero acepte, rechace o asigne a delivery las compras hechas por los clientes desde la web. -->
<template>
  <div class="app-layout">
    <Sidebar />

    <main class="main-content">
      <header class="page-header header-admin-left">
        <div class="title-container-left">
          <h2 class="title-admin-left">Pedidos Web</h2>
          <p class="subtitle-admin-left">Verifica y aprueba los pagos realizados en línea</p>
        </div>
        
        <div class="usuario-rol-badge">
          <div class="info-texto-top">
            <span class="nombre-top">{{ store.perfilUsuario.nombre || 'Cajero' }}</span>
            <span class="email-top">{{ store.perfilUsuario.email || 'caja@wateriujo.com' }}</span>
          </div>
          <div class="avatar-top">👤</div>
        </div>
      </header>

      <div class="pedidos-web-view-content">
        <div v-if="store.pedidosPendientes.length === 0" class="empty-state-web">
          <span class="empty-icon-web">🌐</span>
          <h3>No hay pedidos pendientes</h3>
          <p>Los pedidos que realicen los clientes en la web aparecerán aquí para tu validación.</p>
        </div>

        <div v-else class="grid-pedidos-web">
          <div v-for="pedido in store.pedidosPendientes" :key="pedido.id" class="card-pedido-web">
            <div class="card-header-web">
              <span class="badge-web-id">Pedido {{ pedido.id }}</span>
              <span class="time-web">{{ pedido.fecha.substring(11, 16) }}</span>
            </div>

            <div class="card-body-web">
              <div class="info-row-web">
                <span class="label">Monto (USD):</span>
                <span class="value monto">${{ pedido.monto.toFixed(2) }}</span>
              </div>
              <div class="info-row-web">
                <span class="label">Método reportado:</span>
                <span class="value">{{ pedido.metodo || 'Efectivo' }}</span>
              </div>
              <div class="info-row-web">
                <span class="label">Artículos:</span>
                <span class="value items">{{ pedido.items.map((i: any) => i.cantidad + 'x ' + i.nombre).join(', ') }}</span>
              </div>
              <div v-if="pedido.delivery" class="info-row-web">
                <span class="label">Delivery a:</span>
                <span class="value">{{ pedido.delivery.direccion }} (+${{ pedido.delivery.costo.toFixed(2) }})</span>
              </div>

              <!-- BOTÓN PARA VER COMPROBANTE -->
              <div class="evidencia-box" @click="verImagen(pedido.imagenPago)">
                <div v-if="pedido.imagenPago" class="evidencia-content">
                  <img :src="pedido.imagenPago" class="thumb-img" />
                  <div class="evidencia-text">
                    <strong>Ver Comprobante</strong>
                    <span>Haz clic para visualizar en grande</span>
                  </div>
                </div>
                <div v-else class="evidencia-content no-img" style="justify-content: center;">
                  <strong>❌ Sin imagen adjunta</strong>
                </div>
              </div>
            </div>

            <div class="card-footer-web">
              <button class="btn-accion-web btn-reject" @click="resolver(pedido.id, false)">
                ✕ Rechazar
              </button>
              <button class="btn-accion-web btn-approve" @click="resolver(pedido.id, true)">
                ✓ Aprobar Venta
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- MODAL PARA VER LA IMAGEN EN GRANDE -->
      <div v-if="imagenAmpliadaUrl" class="modal-overlay-img" @click="imagenAmpliadaUrl = null">
        <div class="modal-content-img" @click.stop>
          <button class="btn-close-img" @click="imagenAmpliadaUrl = null">✕</button>
          <img :src="imagenAmpliadaUrl" class="img-zoom" />
        </div>
      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSistemaStore } from '../stores/sistema';
import Sidebar from '../components/Sidebar.vue';

const store = useSistemaStore();
const imagenAmpliadaUrl = ref<string | null>(null);

const verImagen = (url: string | null) => {
  if (url) {
    imagenAmpliadaUrl.value = url;
  }
};

const resolver = (id: number | string, aprobar: boolean) => {
  store.resolverPedido(id as number, aprobar);
};
</script>

<style scoped>
/* [ESTILOS] Reglas CSS exclusivas de esta vista (scoped) para evitar colisiones globales. */

.app-layout {
  display: flex;
  height: 100vh;
  background-color: #f1f5f9;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
}
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #f8fafc;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  z-index: 10;
}
.title-admin-left { font-size: 24px; font-weight: 800; color: #1e293b; margin: 0; }
.subtitle-admin-left { margin: 4px 0 0 0; color: #64748b; font-size: 14px; }

.usuario-rol-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8fafc;
  padding: 8px 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}
.info-texto-top { display: flex; flex-direction: column; align-items: flex-end; }
.nombre-top { font-weight: 700; color: #1e293b; font-size: 14px; }
.email-top { color: #64748b; font-size: 11px; }
.avatar-top { background: #3b82f6; color: white; border-radius: 50%; width: 35px; height: 35px; display: flex; justify-content: center; align-items: center; font-size: 16px; box-shadow: 0 4px 10px rgba(59,130,246,0.3); }

.pedidos-web-view-content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

.empty-state-web {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  text-align: center;
  color: #64748b;
}
.empty-icon-web { font-size: 60px; margin-bottom: 15px; opacity: 0.5; }
.empty-state-web h3 { font-size: 20px; font-weight: 700; color: #334155; margin-bottom: 5px; }

.grid-pedidos-web {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.card-pedido-web {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}
.card-pedido-web:hover { transform: translateY(-4px); box-shadow: 0 10px 25px rgba(0,0,0,0.06); }

.card-header-web {
  padding: 15px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.badge-web-id { background: #1e293b; color: white; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 800; letter-spacing: 0.5px; }
.time-web { font-size: 13px; font-weight: 600; color: #64748b; }

.card-body-web { padding: 20px; flex: 1; display: flex; flex-direction: column; gap: 10px; }
.info-row-web { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; font-size: 13px; }
.info-row-web .label { color: #64748b; font-weight: 500; min-width: 110px; }
.info-row-web .value { color: #1e293b; font-weight: 600; text-align: right; word-break: break-word; }
.info-row-web .value.monto { color: #10b981; font-size: 16px; font-weight: 800; }
.info-row-web .value.items { color: #3b82f6; }

.evidencia-box {
  margin-top: 15px;
  background: #f1f5f9;
  border: 1px dashed #cbd5e1;
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  transition: 0.2s;
}
.evidencia-box:hover { background: #e0e7ff; border-color: #818cf8; }
.evidencia-content { display: flex; align-items: center; gap: 12px; }
.thumb-img { width: 50px; height: 50px; border-radius: 8px; object-fit: cover; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
.evidencia-text { display: flex; flex-direction: column; }
.evidencia-text strong { color: #3b82f6; font-size: 13px; }
.evidencia-text span { color: #64748b; font-size: 11px; }

.card-footer-web {
  padding: 15px 20px;
  background: white;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 10px;
}
.btn-accion-web {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
}
.btn-reject { background: #fee2e2; color: #ef4444; }
.btn-reject:hover { background: #fca5a5; }
.btn-approve { background: #10b981; color: white; box-shadow: 0 4px 10px rgba(16,185,129,0.2); }
.btn-approve:hover { background: #059669; }

/* Modal Imagen */
.modal-overlay-img { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15,23,42,0.8); z-index: 9999; display: flex; justify-content: center; align-items: center; padding: 20px; }
.modal-content-img { position: relative; max-width: 90%; max-height: 90%; display: flex; justify-content: center; align-items: center; }
.btn-close-img { position: absolute; top: -15px; right: -15px; background: #ef4444; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 20px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.3); z-index: 10; }
.img-zoom { max-width: 100%; max-height: 85vh; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); object-fit: contain; }
</style>
