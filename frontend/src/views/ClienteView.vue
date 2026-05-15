<!-- VISTA: Interfaz de Cliente | Propósito: Plataforma para que el cliente final web vea el catálogo, administre su carrito de compras y confirme pedidos para delivery o retiro. -->
<template>
  <div class="cliente-layout">
    <!-- NAVBAR SUPERIOR -->
    <header class="navbar-cliente-premium">
      <div class="navbar-content">
        <div class="logo-area-v2">
          <div class="icono-gota-bg-premium">
            <span class="icono-gota-v2">💧</span>
          </div>
          <div class="brand-text-v2">
            <span class="brand-name-v2">WATER IUJO</span>
            <span class="brand-sub-v2">Gestión Inteligente de Pedidos</span>
          </div>
        </div>
        
        <div class="navbar-actions-v2">
          <div class="user-pill">
            <div class="avatar-circle">👤</div>
            <div class="user-meta">
              <span class="user-name-v2">Cliente Manual</span>
              <span class="user-badge-online">● En línea</span>
            </div>
          </div>
          <button class="btn-logout-v2" @click="cerrarSesion" title="Cerrar Sesión">
            <span class="btn-logout-icon">↪</span>
          </button>
        </div>
      </div>
    </header>

    <main class="main-container-v2">
      <!-- PANEL IZQUIERDO: PRODUCTOS Y HISTORIAL -->
      <section class="left-panel">
        <!-- BANNER DE BIENVENIDA -->
        <div class="welcome-banner">
          <div class="welcome-text">
            <h2>¡Bienvenido de nuevo!</h2>
            <p>Selecciona tus productos y nosotros nos encargamos del resto.</p>
          </div>
          <div class="saldo-card-v2">
            <div class="saldo-icon">💳</div>
            <div class="saldo-data">
              <span class="saldo-title">Recargas Disponibles</span>
              <span class="saldo-amount">0</span>
            </div>
          </div>
        </div>

        <!-- BARRA DE ACCIÓN: BÚSQUEDA Y TASA -->
        <div class="actions-row-v2">
          <div class="search-box-v2">
            <span class="search-icon-v2">🔍</span>
            <input type="text" v-model="busqueda" placeholder="Buscar productos..." />
          </div>
          <div class="tasa-v2">
            <span class="tasa-v2-label">Tasa Oficial (BCV)</span>
            <span class="tasa-v2-val">Bs. {{ tasaBCV }}</span>
          </div>
        </div>

        <!-- NAVEGACIÓN -->
        <div class="section-tabs-v2">
          <button class="tab-btn-v2" :class="{ active: tabActiva === 'catalogo' }" @click="tabActiva = 'catalogo'">📦 Catálogo</button>
          <button class="tab-btn-v2" :class="{ active: tabActiva === 'historial' }" @click="tabActiva = 'historial'">🕒 Mis Pedidos</button>
        </div>

        <div v-if="tabActiva === 'catalogo'" class="products-container-v2">
          <div v-for="prod in productosFiltrados" :key="prod.id" class="card-prod-v2" @click="agregarAlCarrito(prod)">
            <div class="card-prod-tag" :class="prod.colorTipo">{{ prod.tipo }}</div>
            <div class="card-prod-body">
              <h3 class="card-prod-title">{{ prod.nombre }}</h3>
              <p class="card-prod-subtitle">Disponibilidad inmediata</p>
              <div class="card-prod-pricing">
                <div class="price-usd-v2">${{ prod.precioVenta.toFixed(2) }}</div>
                <div class="price-bs-v2">Bs. {{ (prod.precioVenta * tasaBCV).toFixed(2) }}</div>
              </div>
            </div>
            <button class="btn-add-v2" @click.stop="agregarAlCarrito(prod)"><span>+</span></button>
          </div>
        </div>

        <!-- PANEL DE HISTORIAL -->
        <div v-else class="orders-history-v2">
          <div v-if="historialReal.length === 0" style="padding: 40px; text-align: center; color: #94a3b8; font-weight: 600;">No tienes pedidos registrados.</div>
          
          <div v-for="pedido in historialReal" :key="pedido.id" class="history-card-v2 slide-down">
            <div class="history-card-header">
              <div class="hist-id-group">
                <span class="hist-id">#{{ pedido.id }}</span>
                <span class="hist-date">{{ pedido.fecha }}</span>
              </div>
              <div class="hist-status" :class="pedido.statusClass">{{ pedido.estado }}</div>
            </div>
            <div class="history-card-body">
              <div class="hist-items">
                <p style="white-space: pre-wrap; font-size: 13px; color: #475569;">{{ pedido.detalleFormateado }}</p>
              </div>
              <div class="hist-total">
                <span class="total-label">Subtotal</span>
                <span class="total-val">${{ pedido.total.toFixed(2) }}</span>
              </div>
            </div>
            <div v-if="pedido.entrega" class="history-card-footer" style="margin-top: 10px;">
              <div class="delivery-tracking-info">
                <span class="tracking-icon">📍</span>
                <div class="tracking-text" style="font-size: 13px;">
                  <p><strong>Destino:</strong> {{ pedido.entrega.direccion }}</p>
                </div>
              </div>
            </div>

            <!-- CHAT INTERNO CLIENTE-REPARTIDOR -->
             <div v-if="pedido.estado === 'En Ruta'" class="chat-cliente-ui" style="margin-top: 15px; border-top: 1px dashed #cbd5e1; padding-top: 15px;">
                <p style="font-size: 12px; font-weight: 700; color: #1e293b; margin-bottom: 10px;">💬 Habla con el Conductor</p>
                <div style="height: 120px; overflow-y: auto; background: #f8fafc; border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 8px; font-size: 12px;">
                   <div v-for="(msg, idx) in pedido.mensajes" :key="idx" :style="{ alignSelf: msg.de === 'cliente' ? 'flex-end' : 'flex-start', background: msg.de === 'cliente' ? '#dcfce7' : '#eff6ff', padding: '6px 10px', borderRadius: '8px', maxWidth: '80%' }">
                      {{ msg.texto }}
                   </div>
                   <div v-if="!pedido.mensajes || pedido.mensajes.length === 0" style="text-align:center; color:#94a3b8; font-size: 11px; margin-top:20px;">Aún no hay mensajes. Escribe aquí...</div>
                </div>
                <div style="display: flex; gap: 5px; margin-top: 8px;">
                   <input type="text" v-model="nuevoMensajeCliente" placeholder="Escribe al delivery..." style="flex:1; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px; font-size:12px;" @keyup.enter="enviarMensajeCliente(pedido.id)" />
                   <button @click="enviarMensajeCliente(pedido.id)" style="background: #10b981; color: white; border: none; border-radius: 6px; padding: 0 15px; font-weight: bold; cursor:pointer;">Enviar</button>
                </div>
             </div>

          </div>
        </div>
      </section>

      <!-- PANEL DERECHO: CARRITO -->
      <aside class="right-panel">
        <div class="seccion-carrito-pos">
          <div class="cart-module-header">
            <div class="cart-module-title">
              <span class="cart-module-icon">🛒</span>
              <h2>Tu Pedido</h2>
            </div>
            <span class="cart-module-count">{{ totalItems }} items</span>
          </div>

          <div class="delivery-toggle-row">
            <div class="label-delivery">
              <span class="icono-truck">🚚</span>
              <span>Delivery</span>
            </div>
            <label class="switch">
              <input type="checkbox" v-model="requiereDelivery">
              <span class="slider round"></span>
            </label>
          </div>

          <!-- YUMMY LOGISTICS UI - CLIENTE -->
          <div v-if="requiereDelivery" class="yummy-delivery-wrapper slide-down">
            
            <!-- OPCIÓN DE DIRECCIÓN REGISTRADA PARA CLIENTE -->
            <div v-if="store.perfilUsuario && store.perfilUsuario.direccion" class="opcion-direccion-registrada-cliente no-print">
              <label class="checkbox-container-v2">
                <input type="checkbox" v-model="usarDireccionPerfil" />
                <span class="checkmark-v2"></span>
                Usar mi dirección de perfil: <strong>{{ store.perfilUsuario.direccion }}</strong>
              </label>
            </div>

            <div class="yummy-card">
              
              <div class="yummy-inputs">
                
                <!-- Origen -->
                <div class="yummy-input-row origin">
                  <span class="dot origin-dot"></span>
                  <div class="y-info" style="width:100%;">
                    <span class="y-label">Punto de Origen</span>
                    <div class="input-with-gps">
                      <input type="text" v-model="direccionOrigen" @input="buscarSugerencias(true)" placeholder="Buscando ubicación actual..." class="y-styled-input" />
                      <button class="btn-gps-locate" @click="obtenerGPSOrigen" title="Usar mi ubicación actual">📍</button>
                    </div>
                    <!-- Sugerencias Origen -->
                    <div v-if="sugerenciasOrigen.length > 0" class="sugerencias-yummy">
                      <div v-for="sug in sugerenciasOrigen" :key="sug.display_name" class="sug-yummy-item" @click="seleccionarOrigen(sug)">
                        {{ sug.display_name }}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="yummy-line"></div>
                
                <!-- Destinos Múltiples -->
                <div v-for="(dest, index) in destinosYummy" :key="dest.id" class="yummy-input-row dest" style="margin-top: 15px;">
                  <span class="dot dest-dot" :style="index === destinosYummy.length - 1 ? '' : 'background: #3b82f6; border-color: #bfdbfe;'"></span>
                  <div class="y-info" style="width:100%;">
                     <span class="y-label">{{ index === destinosYummy.length - 1 ? 'Punto de Entrega (Destino Final)' : 'Parada ' + (index + 1) }}</span>
                     <div style="display: flex; gap: 8px;">
                       <input type="text" v-model="dest.direccion" @input="buscarSugerenciasDestino(index)" placeholder="¿A dónde vamos?" class="y-styled-input" />
                       <button v-if="destinosYummy.length > 1" @click="eliminarDestino(index)" class="btn-remove-dest" title="Eliminar parada">✕</button>
                     </div>
                     <div v-if="sugerenciasDestinos[index] && sugerenciasDestinos[index].length > 0" class="sugerencias-yummy">
                       <div v-for="sug in sugerenciasDestinos[index]" :key="sug.display_name" class="sug-yummy-item" @click="seleccionarDestino(index, sug)">
                         {{ sug.display_name }}
                       </div>
                     </div>
                  </div>
                </div>

                <div class="yummy-add-dest">
                  <button class="btn-add-dest" @click="agregarDestino">+ Añadir otra parada</button>
                </div>

              </div>

              <div class="yummy-map-container">
                <div id="mapa-yummy-cliente" class="yummy-map"></div>
              </div>

              <div class="yummy-footer-calc">
                <div class="y-dist">
                  <span class="y-dist-lbl">Distancia Estimada:</span>
                  <span class="y-dist-val">{{ distanciaKms.toFixed(1) }} km</span>
                </div>
                <div class="y-cost">
                  <span class="y-cost-lbl">Costo de Delivery:</span>
                  <span class="y-cost-val">${{ deliveryCost.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="lista-items-carrito">
            <div v-for="(item, index) in carrito" :key="index" class="item-cart-fila">
              <div class="item-cart-main"><span>{{ item.nombre }}</span></div>
              <div class="item-cart-controls-wrapper">
                <div class="mini-control-cant">
                  <button class="btn-mini-cant" @click="ajustarCantidad(index, -1)">-</button>
                  <span class="val-mini-cant">{{ item.cantidad }}</span>
                  <button class="btn-mini-cant" @click="ajustarCantidad(index, 1)">+</button>
                </div>
                <div class="item-cart-precio">${{ (item.precioVenta * item.cantidad).toFixed(2) }}</div>
                <button class="btn-del" @click="eliminarDelCarrito(index)">✕</button>
              </div>
            </div>
            <div v-if="carrito.length === 0" class="carrito-vacio-state">Tu carrito está vacío</div>
          </div>

          <div class="footer-carrito-pos">
            <div class="fila-resumen"><span>Subtotal</span><span>${{ subtotalUSD.toFixed(2) }}</span></div>
            <div v-if="requiereDelivery" class="fila-resumen"><span>Delivery</span><span>+${{ deliveryCost.toFixed(2) }}</span></div>
            <div class="fila-resumen-total"><span>Total USD</span><span class="usd-grande">${{ finalTotalUSD.toFixed(2) }}</span></div>
            
            <button class="btn-checkout-v2" :disabled="carrito.length === 0" @click="abrirCheckout">
              🚀 Realizar Pedido · ${{ finalTotalUSD.toFixed(2) }}
            </button>
          </div>
        </div>
      </aside>
    </main>

    <!-- MODAL DE CHECKOUT -->
    <div v-if="showCheckout" class="modal-v2-overlay">
      <div class="modal-v2-content anim-bounce">
        <header class="modal-v2-header">
          <h3>Finalizar Pedido</h3>
          <button class="btn-close-v2" @click="showCheckout = false">✕</button>
        </header>

        <div class="checkout-process-grid">
          <div class="checkout-summary-mini">
            <h4>Resumen de Orden</h4>
            <div class="summary-it-list">
              <div v-for="it in carrito" :key="it.id" class="sum-it-row">
                <span>{{ it.cantidad }}x {{ it.nombre }}</span>
                <span>${{ (it.precioVenta * it.cantidad).toFixed(2) }}</span>
              </div>
              <div v-if="requiereDelivery" class="sum-it-row">
                <span>Servicio de Delivery</span>
                <span>${{ deliveryCost.toFixed(2) }}</span>
              </div>
            </div>
            <div class="sum-total-row"><span>Total a Pagar</span><span class="sum-final-usd">${{ finalTotalUSD.toFixed(2) }}</span></div>
          </div>

          <div class="checkout-actions-col">
            <div class="multi-pago-section">
              <p class="metodo-label">MÉTODO DE PAGO</p>
              <div class="grid-pagos-v2">
                <button v-for="met in metodosDisponibles" :key="met.id" class="pago-btn-item" :class="{ active: metodoPago === met.id }" @click="metodoPago = met.id">
                  <span class="pago-icon-v2">{{ met.icon }}</span>
                  {{ met.nombre }}
                </button>
              </div>
            </div>

            <!-- DETALLES BANCARIOS DINÁMICOS -->
            <div v-if="metodoPago === 1" class="bank-details-card slide-down">
               <h6>Datos de Pago Móvil</h6>
               <p><strong>Banco:</strong> Banesco (0134)</p>
               <p><strong>Teléfono:</strong> 0414-1234567</p>
               <p><strong>RIF:</strong> J-30555666-8</p>
               <p style="margin-top:5px; font-size: 14px; font-weight:900; color:#1e293b;">Monto en Bs: {{ (finalTotalUSD * tasaBCV).toFixed(2) }}</p>
            </div>
            
            <div v-if="metodoPago === 3" class="bank-details-card slide-down">
               <h6>Datos de Zelle</h6>
               <p><strong>Correo:</strong> pagos@wateriujo.com</p>
               <p><strong>Titular:</strong> Water Iujo LLC</p>
               <p><strong>Monto a enviar:</strong> ${{ finalTotalUSD.toFixed(2) }}</p>
            </div>

            <div v-if="metodoPago === 4" class="bank-details-card slide-down">
               <h6>Datos de Transferencia</h6>
               <p><strong>Banco:</strong> Mercantil (0105)</p>
               <p><strong>Cuenta:</strong> 0105 0000 0000 0000 0000</p>
               <p><strong>Titular:</strong> Inversiones Water Iujo CA</p>
               <p><strong>RIF:</strong> J-30555666-8</p>
               <p style="margin-top:5px; font-size: 14px; font-weight:900; color:#1e293b;">Monto en Bs: {{ (finalTotalUSD * tasaBCV).toFixed(2) }}</p>
            </div>
            
            <div v-if="metodoPago === 2" class="bank-details-card warning-bg slide-down">
               <h6>Pago en Efectivo (Divisas)</h6>
               <p>Se te pedirá verificar que tus billetes se encuentran en <strong>buen estado</strong> (sin roturas ni rayones) para ser aceptados por nuestro conductor.</p>
            </div>

            <div v-if="metodoPago" class="upload-checkout-area fade-in">
              <p class="upload-label">{{ metodoPago === 2 ? 'Toma y Sube la foto del billete' : 'Sube tu comprobante de pago' }}</p>

              <div v-if="previewImagenPago" style="margin-top: 15px; text-align: center;">
                <img :src="previewImagenPago" style="max-height: 150px; border-radius: 12px; border: 2px solid #3b82f6; box-shadow: 0 4px 10px rgba(0,0,0,0.1);" />
                <button @click="removerImagen" style="display: block; margin: 10px auto 0; background: none; border: none; color: #ef4444; font-size: 13px; font-weight: 800; cursor: pointer; text-decoration: underline;">✕ Cambiar comprobante</button>
              </div>

              <div v-else class="upload-trigger-v2" @click="fileInput?.click()">
                <span>{{ metodoPago === 2 ? '📸 Tocar aquí para abrir cámara/galería' : '📸 Haz clic para buscar la captura de tu pago' }}</span>
              </div>

              <!-- El atributo 'capture' permite acceder más rápido a la cámara en el móvil -->
              <input type="file" ref="fileInput" hidden accept="image/*" :capture="metodoPago === 2 ? 'environment' : undefined" @change="handleFileUpload" />
            </div>

            <div class="checkout-final-btn-row">
              <button class="btn-confirm-final" :disabled="procesando || !metodoPago || !imagenPago" @click="confirmarPedido">
                {{ procesando ? 'Procesando...' : 'Confirmar y Pagar' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL DE ÉXITO -->
    <div v-if="showExito" class="modal-v2-overlay">
      <div v-if="datosUltimoPedido" class="modal-ticket-container anim-bounce no-print-bg">
        <header class="modal-v2-header no-print">
          <h3 style="flex: 1">¡Pedido Confirmado!</h3>
          <button class="btn-close-v2" @click="showExito = false">✕</button>
        </header>
        <TicketPos :factura="datosUltimoPedido" />
        <div class="acciones-factura no-print">
          <button class="btn-imprimir-ticket" @click="imprimirFactura">🖨️ Imprimir</button>
          <button class="btn-cerrar-ticket" @click="showExito = false">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, shallowRef } from 'vue';
import { useRouter } from 'vue-router';
import { useSistemaStore } from '../stores/sistema';
import TicketPos from '../components/TicketPos.vue';
import { listaProductosInventario, metodosDisponibles } from '../data/mockData';

declare const L: any;



interface Producto {
  id: string;
  nombre: string;
  tipo: string;
  stock: number;
  minimo: number;
  precioCompra: number;
  precioVenta: number;
  colorTipo: string;
  esServicio: boolean;
}

interface ItemCarrito extends Producto {
  cantidad: number;
}



const router = useRouter();
const store = useSistemaStore();
const fileInput = ref<HTMLInputElement | null>(null);

const busqueda = ref('');
const tabActiva = ref('catalogo');
const carrito = ref<ItemCarrito[]>([]);
const requiereDelivery = ref(false);
const showCheckout = ref(false);
const showExito = ref(false);
const procesando = ref(false);
const datosUltimoPedido = ref<any>(null);
const notaDelivery = ref('');
const metodoPago = ref<number | null>(null);
const imagenPago = ref<File | null>(null);
const previewImagenPago = ref<string | null>(null);

const handleFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0] as File;
    imagenPago.value = file;
    const reader = new FileReader();
    reader.onload = (ev) => {
      previewImagenPago.value = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const removerImagen = () => {
  imagenPago.value = null;
  previewImagenPago.value = null;
  if (fileInput.value) fileInput.value.value = '';
};

const deliveryCost = ref(1.50);
const direccionDelivery = ref('');

const usarDireccionPerfil = ref(false);

watch(usarDireccionPerfil, (val) => {
  if (val && store.perfilUsuario && store.perfilUsuario.direccion) {
    const lastIdx = destinosYummy.value.length - 1;
    if (destinosYummy.value[lastIdx]) {
      destinosYummy.value[lastIdx].direccion = store.perfilUsuario.direccion;
      buscarSugerenciasDestino(lastIdx);
    }
  }
});

const historialReal = computed(() => {
  const entregasCliente = store.listaEntregas.filter((e: any) => e.origen === 'cliente').map((e: any) => ({
    id: e.id,
    fecha: 'Hoy',
    items: [],
    detalleFormateado: e.detalle,
    total: e.totalUSD,
    estado: e.estatus,
    statusClass: e.estatus === 'Entregado' ? 'status-done' : 'status-moving',
    entrega: { direccion: e.direccion },
    mensajes: e.mensajes || []
  }));

  const pendientesVeb = store.pedidosPendientes.filter((p: any) => p.origen === 'cliente').map((p: any) => ({
    id: p.id,
    fecha: 'Hace un momento',
    items: [],
    detalleFormateado: p.items.map((i:any)=>`${i.cantidad}x ${i.nombre}`).join(', '),
    total: p.monto,
    estado: 'Validando Pago...',
    statusClass: 'status-pending-verification',
    entrega: p.delivery ? { direccion: p.delivery.direccion } : null,
    mensajes: []
  }));

  return [...pendientesVeb, ...entregasCliente];
});

const nuevoMensajeCliente = ref('');
const enviarMensajeCliente = (id: number | string) => {
  if (!nuevoMensajeCliente.value.trim()) return;
  store.agregarMensajeChat(id, { de: 'cliente', texto: nuevoMensajeCliente.value });
  nuevoMensajeCliente.value = '';
};

const tasaBCV = computed(() => store.tasaBCV);

const productosFiltrados = computed(() => {
  const t = busqueda.value.toLowerCase().trim();
  const inventario = (listaProductosInventario as unknown as Producto[]);
  if (!t) return inventario;
  return inventario.filter(p => p.nombre.toLowerCase().includes(t));
});

const totalItems = computed(() => carrito.value.reduce((s, i) => s + i.cantidad, 0));
const subtotalUSD = computed(() => carrito.value.reduce((s, i) => s + (i.precioVenta * i.cantidad), 0));
const finalTotalUSD = computed(() => subtotalUSD.value + (requiereDelivery.value ? deliveryCost.value : 0));

// RECURSOS YUMMY MAP MULTI-STOP (CLIENTE)
const leafletMapYummy = shallowRef<any>(null);
const markerOrigen = shallowRef<any>(null);
const markersDestinos = shallowRef<any[]>([]); // Array of markers for multi stops
const polylineYummy = shallowRef<any>(null);

const distanciaKms = ref(0);
const sugerenciasOrigen = shallowRef<any[]>([]);
const sugerenciasDestinos = ref<Record<number, any[]>>({});
let timerBusqueda: any = null;

const direccionOrigen = ref('Ubicando GPS...');
const coordOrigen = shallowRef<any>([10.067, -69.333]);
const destinosYummy = ref<{id: number, direccion: string, lat: number | null, lng: number | null}[]>([
  { id: Date.now(), direccion: '', lat: null, lng: null }
]);

const initYummyMap = () => {
  if (leafletMapYummy.value) return; 
  const mapEl = document.getElementById('mapa-yummy-cliente');
  if(!mapEl || typeof L === 'undefined') return;

  const map = L.map('mapa-yummy-cliente', { zoomControl: false }).setView(coordOrigen.value, 15);
  leafletMapYummy.value = map;
  
  L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20
  }).addTo(map);

  const iconOrigen = L.divIcon({
    className: 'yummy-marker-o-pos',
    html: `<div style="background:#1e293b; width:16px; height:16px; border-radius:50%; border:3px solid white; box-shadow:0 0 10px rgba(0,0,0,0.3)"></div>`,
    iconSize: [20,20], iconAnchor: [10,10]
  });
  markerOrigen.value = L.marker(coordOrigen.value, { icon: iconOrigen }).addTo(map);

  map.on('click', (e: any) => {
    fijarPuntoEnMapa(e.latlng.lat, e.latlng.lng);
  });
  
  obtenerGPSOrigen();
};

const obtenerGPSOrigen = () => {
  if (navigator.geolocation) {
    direccionOrigen.value = 'Ubicando GPS...';
    navigator.geolocation.getCurrentPosition((pos: any) => {
      coordOrigen.value = [pos.coords.latitude, pos.coords.longitude];
      if (markerOrigen.value) markerOrigen.value.setLatLng(coordOrigen.value);
      if (leafletMapYummy.value) leafletMapYummy.value.setView(coordOrigen.value, 16);
      
      fetch(`https://photon.komoot.io/reverse?lon=${coordOrigen.value[1]}&lat=${coordOrigen.value[0]}`)
      .then(r=>r.json()).then(d=>{
        if(d.features && d.features.length>0) {
          direccionOrigen.value = d.features[0].properties.name || d.features[0].properties.street || 'Ubicación actual detectada';
        } else {
          direccionOrigen.value = 'Mi ubicación por GPS';
        }
      });
      calcularRutaFinal();
    }, () => {
      direccionOrigen.value = 'Water Iujo - Principal';
      coordOrigen.value = [10.067, -69.333];
    });
  }
};

const buscarSugerencias = (esOrigen: boolean) => {
  if (!esOrigen) return; // Destino uses buscarSugerenciasDestino
  clearTimeout(timerBusqueda);
  sugerenciasOrigen.value = [];
  if(direccionOrigen.value.length < 3) return;

  timerBusqueda = setTimeout(async () => {
    try {
      const q = encodeURIComponent(direccionOrigen.value);
      const res = await fetch(`https://photon.komoot.io/api/?q=${q}&limit=5&lat=${coordOrigen.value[0]}&lon=${coordOrigen.value[1]}`);
      const data = await res.json();
      if(data && data.features) {
        sugerenciasOrigen.value = data.features.map((f: any) => ({
          display_name: [f.properties.name, f.properties.street, f.properties.city].filter(Boolean).join(', '),
          lat: f.geometry.coordinates[1],
          lng: f.geometry.coordinates[0]
        })).filter((s: any) => s.display_name && s.lat);
      }
    } catch(e) {}
  }, 400);
};

const buscarSugerenciasDestino = (index: number) => {
  clearTimeout(timerBusqueda);
  sugerenciasDestinos.value[index] = [];
  const dest = destinosYummy.value[index];
  if(!dest) return;
  const texto = dest.direccion;
  if(texto.length < 3) return;

  timerBusqueda = setTimeout(async () => {
    try {
      const q = encodeURIComponent(texto);
      const res = await fetch(`https://photon.komoot.io/api/?q=${q}&limit=5&lat=${coordOrigen.value[0]}&lon=${coordOrigen.value[1]}`);
      const data = await res.json();
      if(data && data.features) {
        sugerenciasDestinos.value[index] = data.features.map((f: any) => ({
          display_name: [f.properties.name, f.properties.street, f.properties.city].filter(Boolean).join(', '),
          lat: f.geometry.coordinates[1],
          lng: f.geometry.coordinates[0]
        })).filter((s: any) => s.display_name && s.lat);
      }
    } catch(e) {}
  }, 400);
};

const seleccionarOrigen = (sug: any) => {
  sugerenciasOrigen.value = [];
  direccionOrigen.value = sug.display_name;
  coordOrigen.value = [sug.lat, sug.lng];
  if (markerOrigen.value) markerOrigen.value.setLatLng(coordOrigen.value);
  if (leafletMapYummy.value) leafletMapYummy.value.setView(coordOrigen.value, 16);
  calcularRutaFinal();
};

const seleccionarDestino = (index: number, sug: any) => {
  sugerenciasDestinos.value[index] = [];
  const dest = destinosYummy.value[index];
  if(dest) {
    dest.direccion = sug.display_name;
    dest.lat = sug.lat;
    dest.lng = sug.lng;
  }
  actualizarMarcadoresDestino();
  calcularRutaFinal();
};

const agregarDestino = () => {
  destinosYummy.value.push({ id: Date.now(), direccion: '', lat: null, lng: null });
  actualizarMarcadoresDestino();
  calcularRutaFinal();
};

const eliminarDestino = (index: number) => {
  destinosYummy.value.splice(index, 1);
  sugerenciasDestinos.value[index] = [];
  actualizarMarcadoresDestino();
  calcularRutaFinal();
};

const actualizarMarcadoresDestino = () => {
  if (!leafletMapYummy.value || typeof L === 'undefined') return;

  // Limpiar
  markersDestinos.value.forEach(m => leafletMapYummy.value.removeLayer(m));
  markersDestinos.value = [];

  destinosYummy.value.forEach((d, idx) => {
    if (d.lat && d.lng) {
      const isFinal = idx === destinosYummy.value.length - 1;
      const color = isFinal ? '#00d26a' : '#3b82f6';
      const iconDest = L.divIcon({
        className: 'yummy-marker-d-pos',
        html: `<div style="background:${color}; width:16px; height:16px; border-radius:50%; border:3px solid white; box-shadow:0 0 10px rgba(0,0,0,0.3)"></div>`,
        iconSize: [20,20], iconAnchor: [10,10]
      });
      const m = L.marker([d.lat, d.lng], { icon: iconDest }).addTo(leafletMapYummy.value);
      markersDestinos.value.push(m);
    }
  });
};

const fijarPuntoEnMapa = (lat: number, lng: number) => {
  // Encuentra la última parada vacía o crea una nueva
  let idx = destinosYummy.value.findIndex(d => !d.lat || !d.lng);
  if (idx === -1) {
    destinosYummy.value.push({ id: Date.now(), direccion: 'Ubicación en mapa', lat, lng });
    idx = destinosYummy.value.length - 1;
  } else {
    const dest = destinosYummy.value[idx];
    if(dest) {
      dest.lat = lat;
      dest.lng = lng;
      dest.direccion = 'Ubicación seleccionada en mapa';
    }
  }

  actualizarMarcadoresDestino();
  calcularRutaFinal();

  fetch(`https://photon.komoot.io/reverse?lon=${lng}&lat=${lat}`)
    .then(r=>r.json())
    .then(d=>{
      if(d.features && d.features.length>0) {
        const dest = destinosYummy.value[idx];
        if(dest) {
          dest.direccion = [d.features[0].properties.name, d.features[0].properties.street].filter(Boolean).join(', ') || 'Ubicación en mapa';
        }
      }
    });
};

const calcularRutaFinal = () => {
  if (!coordOrigen.value || !leafletMapYummy.value || typeof L === 'undefined') return;

  const validStops = destinosYummy.value.filter(d => d.lat && d.lng);
  
  if (validStops.length === 0) {
    distanciaKms.value = 0;
    deliveryCost.value = 1.5;
    if(polylineYummy.value) leafletMapYummy.value.removeLayer(polylineYummy.value);
    direccionDelivery.value = '';
    return;
  }

  // Concatenar direcciones para la orden en direccionDelivery
  direccionDelivery.value = validStops.map(d => d.direccion).join(' → ');

  const coordsString = [coordOrigen.value, ...validStops.map(d => [d.lat, d.lng])]
    .map((c: any) => `${c[1]},${c[0]}`)
    .join(';');

  fetch(`https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`)
    .then(r=>r.json())
    .then(data => {
      if(data && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        distanciaKms.value = route.distance / 1000;
        
        let calcCosto = 1.5;
        // Costo base por KM extra + base stops (Ej 1.0)
        if(distanciaKms.value > 1.5) {
          calcCosto += (distanciaKms.value - 1.5) * 0.5;
        }
        // $0.5 extra por cada parada adicional
        if (validStops.length > 1) {
           calcCosto += (validStops.length - 1) * 0.5;
        }
        
        deliveryCost.value = parseFloat(calcCosto.toFixed(2));

        if(polylineYummy.value) {
          leafletMapYummy.value.removeLayer(polylineYummy.value);
        }
        const coords = route.geometry.coordinates.map((c: any) => [c[1], c[0]]);
        polylineYummy.value = L.polyline(coords, { color: '#00d26a', weight: 4, opacity: 0.9 }).addTo(leafletMapYummy.value);
        leafletMapYummy.value.fitBounds(polylineYummy.value.getBounds(), { padding: [30,30] });
      }
    });
};

watch(requiereDelivery, (val) => {
  if (val) {
    nextTick(() => {
      initYummyMap();
    });
  } else {
    if (leafletMapYummy.value) {
      leafletMapYummy.value.remove();
      leafletMapYummy.value = null;
      polylineYummy.value = null;
      markersDestinos.value = [];
      markerOrigen.value = null;
    }
    distanciaKms.value = 0;
    deliveryCost.value = 1.50;
    destinosYummy.value = [{ id: Date.now(), direccion: '', lat: null, lng: null }];
    direccionDelivery.value = '';
    sugerenciasDestinos.value = {};
    sugerenciasOrigen.value = [];
  }
});



const cerrarSesion = async () => {
  await store.logout();
  router.push('/login');
};

const abrirCheckout = () => {
  showCheckout.value = true;
  metodoPago.value = null;
  imagenPago.value = null;
};

const agregarAlCarrito = (prod: Producto) => {
  const item = carrito.value.find(i => i.id === prod.id);
  if (item) {
    item.cantidad++;
  } else {
    carrito.value.push({ ...prod, cantidad: 1 });
  }
};

const eliminarDelCarrito = (idx: number) => {
  carrito.value.splice(idx, 1);
};

const ajustarCantidad = (idx: number, delta: number) => {
  const item = carrito.value[idx];
  if (!item) return;
  const n = item.cantidad + delta;
  if (n > 0) {
    item.cantidad = n;
  } else {
    eliminarDelCarrito(idx);
  }
};

const confirmarPedido = () => {
  procesando.value = true;
  setTimeout(() => {
    const met = metodosDisponibles.find(m => m.id === metodoPago.value);
    
    const nuevoIdPedido = 'W-' + Math.floor(Math.random() * 1000);
    
    const pedidoAStore = {
      id: nuevoIdPedido,
      fecha: new Date().toISOString(),
      cliente: 'Cliente Web',
      rif: 'V-00000000',
      telefono: '0412-0000000',
      monto: finalTotalUSD.value,
      metodo: met ? met.nombre : 'No especificado',
      origen: 'cliente',
      items: [...carrito.value],
      delivery: requiereDelivery.value ? { costo: deliveryCost.value, direccion: direccionDelivery.value || 'N/A' } : null,
      imagenPago: previewImagenPago.value || null
    };

    store.agregarPedidoPendiente(pedidoAStore);

    datosUltimoPedido.value = {
      numero: nuevoIdPedido,
      fecha: new Date().toLocaleDateString(),
      cliente: { nombre: 'Cliente Web', rif: 'V-00000000' },
      items: [...carrito.value],
      subtotalUSD: subtotalUSD.value,
      totalUSD: finalTotalUSD.value,
      metodoPago: met ? met.nombre : 'No especificado',
      delivery: requiereDelivery.value ? { costo: deliveryCost.value, direccion: direccionDelivery.value || 'N/A' } : null
    };
    procesando.value = false;
    showCheckout.value = false;
    showExito.value = true;
    carrito.value = [];
  }, 1500);
};

const imprimirFactura = () => window.print();


</script>

<style scoped>
/* [ESTILOS] Reglas CSS exclusivas de esta vista (scoped) para evitar colisiones globales. */

/* Estilos simplificados y premium */
.cliente-layout { background: #f8fafc; min-height: 100vh; font-family: 'Inter', sans-serif; }
.navbar-cliente-premium { background: white; padding: 15px 40px; border-bottom: 1px solid #e2e8f0; position: sticky; top: 0; z-index: 100; }
.navbar-content { display: flex; justify-content: space-between; align-items: center; max-width: 1400px; margin: 0 auto; }
.logo-area-v2 { display: flex; align-items: center; gap: 12px; }
.icono-gota-bg-premium { width: 40px; height: 40px; background: #3b82f6; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; }
.brand-name-v2 { font-weight: 800; font-size: 18px; color: #1e293b; }
.brand-sub-v2 { font-size: 10px; color: #64748b; display: block; }

.main-container-v2 { display: flex; gap: 30px; padding: 30px 40px; max-width: 1400px; margin: 0 auto; height: calc(100vh - 80px); }
.left-panel { flex: 1; overflow-y: auto; padding-right: 10px; }
.right-panel { width: 400px; flex-shrink: 0; }

.card-prod-v2 { background: white; border-radius: 20px; padding: 20px; border: 1px solid #e2e8f0; transition: 0.3s; cursor: pointer; position: relative; }
.card-prod-v2:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.05); border-color: #3b82f6; }
.btn-add-v2 { position: absolute; bottom: 20px; right: 20px; width: 40px; height: 40px; border-radius: 50%; background: #3b82f6; color: white; border: none; font-size: 24px; cursor: pointer; }

.products-container-v2 { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }

.seccion-carrito-pos { background: white; border-radius: 24px; padding: 25px; height: 100%; display: flex; flex-direction: column; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(0,0,0,0.03); }
.cart-module-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
.cart-module-count { background: #eff6ff; color: #3b82f6; padding: 4px 12px; border-radius: 20px; font-weight: 800; font-size: 12px; }

.footer-carrito-pos { margin-top: auto; border-top: 1px dashed #e2e8f0; padding-top: 20px; }
.fila-resumen { display: flex; justify-content: space-between; margin-bottom: 10px; color: #64748b; font-weight: 600; font-size: 14px; }
.fila-resumen-total { display: flex; justify-content: space-between; margin: 15px 0; border-top: 1px solid #f1f5f9; padding-top: 15px; }
.usd-grande { font-size: 24px; font-weight: 900; color: #1e293b; }

.btn-checkout-v2 { width: 100%; background: #3b82f6; color: white; border: none; padding: 18px; border-radius: 16px; font-weight: 800; font-size: 16px; cursor: pointer; transition: 0.3s; box-shadow: 0 8px 20px rgba(59,130,246,0.3); }
.btn-checkout-v2:disabled { background: #cbd5e1; cursor: not-allowed; box-shadow: none; }

.modal-v2-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.modal-v2-content { background: white; border-radius: 32px; width: 100%; max-width: 900px; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.25); }
.checkout-process-grid { display: grid; grid-template-columns: 350px 1fr; }
.checkout-summary-mini { background: #f8fafc; padding: 40px; border-right: 1px solid #e2e8f0; }
.checkout-actions-col { padding: 40px; }

.grid-pagos-v2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 15px; }
.pago-btn-item { padding: 15px; border: 2px solid #f1f5f9; border-radius: 16px; background: white; cursor: pointer; transition: 0.3s; display: flex; flex-direction: column; align-items: center; gap: 8px; font-weight: 700; color: #64748b; }
.pago-btn-item.active { border-color: #3b82f6; background: #eff6ff; color: #3b82f6; }

.btn-confirm-final { width: 100%; background: #10b981; color: white; border: none; padding: 20px; border-radius: 20px; font-weight: 800; font-size: 18px; margin-top: 30px; cursor: pointer; transition: 0.3s; }
.btn-confirm-final:disabled { background: #94a3b8; }

.leaflet-map-frame-v2 { height: 200px; border-radius: 20px; overflow: hidden; margin-top: 15px; border: 1px solid #e2e8f0; }

/* Otros estilos necesarios... */
.switch { position: relative; display: inline-block; width: 44px; height: 24px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; transition: .4s; border-radius: 34px; }
.slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
input:checked + .slider { background-color: #3b82f6; }
input:checked + .slider:before { transform: translateX(20px); }

.upload-trigger-v2 { border: 2px dashed #cbd5e1; padding: 20px; border-radius: 16px; text-align: center; cursor: pointer; transition: 0.3s; margin-top: 20px; }
.upload-trigger-v2:hover { border-color: #3b82f6; background: #eff6ff; }

/* HISTORIAL Y LIVE TRACKING */
.history-card-v2 {
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);
}
.history-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f8fafc;
}
.hist-id { font-weight: 800; color: #1e293b; font-size: 16px; margin-right: 10px; }
.hist-date { font-size: 12px; color: #94a3b8; }
.hist-status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.status-moving { background: #eff6ff; color: #3b82f6; box-shadow: 0 0 10px rgba(59,130,246,0.2); }
.status-done { background: #ecfdf5; color: #10b981; }
.status-pending-verification { background: #fffbeb; color: #d97706; box-shadow: 0 0 10px rgba(217, 119, 6, 0.2); border: 1px solid #fcd34d; }

.history-card-body { display: flex; justify-content: space-between; align-items: flex-end; }
.hist-items p { font-size: 14px; color: #475569; margin: 4px 0; }
.total-val { font-size: 18px; font-weight: 900; color: #1e293b; }

.history-card-footer {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #f8fafc;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tracking-text p { font-size: 13px; font-weight: 600; color: #64748b; margin: 0; }
.btn-track-order {
  background: white;
  border: 1px solid #3b82f6;
  color: #3b82f6;
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
}

.tracking-map-frame {
  height: 250px;
  border-radius: 16px;
  margin-top: 15px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

/* ROUTE BUILDER DERECHO */
.route-builder { margin-bottom: 20px; }
.route-step { display: flex; gap: 12px; margin-bottom: 8px; }
.step-icon-col { display: flex; flex-direction: column; align-items: center; width: 20px; }
.dot-blue { width: 12px; height: 12px; background: #3b82f6; border-radius: 50%; border: 3px solid #eff6ff; }
.dot-purple { width: 12px; height: 12px; background: #a855f7; border-radius: 50%; border: 3px solid #f5f3ff; }
.line-path { width: 2px; flex: 1; background: #e2e8f0; margin: 4px 0; }
.step-input-col { flex: 1; }
.step-order-label { font-size: 10px; font-weight: 800; text-transform: uppercase; margin-bottom: 2px; color: #94a3b8; }
.address-fixed { font-size: 13px; font-weight: 600; color: #1e293b; padding: 4px 0; }
.input-with-action input {
  width: 100%;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  outline: none;
}
.sugerencias-overlay {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  margin-top: 5px;
  max-height: 150px;
  overflow-y: auto;
  position: absolute;
  width: 250px;
  z-index: 50;
}
.sug-item-m { padding: 10px; font-size: 12px; border-bottom: 1px solid #f1f5f9; cursor: pointer; }
.sug-item-m:hover { background: #eff6ff; color: #3b82f6; }

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
  100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
}
.pulse-active { animation: pulse 2s infinite; }

/* YUMMY UI STYLES */
.yummy-delivery-wrapper {
  margin-top: 15px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.06);
  border: 1px solid #f1f5f9;
  flex-shrink: 0;
  z-index: 5;
  position: relative;
}
.yummy-card { display: flex; flex-direction: column; }
.yummy-header {
  background: #f8fafc;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #e2e8f0;
}
.yummy-icon { font-size: 24px; }
.yummy-header h4 { margin: 0; font-weight: 800; color: #1e293b; font-size: 16px; }

.yummy-inputs { padding: 20px; position: relative; }
.yummy-input-row { display: flex; align-items: center; gap: 15px; position: relative; }
.origin-dot { width: 12px; height: 12px; border-radius: 50%; background: #1e293b; border: 3px solid #e2e8f0; z-index: 2; }
.dest-dot { width: 12px; height: 12px; border-radius: 50%; background: #00d26a; border: 3px solid #ccf6e1; z-index: 2; }
.yummy-line { position: absolute; left: 5px; top: 15px; bottom: -20px; width: 2px; background: #e2e8f0; z-index: 1; margin-left:1px; }
.y-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.y-info .y-label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; }
.y-info .y-value { font-size: 14px; font-weight: 700; color: #1e293b; }
.input-with-gps { display: flex; gap: 8px; width: 100%; }
.y-styled-input { flex: 1; border: none; background: #f8fafc; padding: 12px 15px; border-radius: 12px; font-size: 14px; color: #1e293b; font-weight: 600; outline: none; border: 1px solid transparent; transition: 0.3s; }
.y-styled-input:focus { border-color: #00d26a; background: white; box-shadow: 0 0 0 4px rgba(0,210,106,0.1); }
.btn-gps-locate { background: #f1f5f9; border: none; width: 42px; height: 42px; border-radius: 12px; font-size: 18px; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; color: #3b82f6; }
.btn-gps-locate:hover { background: #e2e8f0; transform: scale(1.05); }

.dest { margin-top: 20px; }

.sugerencias-yummy { position: absolute; top: 100%; left: 40px; right: 20px; background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; z-index: 50; overflow: hidden; margin-top: 5px; }
.sug-yummy-item { padding: 12px 15px; font-size: 13px; font-weight: 600; color: #475569; cursor: pointer; border-bottom: 1px solid #f1f5f9; }
.sug-yummy-item:hover { background: #f8fafc; color: #00d26a; }
.sug-yummy-item:last-child { border-bottom: none; }

.yummy-map-container { padding: 0 20px 20px; }
.yummy-map { height: 180px; width: 100%; border-radius: 16px; background: #e2e8f0; z-index: 10; }

.yummy-footer-calc {
  background: #1e293b;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}
.y-dist { display: flex; flex-direction: column; }
.y-dist-lbl, .y-cost-lbl { font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; }
.y-dist-val { font-size: 16px; font-weight: 700; color: white; }
.y-cost { display: flex; flex-direction: column; align-items: flex-end; }
.y-cost-val { font-size: 20px; font-weight: 800; color: #00d26a; }

.btn-remove-dest { background: #fee2e2; border: none; width: 42px; height: 42px; border-radius: 12px; font-size: 16px; cursor: pointer; color: #ef4444; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
.btn-remove-dest:hover { background: #fca5a5; }
.yummy-add-dest { padding: 10px 0 10px 30px; }
.btn-add-dest { background: none; border: none; font-size: 13px; font-weight: 700; color: #3b82f6; cursor: pointer; padding: 5px 10px; border-radius: 8px; transition: 0.2s; }
.btn-add-dest:hover { background: #eff6ff; }

/* ADDED PREMIUM STYLES */
.welcome-banner {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  border-radius: 24px;
  padding: 35px 45px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  margin-bottom: 30px;
  box-shadow: 0 15px 35px -10px rgba(59, 130, 246, 0.4);
}
.welcome-text h2 { margin: 0 0 10px 0; font-size: 32px; font-weight: 800; letter-spacing: -0.5px; line-height: 1.1; }
.welcome-text p { margin: 0; opacity: 0.9; font-size: 15px; font-weight: 500; }
.saldo-card-v2 { background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); padding: 18px 25px; border-radius: 16px; display: flex; align-items: center; gap: 15px; border: 1px solid rgba(255,255,255,0.2); }
.saldo-icon { font-size: 32px; }
.saldo-data { display: flex; flex-direction: column; }
.saldo-title { font-size: 12px; opacity: 0.9; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.saldo-amount { font-size: 26px; font-weight: 800; color: white; line-height: 1.2; }

.actions-row-v2 { display: flex; gap: 20px; margin-bottom: 25px; }
.search-box-v2 { flex: 1; display: flex; align-items: center; background: white; padding: 0 20px; border-radius: 18px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.02); transition: 0.3s; }
.search-box-v2:focus-within { border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59,130,246,0.1); }
.search-icon-v2 { font-size: 18px; color: #94a3b8; margin-right: 15px; }
.search-box-v2 input { width: 100%; border: none; outline: none; padding: 18px 0; font-size: 15px; color: #1e293b; font-weight: 500; background: transparent; }
.tasa-v2 { background: white; padding: 0 25px; border-radius: 18px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.02); min-width: 180px; }
.tasa-v2-label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
.tasa-v2-val { font-size: 18px; font-weight: 800; color: #10b981; }

.section-tabs-v2 { display: inline-flex; gap: 5px; margin-bottom: 25px; background: white; padding: 6px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
.tab-btn-v2 { padding: 12px 24px; border-radius: 12px; border: none; background: transparent; color: #64748b; font-weight: 700; font-size: 14px; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 8px; }
.tab-btn-v2:hover { color: #1e293b; background: #f8fafc; }
.tab-btn-v2.active { background: #3b82f6; color: white; box-shadow: 0 4px 12px rgba(59,130,246,0.3); }

.card-prod-tag { position: absolute; top: 18px; right: 18px; padding: 6px 12px; border-radius: 10px; font-size: 10px; font-weight: 800; text-transform: uppercase; background: #f1f5f9; color: #64748b; }
.card-prod-tag.producto { background: #eff6ff; color: #3b82f6; }
.card-prod-tag.servicio { background: #f5f3ff; color: #8b5cf6; }
.card-prod-body { margin-top: 15px; margin-bottom: 25px; }
.card-prod-title { font-size: 18px; font-weight: 800; color: #1e293b; margin: 0 0 8px 0; line-height: 1.2; padding-right: 40px; }
.card-prod-subtitle { font-size: 12px; color: #10b981; font-weight: 700; margin: 0 0 15px 0; }
.price-usd-v2 { font-size: 24px; font-weight: 900; color: #1e293b; line-height: 1; }
.price-bs-v2 { font-size: 13px; color: #94a3b8; font-weight: 700; margin-top: 4px; }

.lista-items-carrito { flex: 1; overflow-y: auto; margin-top: 20px; padding-right: 5px; }
.item-cart-fila { display: flex; flex-direction: column; padding: 18px; border-radius: 16px; border: 1px solid #e2e8f0; margin-bottom: 12px; transition: 0.2s; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.02); }
.item-cart-fila:hover { border-color: #cbd5e1; box-shadow: 0 6px 15px rgba(0,0,0,0.05); transform: translateY(-2px); }
.item-cart-main { font-weight: 800; color: #1e293b; font-size: 15px; margin-bottom: 12px; }
.item-cart-controls-wrapper { display: flex; align-items: center; justify-content: space-between; }
.mini-control-cant { display: flex; align-items: center; background: #f8fafc; border-radius: 10px; padding: 4px; border: 1px solid #e2e8f0; }
.btn-mini-cant { width: 32px; height: 32px; border: none; background: white; border-radius: 8px; font-weight: 900; font-size: 18px; color: #3b82f6; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.04); transition: 0.2s; }
.btn-mini-cant:hover { background: #3b82f6; color: white; }
.val-mini-cant { padding: 0 15px; font-weight: 800; font-size: 15px; color: #1e293b; min-width: 40px; text-align: center; }
.item-cart-precio { font-weight: 900; font-size: 18px; color: #1e3a8a; }
.btn-del { width: 34px; height: 34px; border-radius: 10px; background: #fee2e2; color: #ef4444; border: none; font-weight: 900; font-size: 14px; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
.btn-del:hover { background: #fca5a5; transform: scale(1.05); }

.carrito-vacio-state { text-align: center; color: #94a3b8; padding: 60px 20px; font-weight: 700; font-size: 16px; border: 2px dashed #e2e8f0; border-radius: 16px; margin-top: 20px; }

.navbar-actions-v2 { display: flex; align-items: center; gap: 15px; }
.user-pill { display: flex; align-items: center; gap: 12px; background: #f8fafc; padding: 8px 20px 8px 8px; border-radius: 30px; border: 1px solid #e2e8f0; }
.avatar-circle { width: 40px; height: 40px; background: #3b82f6; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; }
.user-meta { display: flex; flex-direction: column; }
.user-name-v2 { font-size: 14px; font-weight: 800; color: #1e293b; line-height: 1.2; }
.user-badge-online { font-size: 11px; font-weight: 700; color: #10b981; margin-top: 2px;}
.btn-logout-v2 { width: 44px; height: 44px; border-radius: 50%; border: 1px solid #fee2e2; background: #fef2f2; color: #ef4444; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 20px; transition: 0.3s; }
.btn-logout-v2:hover { background: #ef4444; color: white; transform: rotate(15deg) scale(1.05); }

.delivery-toggle-row { display: flex; justify-content: space-between; align-items: center; background: #f8fafc; padding: 15px 20px; border-radius: 16px; border: 1px solid #e2e8f0; margin-bottom: 20px; }
.label-delivery { display: flex; align-items: center; gap: 10px; font-weight: 800; color: #1e293b; font-size: 15px; }
.icono-truck { font-size: 22px; }

/* MODAL DE CHECKOUT MISSING STYLES / CORRECTIONS */
.modal-v2-header { display: flex; justify-content: space-between; align-items: center; padding: 25px 40px; border-bottom: 1px solid #e2e8f0; background: #f8fafc; }
.modal-v2-header h3 { margin: 0; font-size: 22px; font-weight: 800; color: #1e293b; }
.btn-close-v2 { background: #fee2e2; border: none; width: 36px; height: 36px; border-radius: 50%; color: #ef4444; font-size: 18px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
.btn-close-v2:hover { background: #fca5a5; transform: scale(1.1); }

.checkout-summary-mini h4 { margin: 0 0 20px 0; font-size: 18px; font-weight: 800; color: #1e293b; padding-bottom: 15px; border-bottom: 2px dashed #cbd5e1; }
.summary-it-list { display: flex; flex-direction: column; gap: 15px; margin-bottom: 25px; }
.sum-it-row { display: flex; justify-content: space-between; align-items: flex-start; font-size: 14px; font-weight: 600; color: #475569; position: relative; }
.sum-it-row::after { content: ""; position: absolute; bottom: -5px; left: 0; right: 0; border-bottom: 1px dotted #e2e8f0; }
.sum-total-row { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding-top: 20px; border-top: 2px solid #cbd5e1; font-weight: 800; font-size: 16px; color: #1e293b; }
.sum-final-usd { font-size: 24px; color: #10b981; }

.multi-pago-section .metodo-label { font-size: 11px; font-weight: 800; color: #64748b; letter-spacing: 1px; margin-bottom: 15px; }
.upload-checkout-area { margin-top: 25px; padding-top: 25px; border-top: 1px dashed #cbd5e1; }
.upload-label { font-size: 13px; font-weight: 700; color: #1e293b; margin: 0 0 10px 0; }
.checkout-final-btn-row { margin-top: 30px; }

.bank-details-card { background: #f8fafc; border-radius: 16px; padding: 20px; border: 1px solid #cbd5e1; margin-top: 25px; font-size: 13px; color: #475569; }
.bank-details-card h6 { margin: 0 0 10px 0; font-size: 14px; font-weight: 800; color: #3b82f6; text-transform: uppercase; letter-spacing: 0.5px; }
.bank-details-card p { margin: 4px 0; }
.bank-details-card.warning-bg { background: #fffbeb; border-color: #fcd34d; }
.bank-details-card.warning-bg h6 { color: #d97706; }
.bank-details-card.warning-bg p { color: #92400e; font-weight: 500; font-size: 13px; line-height: 1.4; }
.opcion-direccion-registrada-cliente {
  margin-top: 20px;
  background: #f0fdf4;
  padding: 15px;
  border-radius: 12px;
  border: 1px solid #bbf7d0;
  font-size: 13px;
  color: #166534;
  margin-bottom: 10px;
}
.checkbox-container-v2 {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
  font-weight: 500;
}
.checkbox-container-v2 input { position: absolute; opacity: 0; cursor: pointer; height: 0; width: 0; }
.checkmark-v2 { 
  height: 20px; width: 20px; background-color: #fff; border: 2px solid #10b981; border-radius: 6px; 
  display: inline-block; position: relative; transition: 0.3s;
}
.checkbox-container-v2 input:checked ~ .checkmark-v2 { background-color: #10b981; }
.checkmark-v2:after { content: ""; position: absolute; display: none; left: 6px; top: 2px; width: 5px; height: 10px; border: solid white; border-width: 0 2px 2px 0; transform: rotate(45deg); }
.checkbox-container-v2 input:checked ~ .checkmark-v2:after { display: block; }
</style>