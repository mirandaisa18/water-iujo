<template>
  <div class="app-layout">
    <Sidebar />

    <main class="main-content">
      
      <!-- TASA BCV BANNER -->
      <div v-if="esCajero" class="tasa-bcv-banner">
        <div class="tasa-left-info">
          <span>Tasa BCV</span>
          <span class="valor-tasa">Bs. {{ store.tasaBCV }}</span>
        </div>

        <div class="usuario-rol-badge" @click="router.push('/configuracion')">
          <div class="info-texto-top">
            <span class="nombre-top">{{ nombreRol }}</span>
            <span class="email-top">{{ emailUsuario }}</span>
          </div>
          <div class="avatar-top">👤</div>
        </div>
      </div>

      <header class="page-header header-admin-left" v-if="esAdmin">
        <div class="title-container-left">
          <h2 class="title-admin-left">Operaciones de Venta (Admin)</h2>
          <p class="subtitle-admin-left">Gestiona el punto de venta y monitorea el flujo de caja.</p>
          
          <!-- TABS PARA ADMIN -->
          <div class="tabs-admin-v2 no-print">
            <button class="t-btn" :class="{ activo: tabActivaAdmin === 'pos' }" @click="tabActivaAdmin = 'pos'"><span class="t-icon">🛒</span> Caja POS</button>
            <button class="t-btn" :class="{ activo: tabActivaAdmin === 'dashboard' }" @click="tabActivaAdmin = 'dashboard'"><span class="t-icon">📊</span> Resumen Hoy</button>
            <button class="t-btn" :class="{ activo: tabActivaAdmin === 'config' }" @click="tabActivaAdmin = 'config'"><span class="t-icon">⚙️</span> Ajustes</button>
          </div>
        </div>
        
        <div class="badge-rol-admin" @click="router.push('/configuracion')">
          <div class="info-texto-top">
            <span class="nombre-top">{{ nombreRol }}</span>
            <span class="email-top">{{ emailUsuario }}</span>
          </div>
          <div class="avatar-top">👤</div>
        </div>
      </header>

      <!-- VISTA ADMIN: DASHBOARD -->
      <div v-if="esAdmin && tabActivaAdmin === 'dashboard'" class="vista-admin-dashboard">
        
        <!-- KPIs Premium -->
        <div class="premium-kpi-grid">
          <div class="premium-kpi-card card-blue">
            <div class="kpi-icon-wrapper"><span class="kpi-icon">💰</span></div>
            <div class="kpi-info">
              <span class="kpi-label">Ingresos del Día (USD)</span>
              <h3 class="kpi-value">${{ (ingresosDelDia || 0).toFixed(2) }}</h3>
              <div class="kpi-trend positive">
                <span class="trend-icon">↗</span>
                <span>12.5% más que ayer</span>
              </div>
            </div>
          </div>
          
          <div class="premium-kpi-card card-purple">
            <div class="kpi-icon-wrapper"><span class="kpi-icon">🧾</span></div>
            <div class="kpi-info">
              <span class="kpi-label">Tickets Generados</span>
              <h3 class="kpi-value">{{ ventasDelDia }}</h3>
              <div class="kpi-trend positive">
                <span class="trend-icon">↗</span>
                <span>Flujo constante</span>
              </div>
            </div>
          </div>

          <div class="premium-kpi-card card-orange">
            <div class="kpi-icon-wrapper"><span class="kpi-icon">💳</span></div>
            <div class="kpi-info">
              <span class="kpi-label">Ingresos en Bs.</span>
              <h3 class="kpi-value">Bs. {{ (ingresosDelDia * tasaBCV).toFixed(2) }}</h3>
              <div class="kpi-trend neutral">
                <span class="trend-icon">→</span>
                <span>Tasa: Bs. {{ tasaBCV }}</span>
              </div>
            </div>
          </div>

          <div class="premium-kpi-card card-green">
            <div class="kpi-icon-wrapper"><span class="kpi-icon">💧</span></div>
            <div class="kpi-info">
              <span class="kpi-label">Productividad</span>
              <h3 class="kpi-value">Óptima</h3>
              <div class="kpi-trend positive">
                <span class="trend-icon">↗</span>
                <span>Operaciones en línea</span>
              </div>
            </div>
          </div>
        </div>

        <div class="premium-dashboard-row">
          <!-- Gráfico de Ventas -->
          <div class="premium-chart-card">
            <div class="card-header-flex">
              <h3 class="card-title-premium">Flujo de Ventas (Hoy)</h3>
              <button class="btn-more-options">⋮</button>
            </div>
            <div class="chart-wrapper">
              <svg viewBox="0 0 500 200" class="svg-smooth-chart">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="rgba(59, 130, 246, 0.4)" />
                    <stop offset="100%" stop-color="rgba(59, 130, 246, 0.0)" />
                  </linearGradient>
                </defs>
                <!-- Grid lines -->
                <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" stroke-width="1"/>
                <line x1="0" y1="90" x2="500" y2="90" stroke="#f1f5f9" stroke-width="1"/>
                <line x1="0" y1="140" x2="500" y2="140" stroke="#f1f5f9" stroke-width="1"/>
                <line x1="0" y1="190" x2="500" y2="190" stroke="#f1f5f9" stroke-width="1"/>
                
                <!-- Area path (simulated data) -->
                <path d="M0,190 L0,150 C50,140 80,90 120,110 C160,130 190,70 240,60 C290,50 320,120 370,100 C420,80 460,30 500,40 L500,190 Z" fill="url(#chartGradient)"/>
                
                <!-- Line path -->
                <path d="M0,150 C50,140 80,90 120,110 C160,130 190,70 240,60 C290,50 320,120 370,100 C420,80 460,30 500,40" fill="none" stroke="#3b82f6" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                
                <!-- Data points -->
                <circle cx="120" cy="110" r="5" fill="white" stroke="#3b82f6" stroke-width="2" class="data-point" />
                <circle cx="240" cy="60" r="5" fill="white" stroke="#3b82f6" stroke-width="2" class="data-point" />
                <circle cx="370" cy="100" r="5" fill="white" stroke="#3b82f6" stroke-width="2" class="data-point" />
                <circle cx="500" cy="40" r="5" fill="white" stroke="#3b82f6" stroke-width="2" class="data-point" />
              </svg>
              <div class="chart-x-axis">
                <span>08:00</span>
                <span>10:00</span>
                <span>12:00</span>
                <span>14:00</span>
                <span>16:00</span>
                <span>18:00</span>
              </div>
            </div>
          </div>

          <!-- Últimas Transacciones -->
          <div class="premium-table-card">
            <div class="card-header-flex">
              <h3 class="card-title-premium">Últimas Transacciones</h3>
              <a href="#" class="view-all-link" @click.prevent="showModalTodasTransacciones = true">Ver todas</a>
            </div>
            
            <div v-if="ultimosTickets.length === 0" class="empty-state-tx">
              <span class="empty-icon">🧾</span>
              <p>Aún no hay ventas registradas hoy</p>
            </div>

            <div v-else class="tx-list">
              <div v-for="(t, index) in ultimosTickets" :key="index" class="tx-item" @click="verDetalleTicketAdmin(t)">
                <div class="tx-icon-col">
                  <div class="tx-avatar">
                    {{ t.metodo ? t.metodo.charAt(0) : 'E' }}
                  </div>
                </div>
                <div class="tx-info-col">
                  <span class="tx-id">Ticket #{{ t.id }}</span>
                  <span class="tx-time">{{ t.hora || 'Hace unos minutos' }}</span>
                </div>
                <div class="tx-method-col">
                  <span class="badge-method">{{ t.metodo || 'Efectivo' }}</span>
                </div>
                <div class="tx-amount-col">
                  <span class="tx-amount">+${{ t.monto.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- VISTA ADMIN: CONFIGURACIÓN INTEGRADA -->
      <div v-if="esAdmin && tabActivaAdmin === 'config'" class="vista-admin-dashboard fade-in">
        <div class="premium-dashboard-row">
          <div class="premium-table-card config-card-main" style="flex: 1">
            <div class="tarjeta-header">
              <div class="header-con-icono">
                <span class="icono-seccion naranja">⚙️</span>
                <h3>Ajustes Maestros de Caja</h3>
              </div>
              <p class="card-subtitle-premium">Configura los parámetros críticos de la operación diaria</p>
            </div>
            
            <div class="config-pos-grid-v2">
              <div class="config-item-v2">
                <label>Tasa Cambiaria (USD/BS)</label>
                <div class="input-modern-wrapper">
                  <span class="prefix-icon">💵</span>
                  <input type="number" v-model.number="store.tasaBCV" step="0.01" />
                  <button @click="store.actualizarTasa" class="btn-refresh-tasa">🔄</button>
                </div>
              </div>
              
              <div class="config-item-v2">
                <label>Stock de Alerta</label>
                <div class="input-modern-wrapper">
                  <span class="prefix-icon">📦</span>
                  <input type="number" v-model.number="store.preferenciasPOS.alertaStockBajoVal" />
                </div>
              </div>

              <div class="config-item-v2">
                <label>Próxima Factura #</label>
                <div class="input-modern-wrapper">
                  <span class="prefix-icon">🧾</span>
                  <input type="number" v-model.number="store.proximoNumeroFactura" />
                </div>
              </div>

              <div class="config-item-v2">
                <label>IVA (%)</label>
                <div class="input-modern-wrapper">
                  <span class="prefix-icon">🏦</span>
                  <input type="number" value="16" disabled />
                </div>
              </div>
            </div>

            <div class="config-footer-actions">
              <button class="btn-cancelar-config" @click="tabActivaAdmin = 'dashboard'">Volver</button>
              <button class="btn-guardar-premium" @click="store.persistirTodo">🚀 Guardar Configuración</button>
            </div>
          </div>
        </div>
      </div>

      <!-- EL POS LO VE EL CAJERO O EL ADMIN EN TAB POS -->
      <div v-if="esCajero || (esAdmin && tabActivaAdmin === 'pos')" class="vista-pos" :class="{ 'pos-locked': !clienteSeleccionado }">
        <div v-if="!clienteSeleccionado && carrito.length === 0" class="pos-lock-overlay">
          <div class="lock-card">
            <span class="lock-icon">👤</span>
            <h3>Seleccione un cliente</h3>
            <p>Debe elegir un cliente para comenzar la venta</p>
            <button class="btn-lock-action" @click="abrirSelectorCliente">Abrir Selector</button>
          </div>
        </div>

        <div class="pos-main-container">
          
          <!-- SECCIÓN IZQUIERDA: CATÁLOGO -->
          <div class="seccion-catalogo">
            <div class="controles-busqueda">
              <div class="input-busqueda-wrapper">
                <span class="lupa">🔍</span>
                <input type="text" v-model="busquedaPOS" placeholder="Buscar producto..." />
              </div>
              <select class="select-categoria">
                <option>TODAS</option>
                <option>PRODUCTOS</option>
                <option>SERVICIOS</option>
              </select>
            </div>

            <div class="lista-productos-pos">
              <div v-for="prod in productosFiltradosPOS" :key="prod.id" class="item-producto-fila">
                <div class="info-producto-detalles">
                  <div class="nombre-principal">
                    {{ prod.nombre }}
                    <span v-if="prod.esServicio" class="badge-servicio">Servicio</span>
                  </div>
                  <div class="datos-secundarios">
                    <span class="tag-categoria">{{ prod.tipo }}</span>
                    <span class="tag-stock" v-if="prod.stock">Stock: {{ prod.stock }}</span>
                  </div>
                </div>
                <div class="precios-item">
                  <div class="precio-usd-bold">${{ (prod.precioVenta || 0).toFixed(2) }}</div>
                  <div class="precio-bs-sub">Bs. {{ ((prod.precioVenta || 0) * (tasaBCV || 0)).toFixed(2) }}</div>
                </div>
                
                <button 
                  class="btn-add-circle" 
                  @click="agregarAlCarrito(prod)" 
                  :disabled="!clienteSeleccionado"
                  :title="!clienteSeleccionado ? 'Seleccione un cliente primero' : 'Agregar'"
                >
                  <span>+</span>
                </button>
              </div>
            </div>
          </div>

          <!-- SECCIÓN DERECHA: CARRITO -->
          <div class="seccion-carrito-pos">
            
            <!-- BUSCADOR / REGISTRO DE CLIENTE -->
            <div class="cliente-selector-container">
              <div v-if="!clienteSeleccionado" class="caja-cliente-vacia" @click="abrirSelectorCliente">
                <span class="icono-user-dotted">👤</span>
                <span class="txt-seleccionar">Seleccionar Cliente</span>
              </div>
              <div v-else class="caja-cliente-activa">
                <div class="info-cliente-sel">
                  <span class="icono-user-full">👤</span>
                  <div class="detalles-cli">
                    <span class="nom-cli">{{ clienteSeleccionado.nombre }}</span>
                    <span class="rif-cli">{{ clienteSeleccionado.rif }}</span>
                  </div>
                </div>
                <button class="btn-quitar-cli" @click="clienteSeleccionado = null">✕</button>
              </div>
            </div>

            <div class="delivery-toggle-row">
              <div class="label-delivery">
                <span class="icono-truck">🚚</span>
                <span>Delivery</span>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="delivery">
                <span class="slider round"></span>
              </label>
            </div>

            <!-- YUMMY LOGISTICS UI -->
            <div v-if="delivery" class="yummy-delivery-wrapper slide-down">
              <div v-if="clienteSeleccionado && clienteSeleccionado.direccion" class="opcion-direccion-registrada no-print">
                <label class="checkbox-container-v2">
                  <input type="checkbox" v-model="usarDireccionRegistrada" />
                  <span class="checkmark-v2"></span>
                  Usar dirección registrada: <strong>{{ clienteSeleccionado.direccion }}</strong>
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
                  <div id="mapa-yummy-pos" class="yummy-map"></div>
                </div>

                <div class="yummy-footer-calc">
                  <div class="y-dist">
                    <span class="y-dist-lbl">Ruta Estimada:</span>
                    <span class="y-dist-val">{{ distanciaKms.toFixed(1) }} km</span>
                  </div>
                  <div class="y-cost">
                    <span class="y-cost-lbl">Tarifa Calculada:</span>
                    <span class="y-cost-val">${{ costoDelivery.toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="lista-items-carrito">
              <div v-if="carrito.length === 0" class="carrito-vacio-state">
                <div class="ilustracion-carrito">🛒</div>
                <h4>Carrito vacío</h4>
                <p>Agrega productos del catálogo</p>
              </div>
              
              <div v-for="(item, index) in carrito" :key="index" class="item-cart-fila">
                <div class="item-cart-main">
                  <span class="item-nom">{{ item.nombre }}</span>
                </div>
                
                <div class="item-cart-controls-wrapper">
                  <div class="mini-control-cant">
                    <button class="btn-mini-cant" @click="ajustarCantidadCarrito(index, -1)">-</button>
                    <input type="number" v-model.number="item.cantidad" class="val-mini-cant" min="1">
                    <button class="btn-mini-cant" @click="ajustarCantidadCarrito(index, 1)">+</button>
                  </div>
                  <div class="item-cart-precio">${{ (item.precioVenta * item.cantidad).toFixed(2) }}</div>
                  <button class="btn-del" @click="eliminarDelCarrito(index)">✕</button>
                </div>
              </div>
            </div>

            <div class="footer-carrito-pos">
              <div class="fila-resumen">
                <span>Items totales</span>
                <span>{{ totalItemsCarrito }}</span>
              </div>
              <div class="fila-resumen">
                <span>Subtotal USD</span>
                <span>${{ subTotalUSD.toFixed(2) }}</span>
              </div>
              <div v-if="delivery && costoDelivery > 0" class="fila-resumen fila-delivery-cost">
                <span class="lbl-delivery">
                  🛵 Delivery
                </span>
                <span class="costo-delivery">+ ${{ costoDelivery.toFixed(2) }}</span>
              </div>
              <div class="fila-resumen-total">
                <span>Total USD</span>
                <span class="usd-grande">${{ totalUSD.toFixed(2) }}</span>
              </div>
              <div class="fila-resumen">
                <span>Total Bs</span>
                <span>Bs. {{ totalBS.toFixed(2) }}</span>
              </div>

              <!-- NUEVO: Selector de Método de Pago Elegante -->
              <!-- SECCIÓN DE MULTIPAGO -->
              <div class="multi-pago-section no-print">
                <div class="cabecera-multipago">
                  <span class="metodo-label">MÉTODOS DE PAGO</span>
                  <span v-if="faltanteUSD > 0" class="badge-faltante">Falta: ${{ faltanteUSD.toFixed(2) }}</span>
                  <span v-else class="badge-pagado">¡Total Cubierto!</span>
                </div>

                <div class="lista-pagos-agregados">
                   <div v-for="(pago, idx) in metodosDePago" :key="idx" class="item-pago-agregado">
                      <div class="info-pago-txt">
                        <span class="pago-met">{{ pago.metodo }}</span>
                        <div class="pago-montos">
                          <input type="number" v-model.number="pago.monto" class="input-monto-pago" @input="pago.montoBS = pago.monto * tasaBCV" />
                          <span class="pago-bs">Bs. {{ (pago.monto * tasaBCV).toFixed(2) }}</span>
                        </div>
                      </div>
                      <button class="btn-eliminar-pago" @click="eliminarPago(idx)">✕</button>
                   </div>
                   <div v-if="metodosDePago.length === 0" class="pago-placeholder">
                      Selecciona un método para pagar...
                   </div>
                </div>

                <div class="grid-pagos-v2">
                  <button v-for="(met, k) in ['Efectivo', 'Pago Móvil', 'Zelle', 'Tarjeta', 'Biopago', 'Transferencia']" 
                          :key="k" 
                          class="pago-btn-item" 
                          @click="agregarPago(met)">
                    <span class="pago-icon-v2">{{ met === 'Efectivo' ? '💵' : met === 'Pago Móvil' ? '📱' : met === 'Zelle' ? '🇺🇸' : met === 'Tarjeta' ? '💳' : met === 'Biopago' ? '🪪' : '🏦' }}</span>
                    {{ met }}
                  </button>
                </div>
              </div>

              
              <button class="btn-cobrar-pos" :disabled="carrito.length === 0" @click="procesarPago">
                <span class="icono-pay">🛒</span>
                Cobrar · ${{ totalUSD.toFixed(2) }}
              </button>
            </div>
          </div>

        </div>
      </div>

      <!-- MODAL PARA CLIENTES (Búsqueda y Registro) -->
      <div v-if="showModalCliente" class="super-modal-overlay">
        <div class="modal-cliente-content">
          <div class="modal-header">
            <h3>{{ modoRegistro ? 'Registrar Nuevo Cliente' : 'Buscar Cliente' }}</h3>
            <button class="btn-cerrar-modal" @click="showModalCliente = false">✕</button>
          </div>

          <!-- MODO BÚSQUEDA -->
          <div v-if="!modoRegistro" class="cuerpo-busqueda">
            <div class="input-grande-wrapper">
              <input type="text" v-model="busquedaCliente" placeholder="Nombre o RIF/Cédula..." autofocus />
            </div>
            
            <div class="lista-resultados-clientes">
              <div v-for="cli in clientesFiltrados" :key="cli.rif" class="result-cliente-item" @click="seleccionarCliente(cli)">
                <div class="avatar-cli">👤</div>
                <div class="txts-cli">
                  <strong>{{ cli.nombre }}</strong>
                  <span>{{ cli.rif }}</span>
                </div>
                <button class="btn-check-cli">✓</button>
              </div>

            </div>
            
            <button class="btn-abrir-registro" @click="modoRegistro = true">
              + Registrar Nuevo Cliente
            </button>
          </div>

          <!-- MODO REGISTRO -->
          <div v-else class="cuerpo-registro">
            <div class="form-grid-cli">
              <div class="campo-cli">
                <label>Nombre Completo</label>
                <input type="text" v-model="nuevoCliente.nombre" placeholder="Nombre del cliente" />
              </div>
              <div class="campo-cli">
                <label>RIF / Cédula</label>
                <input type="text" v-model="nuevoCliente.rif" placeholder="V-12345678" />
              </div>
              <div class="campo-cli">
                <label>Teléfono</label>
                <input type="text" v-model="nuevoCliente.telefono" placeholder="0412-0000000" />
              </div>
              <div class="campo-cli">
                <label>Dirección</label>
                <input type="text" v-model="nuevoCliente.direccion" placeholder="Ej: San Bernardino" />
              </div>
            </div>
            <div class="acciones-registro">
              <button class="btn-volver-busqueda" @click="modoRegistro = false">Volver a buscar</button>
              <button class="btn-guardar-cli" @click="guardarNuevoCliente">Guardar y Seleccionar</button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- ZONA DE MODALES GLOBALES (Aislados para impresión) -->
    <!-- MODAL DE FACTURA / TICKET -->
    <div v-if="showFacturaModal" class="super-modal-overlay modal-print-active">
        <div v-if="datosFactura" class="modal-ticket-container">
          <TicketPos :factura="datosFactura" />
          
          <div class="acciones-factura no-print">
            <button class="btn-imprimir-ticket" @click="imprimirFactura">🖨️ Imprimir Factura</button>
            <button class="btn-cerrar-ticket" @click="finalizarVenta">Cerrar y Nueva Venta</button>
          </div>
        </div>
      </div>

      <!-- MODAL TODAS LAS TRANSACCIONES (ADMIN) -->
      <div v-if="showModalTodasTransacciones" class="super-modal-overlay no-print">
        <div class="modal-cliente-content modal-tx-lista">
          <div class="modal-header">
            <h3>Todas las Transacciones (Hoy)</h3>
            <button class="btn-cerrar-modal" @click="showModalTodasTransacciones = false">✕</button>
          </div>
          <div class="lista-todas scroll-modal-list">
            <div v-if="store.tickets.length === 0" class="empty-state-tx">
              <span class="empty-icon">🧾</span>
              <p>No hay ventas registradas hoy</p>
            </div>
            <div v-else class="tx-list">
              <div v-for="(t, index) in [...store.tickets].reverse()" :key="index" class="tx-item" @click="verDetalleTicketAdmin(t)">
                <div class="tx-icon-col">
                  <div class="tx-avatar">{{ t.metodo ? t.metodo.charAt(0) : 'E' }}</div>
                </div>
                <div class="tx-info-col">
                  <span class="tx-id">Ticket #{{ t.id }}</span>
                  <span class="tx-time">{{ t.hora || 'Hace unos minutos' }}</span>
                </div>
                <div class="tx-method-col">
                  <span class="badge-method">{{ t.metodo || 'Efectivo' }}</span>
                </div>
                <div class="tx-amount-col">
                  <span class="tx-amount">+${{ t.monto.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- MODAL DETALLE DE TICKET HISTÓRICO (ADMIN) -->
      <div v-if="showDetalleTicketModal" class="super-modal-overlay modal-print-active">
        <div class="modal-ticket-container">
          <TicketPos :factura="ticketSeleccionadoAdmin" />
          
          <div v-if="ticketSeleccionadoAdmin?.deliveryInfo" class="evidencia-delivery no-print" style="margin-top: 20px; text-align: center; border-top: 1px dashed #cbd5e1; padding-top: 15px;">
             <h4 style="color: #1e293b; margin-bottom: 5px;">📍 Seguimiento de Delivery</h4>
             <p style="font-size:12px; color:#64748b; margin-bottom:10px;">
               Salida: <strong>{{ ticketSeleccionadoAdmin.deliveryInfo.horaSalida || 'N/A' }}</strong> | 
               Llegada: <strong>{{ ticketSeleccionadoAdmin.deliveryInfo.horaEntrega || 'Pendiente' }}</strong>
             </p>
             <div v-if="ticketSeleccionadoAdmin.deliveryInfo.fotoIntegridad" style="margin-top: 10px;">
               <p style="font-size:11px; font-weight: bold; margin-bottom:5px;">Evidencia Adjunta:</p>
               <img :src="ticketSeleccionadoAdmin.deliveryInfo.fotoIntegridad" style="max-height: 150px; border-radius:12px; border:2px solid #10b981; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
             </div>
          </div>

          <div class="acciones-factura no-print">
            <button class="btn-imprimir-ticket" @click="imprimirTicketAdmin">🖨️ Imprimir Ticket</button>
            <button class="btn-cerrar-ticket" @click="showDetalleTicketModal = false">Cerrar Detalle</button>
          </div>
        </div>
      </div>

      <!-- MODAL VER IMAGEN (COMPROBANTE) -->
      <div v-if="imagenAmpliadaUrl" class="super-modal-overlay no-print" @click="imagenAmpliadaUrl = null">
        <div class="modal-imagen-content anim-bounce" style="position: relative; max-width: 90%; text-align: center;" @click.stop>
          <button class="btn-cerrar-modal pos-abs" style="position: absolute; top: -15px; right: -15px; background: #ef4444; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 20px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.3); z-index: 10;" @click="imagenAmpliadaUrl = null">✕</button>
          <img :src="imagenAmpliadaUrl" style="max-width: 100%; max-height: 85vh; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.3);" />
        </div>
      </div>

      <!-- MODAL DE NOTIFICACIONES: PEDIDOS WEB -->
      <div v-if="showNotificaciones" class="super-modal-overlay no-print">
        <div class="modal-cliente-content modal-notificaciones">
          <header class="modal-header">
            <h3>🔔 Pedidos Web por Validar</h3>
            <button class="btn-cerrar-modal" @click="showNotificaciones = false">✕</button>
          </header>
          <div class="cuerpo-notificaciones">
            <div v-if="store.pedidosPendientes.length === 0" class="empty-state-tx">
              <p>No tienes pedidos web pendientes por validar.</p>
            </div>
            <div v-for="notif in store.pedidosPendientes" :key="notif.id" class="notif-card">
              <div class="notif-header">
                <span class="notif-cliente">{{ notif.cliente }}</span>
                <span class="notif-fecha">{{ notif.fecha }}</span>
              </div>
              <div class="notif-detalle">
                <strong>Detalle:</strong> {{ notif.detalle }}
                <div class="notif-monto">Monto: ${{ notif.monto.toFixed(2) }} ({{ notif.metodo }})</div>
              </div>
              <div v-if="notif.imagen" class="notif-adjunto">
                <p>Comprobante adjunto:</p>
                <img :src="notif.imagen" class="img-preview-notif" @click="verImagenAmpliada(notif.imagen)" />
              </div>
              <div class="notif-acciones">
                <button class="btn-rechazar" @click="rechazarPedido(notif)">Rechazar</button>
                <button class="btn-aprobar" @click="aprobarPedido(notif)">Validar y Registrar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue';
import TicketPos from '../components/TicketPos.vue';
import { ref, computed, onMounted, onUnmounted, watch, nextTick, shallowRef } from 'vue';
import { useRouter } from 'vue-router';
import { useSistemaStore } from '../stores/sistema';
import { listaProductosInventario, listaClientesData } from '../data/mockData';

const store = useSistemaStore();
const router = useRouter();

const imagenAmpliadaUrl = ref(null);

const verImagenAmpliada = (img) => {
  imagenAmpliadaUrl.value = img;
};

// DATA BÁSICA
const tasaBCV = computed(() => store.tasaBCV);
const esAdmin = computed(() => store.rolUsuario === 'admin');
const esCajero = computed(() => store.rolUsuario === 'cajero');

const tabActivaAdmin = ref('pos'); // Default to POS for better usability as requested

const showModalTodasTransacciones = ref(false);
const showDetalleTicketModal = ref(false);
const ticketSeleccionadoAdmin = ref(null);

const verDetalleTicketAdmin = (ticket) => {
  ticketSeleccionadoAdmin.value = ticket;
  showDetalleTicketModal.value = true;
};

const imprimirTicketAdmin = () => {
  window.print();
};

// ESTADO POS
const busquedaPOS = ref('');
const carrito = ref([]);
const metodosDePago = ref([]); // [{ metodo: 'Efectivo', monto: 0, montoBS: 0 }]

const totalPagadoUSD = computed(() => metodosDePago.value.reduce((sum, p) => sum + p.monto, 0));

const faltanteUSD = computed(() => {
  const diff = totalUSD.value - totalPagadoUSD.value;
  return diff > 0.01 ? diff : 0; // Evitar problemas de coma flotante
});

const agregarPago = (nombreMetodo) => {
  if (faltanteUSD.value <= 0) {
    alert("El total ya ha sido cubierto.");
    return;
  }
  
  const montoAIngresar = faltanteUSD.value;
  metodosDePago.value.push({
    metodo: nombreMetodo,
    monto: montoAIngresar,
    montoBS: montoAIngresar * tasaBCV.value
  });
};

const eliminarPago = (index) => {
  metodosDePago.value.splice(index, 1);
};
const delivery = ref(false); 
const notaDelivery = ref(''); 
const direccionDeliverySimple = ref('');
const costoDelivery = ref(0);

// RECURSOS YUMMY MAP
const leafletMapYummy = shallowRef(null);
const markerOrigen = shallowRef(null);
const markersDestinos = shallowRef([]);
const polylineYummy = shallowRef(null);

const distanciaKms = ref(0);
const sugerenciasOrigen = shallowRef([]);
const sugerenciasDestinos = ref({}); // Record<number, any[]>
let timerBusqueda = null;

const direccionOrigen = ref('Ubicando GPS...');
const coordOrigen = shallowRef([10.067, -69.333]);
const destinosYummy = ref([{ id: Date.now(), direccion: '', lat: null, lng: null }]);

const initYummyMap = () => {
  if (leafletMapYummy.value) return; 
  const mapEl = document.getElementById('mapa-yummy-pos');
  if(!mapEl || typeof window === 'undefined' || !window.L) return;

  const L = window.L;
  const map = L.map('mapa-yummy-pos', { zoomControl: false }).setView(coordOrigen.value, 15);
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

  map.on('click', (e) => {
    fijarPuntoEnMapa(e.latlng.lat, e.latlng.lng);
  });

  obtenerGPSOrigen();
};

const obtenerGPSOrigen = () => {
  if (navigator.geolocation) {
    direccionOrigen.value = 'Ubicando GPS...';
    navigator.geolocation.getCurrentPosition((pos) => {
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
    }, { enableHighAccuracy: false, maximumAge: 300000, timeout: 5000 });
  }
};

const buscarSugerencias = (esOrigen) => {
  if (!esOrigen) return;
  clearTimeout(timerBusqueda);
  sugerenciasOrigen.value = [];
  if(direccionOrigen.value.length < 3) return;

  timerBusqueda = setTimeout(async () => {
    try {
      const q = encodeURIComponent(direccionOrigen.value);
      const res = await fetch(`https://photon.komoot.io/api/?q=${q}&limit=5&lat=${coordOrigen.value[0]}&lon=${coordOrigen.value[1]}`);
      const data = await res.json();
      if(data && data.features) {
        sugerenciasOrigen.value = data.features.map(f => ({
          display_name: [f.properties.name, f.properties.street, f.properties.city].filter(Boolean).join(', '),
          lat: f.geometry.coordinates[1],
          lng: f.geometry.coordinates[0]
        })).filter(s => s.display_name && s.lat);
      }
    } catch(e) {}
  }, 400);
};

const buscarSugerenciasDestino = (index) => {
  clearTimeout(timerBusqueda);
  sugerenciasDestinos.value[index] = [];
  const texto = destinosYummy.value[index].direccion;
  if(texto.length < 3) return;

  timerBusqueda = setTimeout(async () => {
    try {
      const q = encodeURIComponent(texto);
      const res = await fetch(`https://photon.komoot.io/api/?q=${q}&limit=5&lat=${coordOrigen.value[0]}&lon=${coordOrigen.value[1]}`);
      const data = await res.json();
      if(data && data.features) {
        sugerenciasDestinos.value[index] = data.features.map(f => ({
          display_name: [f.properties.name, f.properties.street, f.properties.city].filter(Boolean).join(', '),
          lat: f.geometry.coordinates[1],
          lng: f.geometry.coordinates[0]
        })).filter(s => s.display_name && s.lat);
      }
    } catch(e) {}
  }, 400);
};

const seleccionarOrigen = (sug) => {
  sugerenciasOrigen.value = [];
  direccionOrigen.value = sug.display_name;
  coordOrigen.value = [sug.lat, sug.lng];
  if (markerOrigen.value) markerOrigen.value.setLatLng(coordOrigen.value);
  if (leafletMapYummy.value) leafletMapYummy.value.setView(coordOrigen.value, 16);
  calcularRutaFinal();
};

const seleccionarDestino = (index, sug) => {
  sugerenciasDestinos.value[index] = [];
  destinosYummy.value[index].direccion = sug.display_name;
  destinosYummy.value[index].lat = sug.lat;
  destinosYummy.value[index].lng = sug.lng;
  actualizarMarcadoresDestino();
  calcularRutaFinal();
};

const agregarDestino = () => {
  destinosYummy.value.push({ id: Date.now(), direccion: '', lat: null, lng: null });
  actualizarMarcadoresDestino();
  calcularRutaFinal();
};

const eliminarDestino = (index) => {
  destinosYummy.value.splice(index, 1);
  sugerenciasDestinos.value[index] = [];
  actualizarMarcadoresDestino();
  calcularRutaFinal();
};

const actualizarMarcadoresDestino = () => {
  if (!leafletMapYummy.value || !window.L) return;
  const L = window.L;

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

const fijarPuntoEnMapa = (lat, lng) => {
  let idx = destinosYummy.value.findIndex(d => !d.lat || !d.lng);
  if (idx === -1) {
    destinosYummy.value.push({ id: Date.now(), direccion: 'Ubicación en mapa', lat, lng });
    idx = destinosYummy.value.length - 1;
  } else {
    destinosYummy.value[idx].lat = lat;
    destinosYummy.value[idx].lng = lng;
    destinosYummy.value[idx].direccion = 'Ubicación seleccionada en mapa';
  }

  actualizarMarcadoresDestino();
  calcularRutaFinal();

  fetch(`https://photon.komoot.io/reverse?lon=${lng}&lat=${lat}`)
    .then(r=>r.json())
    .then(d=>{
      if(d.features && d.features.length>0) {
        destinosYummy.value[idx].direccion = [d.features[0].properties.name, d.features[0].properties.street].filter(Boolean).join(', ') || 'Ubicación en mapa';
      }
    });
};

// ESTADO CLIENTES
const showModalCliente = ref(false);
const modoRegistro = ref(false);
const busquedaCliente = ref('');
const clienteSeleccionado = ref(null);
const listaClientes = computed(() => store.listaClientes);
const usarDireccionRegistrada = ref(false);
const facturaRegistradaPerSale = ref(false); // Bandera para evitar doble registro

const nuevoCliente = ref({ nombre: '', rif: '', telefono: '', direccion: '' });

const calcularRutaFinal = () => {
  if (!coordOrigen.value || !leafletMapYummy.value || !window.L) return;
  const L = window.L;

  const validStops = destinosYummy.value.filter(d => d.lat && d.lng);
  
  if (validStops.length === 0) {
    distanciaKms.value = 0;
    costoDelivery.value = 0;
    if(polylineYummy.value) leafletMapYummy.value.removeLayer(polylineYummy.value);
    direccionDeliverySimple.value = '';
    return;
  }

  direccionDeliverySimple.value = validStops.map(d => d.direccion).join(' → ');

  const coordsString = [coordOrigen.value, ...validStops.map(d => [d.lat, d.lng])]
    .map(c => `${c[1]},${c[0]}`)
    .join(';');

  fetch(`https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`)
    .then(r=>r.json())
    .then(data => {
      if(data && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        distanciaKms.value = route.distance / 1000;
        
        let calcCosto = 1.5;
        if(distanciaKms.value > 1.5) {
          calcCosto += (distanciaKms.value - 1.5) * 0.5;
        }
        if (validStops.length > 1) {
           calcCosto += (validStops.length - 1) * 0.5;
        }
        
        costoDelivery.value = parseFloat(calcCosto.toFixed(2));

        if(polylineYummy.value) {
          leafletMapYummy.value.removeLayer(polylineYummy.value);
        }
        const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);
        polylineYummy.value = L.polyline(coords, { color: '#00d26a', weight: 4, opacity: 0.9 }).addTo(leafletMapYummy.value);
        leafletMapYummy.value.fitBounds(polylineYummy.value.getBounds(), { padding: [30,30] });
      }
    });
};

watch(delivery, (val) => {
  if (val) {
    nextTick(() => {
      initYummyMap();
    });
  } else {
    usarDireccionRegistrada.value = false;
    if (leafletMapYummy.value) {
      leafletMapYummy.value.remove();
      leafletMapYummy.value = null;
      polylineYummy.value = null;
      markersDestinos.value = [];
      markerOrigen.value = null;
    }
    distanciaKms.value = 0;
    costoDelivery.value = 0;
    destinosYummy.value = [{ id: Date.now(), direccion: '', lat: null, lng: null }];
    direccionDeliverySimple.value = '';
    sugerenciasDestinos.value = {};
    sugerenciasOrigen.value = [];
  }
});

watch(usarDireccionRegistrada, (val) => {
  if (val && clienteSeleccionado.value && clienteSeleccionado.value.direccion) {
    const lastIdx = destinosYummy.value.length - 1;
    destinosYummy.value[lastIdx].direccion = clienteSeleccionado.value.direccion;
    // Auto-disparar búsqueda para esta dirección
    buscarSugerenciasDestino(lastIdx);
  }
});


// PRODUCTOS DESDE BASE DE DATOS
const listaProductosPOS = computed(() => {
  return (store.inventario || []).filter(p => {
    // Mostrar solo si está marcado para la venta
    // p.paraVenta puede venir como 1/0 o true/false
    return p.paraVenta === 1 || p.para_venta === 1 || p.paraVenta === true;
  }).map(p => ({
    ...p,
    esServicio: p.tipo && (p.tipo.toLowerCase() === 'servicio' || p.tipo.toLowerCase() === 'recarga')
  }));
});

// ESTADO NOTIFICACIONES Y PEDIDOS WEB

const showNotificaciones = ref(false);

const aprobarPedido = (notif) => {
  store.resolverPedido(notif.id, true);
};

const rechazarPedido = (notif) => {
  if (confirm('¿Estás seguro de rechazar este pedido?')) {
    store.resolverPedido(notif.id, false);
  }
};

// ESTADO FACTURA
const showFacturaModal = ref(false);
const datosFactura = ref(null);


// COMPUTEDS
const productosFiltradosPOS = computed(() => {
  const t = busquedaPOS.value.toLowerCase().trim();
  if (!t) return listaProductosPOS.value;
  return listaProductosPOS.value.filter(p => p.nombre.toLowerCase().includes(t));
});

const clientesFiltrados = computed(() => {
  const t = busquedaCliente.value.toLowerCase().trim();
  if (!t) return store.listaClientes;
  // store.listaClientes ya contiene la data del Backend
  return store.listaClientes.filter(c => 
    (c.nombre && c.nombre.toLowerCase().includes(t)) || 
    (c.rif && c.rif.toLowerCase().includes(t)) ||
    (c.cedulaRif && c.cedulaRif.toLowerCase().includes(t))
  );
});

const subTotalUSD = computed(() => carrito.value.reduce((sum, i) => sum + (i.precioVenta * i.cantidad), 0));
const totalUSD = computed(() => subTotalUSD.value + (delivery.value ? costoDelivery.value : 0));
const totalBS = computed(() => totalUSD.value * tasaBCV.value);
const totalItemsCarrito = computed(() => carrito.value.reduce((sum, i) => sum + i.cantidad, 0));

// Datos del Admin (Tickets)
const ingresosDelDia = computed(() => store.ingresosDelDia);
const ventasDelDia = computed(() => store.ventasDelDia);
const ultimosTickets = computed(() => {
  return [...store.tickets].reverse().slice(0, 5); // Últimas 5 transacciones
});

// MÉTODOS
const ajustarCantidadCarrito = (index, valor) => {
  const item = carrito.value[index];
  if (!item) return;
  const qtyActual = parseInt(item.cantidad) || 0;
  if (qtyActual + valor >= 1) {
    item.cantidad = qtyActual + valor;
  }
};



const fetchTasa = () => store.actualizarTasa();

const agregarAlCarrito = (prod) => {
  const existente = carrito.value.find(i => i.id === prod.id);
  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.value.push({ ...prod, cantidad: 1 });
  }
};

const eliminarDelCarrito = (idx) => {
  carrito.value.splice(idx, 1);
};

const abrirSelectorCliente = () => {
  showModalCliente.value = true;
  modoRegistro.value = false;
  busquedaCliente.value = '';
};

const seleccionarCliente = (cli) => {
  clienteSeleccionado.value = cli;
  showModalCliente.value = false;
};

const guardarNuevoCliente = async () => {
  if (nuevoCliente.value.nombre && (nuevoCliente.value.rif || nuevoCliente.value.cedulaRif)) {
    try {
      const cli = { ...nuevoCliente.value, origen: 'POS' };
      const res = await store.guardarClienteDB(cli); // persistir en SQLite vía Backend
      
      if (res && res.success) {
        clienteSeleccionado.value = res.client || cli;
        showModalCliente.value = false;
        nuevoCliente.value = { nombre: '', rif: '', telefono: '', direccion: '' };
        // alert('Cliente guardado exitosamente.');
      } else {
        alert('Error: ' + (res?.error || 'No se pudo guardar el cliente'));
      }
    } catch (error) {
      console.error('Error guardando cliente:', error);
      alert('Error de conexión al guardar cliente');
    }
  } else {
    alert('Por favor rellena al menos el Nombre y Cédula/RIF del cliente');
  }
};

const procesarPago = async () => {
  // 1. VALIDACIÓN: Carrito no vacío
  if (carrito.value.length === 0) {
    alert('⚠️ El carrito está vacío. Agregue productos para continuar.');
    return;
  }

  // 2. VALIDACIÓN: Cliente seleccionado
  if (!clienteSeleccionado.value) {
    alert('⚠️ Por favor, seleccione un cliente para procesar la factura.');
    return;
  }

  // 3. VALIDACIÓN: Pago completo
  if (faltanteUSD.value > 0.01) {
    alert(`⚠️ El pago está incompleto. Faltan $${faltanteUSD.value.toFixed(2)} por cubrir.`);
    return;
  }

  if (metodosDePago.value.length === 0) {
    alert('⚠️ Debe registrar al menos un método de pago.');
    return;
  }

  const ahora = new Date();
  
  // Guardamos los datos para la factura
  // Formateamos el número a correlativo (ej: 001, 002)
  const correlativo = store.proximoNumeroFactura.toString().padStart(3, '0');
  
  const payloadFactura = {
    numero: correlativo,
    timestamp: ahora.toISOString(),
    fecha: ahora.toLocaleDateString(),
    hora: ahora.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    cajero: emailUsuario.value,
    cliente: clienteSeleccionado.value,
    metodosPago: [...metodosDePago.value.map(p => ({...p}))],
    metodoPago: metodosDePago.value.length > 1 ? 'Múltiple' : metodosDePago.value[0].metodo,
    items: [...carrito.value.map(i => ({...i}))],
    tasa: tasaBCV.value,
    subtotalUSD: subTotalUSD.value,
    totalUSD: totalUSD.value,
    totalBS: totalBS.value,
    metodo: metodosDePago.value.length === 1 ? metodosDePago.value[0].metodo : 'PAGOS MÚLTIPLES',
    monto: totalUSD.value, // Incluir monto explícitamente para el backend
    delivery: delivery.value ? {
       costo: costoDelivery.value,
       direccion: destinosYummy.value[destinosYummy.value.length - 1].direccion || direccionDeliverySimple.value || 'N/A',
       destinos: [...destinosYummy.value],
       distancia: distanciaKms.value,
       nota: notaDelivery.value
    } : null
  };

  // Registrar de inmediato en el Backend antes de mostrar el modal
  const res = await store.registrarVentaGlobal(payloadFactura);
  
  if (res.success) {
    // Si es exitoso, mostrar modal de factura
    datosFactura.value = payloadFactura;
    showFacturaModal.value = true;
    
    // El correlativo se incrementa al imprimir, o se puede forzar acá si no se imprime
  } else {
    // Mostrar error validado por el backend (Ej: Stock Insuficiente)
    alert(`❌ No se pudo procesar la venta:\n\n${res.error}`);
  }
};

const imprimirFactura = () => {
  if (datosFactura.value && !datosFactura.value.impreso) {
    store.incrementarFactura();
    datosFactura.value.impreso = true;
  }
  window.print();
};

const finalizarVenta = () => {
  // Limpiar y cerrar todo para la nueva venta
  carrito.value = [];
  metodosDePago.value = [];
  clienteSeleccionado.value = null;
  delivery.value = false;
  notaDelivery.value = '';
  // El watcher de delivery(false) ya se encarga de reiniciar destinosYummy, mapa, costo y distancia
  
  showFacturaModal.value = false;
  datosFactura.value = null;
};

let bcvInterval = null;

onMounted(async () => {
  console.log('DEBUG: VentasView Mounted');
  await store.fetchClientes(); // Cargar la lista de clientes desde la DB
  await store.fetchInventario(); // Cargar inventario para el POS
  if (esAdmin.value) {
    await store.fetchHistorialVentas(); // Cargar KPIs para el Admin
  }
  await fetchTasa(); // Cargar tasa al iniciar
  // Auto-Actualizar la tasa BCV en segundo plano cada 10 minutos
  bcvInterval = setInterval(fetchTasa, 600000);
});

onUnmounted(() => {
  if (bcvInterval) clearInterval(bcvInterval);
});

const nombreRol = computed(() => store.perfilUsuario?.nombre || (esAdmin.value ? 'Administrador' : 'Cajero'));
const emailUsuario = computed(() => store.perfilUsuario?.email || (esAdmin.value ? 'admin@wateriujo.com' : 'caja@wateriujo.com'));
</script>

<style scoped>
.app-layout { display: flex; min-height: 100vh; background-color: #f4f6f9; }
.main-content { flex: 1; display: flex; flex-direction: column; overflow-x: hidden; padding: 20px; }

/* TABS ADMIN */
.tabs-control-admin {
  display: flex;
  background: white;
  padding: 6px;
  border-radius: 12px;
  gap: 5px;
  border: 1px solid #e2e8f0;
  margin: 0 20px;
}
.tab-admin-btn {
  padding: 8px 16px;
  border: none;
  background: none;
  color: #64748b;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  border-radius: 8px;
  transition: 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}
.tab-admin-btn:hover { background: #f8fafc; color: #3b82f6; }
.tab-admin-btn.active { background: #eff6ff; color: #3b82f6; }

.config-pos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 10px;
}
.config-item { display: flex; flex-direction: column; gap: 8px; }
.config-item label { font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; }
.input-with-btn { display: flex; gap: 10px; }
.input-with-btn input { flex: 1; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; }
.input-with-btn button { padding: 0 15px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; }

/* CONFIG V2 PREMIUM */
.config-card-main {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}
.config-pos-grid-v2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 25px;
  margin: 25px 0;
}
.config-item-v2 label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  margin-bottom: 8px;
}
.input-modern-wrapper {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0 12px;
  transition: 0.3s;
}
.input-modern-wrapper:focus-within {
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 4px rgba(59,130,246,0.1);
}
.input-modern-wrapper input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 12px 10px;
  font-weight: 600;
  color: #1e293b;
  outline: none;
}
.prefix-icon { font-size: 16px; opacity: 0.7; }
.btn-refresh-tasa {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 5px;
  border-radius: 8px;
  transition: 0.2s;
}
.btn-refresh-tasa:hover { background: #eff6ff; filter: hue-rotate(45deg); }

.config-footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px dashed #e2e8f0;
}
.btn-guardar-premium {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
  box-shadow: 0 4px 12px rgba(59,130,246,0.2);
}
.btn-guardar-premium:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(59,130,246,0.3); }
.btn-cancelar-config {
  background: #f1f5f9;
  color: #64748b;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}

.multi-pago-section {
  background: #f8fafc;
  border-radius: 12px;
  padding: 15px;
  margin: 15px 0;
  border: 1px solid #e2e8f0;
}
.cabecera-multipago {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.badge-faltante {
  background: #fee2e2;
  color: #ef4444;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 800;
}
.badge-pagado {
  background: #dcfce7;
  color: #10b981;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 800;
}

.lista-pagos-agregados {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
  max-height: 150px;
  overflow-y: auto;
}

.item-pago-agregado {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.info-pago-txt {
  flex: 1;
}

.pago-met {
  font-size: 12px;
  font-weight: 700;
  color: #1e293b;
  display: block;
  margin-bottom: 4px;
}

.pago-montos {
  display: flex;
  align-items: center;
  gap: 10px;
}

.input-monto-pago {
  width: 80px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 14px;
  font-weight: 800;
  color: #1e3a8a;
  outline: none;
}

.pago-bs {
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
}

.btn-eliminar-pago {
  background: #fecaca;
  color: #b91c1c;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
}

.pago-placeholder {
  text-align: center;
  padding: 20px;
  color: #94a3b8;
  font-size: 12px;
  font-style: italic;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
}

.grid-pagos-v2 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.pago-btn-item {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: 0.2s;
  font-size: 10px;
  font-weight: 700;
  color: #475569;
}

.pago-btn-item:hover {
  background: #eff6ff;
  border-color: #3b82f6;
  color: #1e4ed8;
}

.pago-icon-v2 {
  font-size: 16px;
}

/* TASA BCV BANNER */
.tasa-bcv-banner {
  background-color: #f0f7ff;
  border-radius: 8px;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  color: #3b82f6;
  font-weight: 600;
  font-size: 14px;
}
.valor-tasa {
  color: #1e3a8a;
  font-weight: 800;
  margin-left: 10px;
}

.tasa-left-info {
  display: flex;
  align-items: center;
}

.usuario-rol-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 12px 20px;
  border-radius: 20px;
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: transform 0.3s ease;
  cursor: pointer;
}
.usuario-rol-badge:hover { transform: translateY(-2px); box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.08); }

.info-texto-top {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.nombre-top {
  font-size: 15px;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
}

.email-top {
  font-size: 11px;
  font-weight: 500;
  color: #64748b;
  margin-top: 2px;
}

.avatar-top {
  width: 40px;
  height: 40px;
  background: #e3f2fd;
  color: #2196F3;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  border: 1px solid #2196F3;
}

/* POS LAYOUT */
.pos-main-container {
  display: flex;
  gap: 20px;
  height: calc(100vh - 100px);
}

/* CATÁLOGO */
.seccion-catalogo {
  flex: 1;
  background: white;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
.controles-busqueda {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}
.input-busqueda-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 15px;
}
.lupa { color: #94a3b8; margin-right: 10px; }
.input-busqueda-wrapper input {
  border: none; outline: none; width: 100%; font-size: 14px;
}
.select-categoria {
  border: 1px solid #e2e8f0; border-radius: 8px; padding: 0 15px; font-size: 12px; font-weight: 700; color: #64748b; cursor: pointer;
}

/* LISTA DE PRODUCTOS */
.lista-productos-pos { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
.item-producto-fila {
  display: flex; align-items: center; padding: 15px 5px; border-bottom: 1px solid #f1f5f9; transition: background 0.2s;
}
.item-producto-fila:hover { background: #f8fafc; }

.info-producto-detalles { flex: 1; }
.nombre-principal { font-size: 15px; font-weight: 700; color: #1e293b; display: flex; align-items: center; gap: 8px; }
.badge-servicio { background: #f5f3ff; color: #7c3aed; font-size: 10px; padding: 2px 8px; border-radius: 4px; font-weight: 700; }
.datos-secundarios { display: flex; gap: 10px; margin-top: 4px; }
.tag-categoria { font-size: 11px; color: #94a3b8; font-weight: 600; }
.tag-stock { font-size: 11px; color: #10b981; font-weight: 700; }

.precios-item { text-align: right; width: 100px; }
.precio-usd-bold { font-size: 16px; font-weight: 800; color: #1e3a8a; }
.precio-bs-sub { font-size: 11px; color: #94a3b8; }

/* CONTROLES MINI EN CARRITO */
.item-cart-controls-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}
.mini-control-cant {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 2px;
}
.btn-mini-cant {
  width: 22px; height: 22px; border: none; background: white; border-radius: 4px; cursor: pointer; color: #3b82f6; font-weight: 800; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: 0.2s;
}
.btn-mini-cant:hover { background: #3b82f6; color: white; }
.val-mini-cant {
  width: 40px;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  border: none;
  background: transparent;
  outline: none;
  padding: 0;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: textfield;
}
.val-mini-cant::-webkit-outer-spin-button,
.val-mini-cant::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.btn-add-circle {
  width: 32px; height: 32px; border-radius: 50%; border: none; background-color: #f0f7ff; color: #3b82f6; font-size: 20px; font-weight: 700; display: flex; justify-content: center; align-items: center; cursor: pointer; transition: all 0.2s;
}
.btn-add-circle:hover { background: #3b82f6; color: white; }


/* CARRITO */
.seccion-carrito-pos {
  width: 380px; background: white; border-radius: 12px; display: flex; flex-direction: column; padding: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow-y: auto;
}

.cliente-selector-container { margin-bottom: 15px; }
.caja-cliente-vacia {
  border: 1.5px dashed #e2e8f0; border-radius: 12px; padding: 15px; display: flex; flex-direction: column; align-items: center; color: #94a3b8; cursor: pointer; transition: 0.2s;
}
.caja-cliente-vacia:hover { border-color: #3b82f6; color: #3b82f6; background: #f0f7ff; }
.icono-user-dotted { font-size: 24px; margin-bottom: 5px; }
.txt-seleccionar { font-size: 14px; font-weight: 600; }

.caja-cliente-activa {
  background: #f8fafc; border-radius: 12px; padding: 12px 15px; display: flex; justify-content: space-between; align-items: center;
}
.info-cliente-sel { display: flex; align-items: center; gap: 12px; }
.icono-user-full { font-size: 20px; color: #3b82f6; }
.detalles-cli { display: flex; flex-direction: column; }
.nom-cli { font-size: 14px; font-weight: 700; color: #1e293b; }
.rif-cli { font-size: 11px; color: #64748b; }
.btn-quitar-cli { background: transparent; border: none; color: #94a3b8; cursor: pointer; }

/* PREMIUM DELIVERY UI */
.premium-delivery-card {
  background: #ffffff;
  border-radius: 28px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.06);
  border: 1px solid #f1f5f9;
}

.delivery-vertical-stepper {
  display: flex;
  flex-direction: column;
}

.step-row {
  display: flex;
  gap: 16px;
  min-height: 60px;
}

.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 24px;
}

.dot-inner {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-top: 10px;
}
.dot-inner.central { background: #6366f1; border: 3px solid #e0e7ff; box-shadow: 0 0 10px rgba(99, 102, 241, 0.3); }
.dot-inner.destination { background: #a855f7; border: 3px solid #f3e8ff; box-shadow: 0 0 10px rgba(168, 85, 247, 0.3); }

.line-connector {
  width: 2px;
  flex: 1;
  background: #e2e8f0;
  margin: 2px 0;
}

.step-content {
  flex: 1;
  padding-bottom: 25px;
}

.step-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 800;
  color: #94a3b8;
  margin-bottom: 4px;
}

.step-address-fixed {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
}

.step-input-container {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  border-radius: 16px;
  padding: 4px 12px;
  border: 1px solid transparent;
  transition: 0.3s;
}

.step-input-container:focus-within {
  background: white;
  border-color: #a855f7;
  color: #475569;
}
.sug-item:hover {
  background: #f0f7ff;
  color: #3b82f6;
}

.map-pnl-controles {
  position: absolute;
  bottom: 15px;
  left: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  padding: 10px;
  border-radius: 12px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}
.btn-map-accion {
  border: none;
  background: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  color: #1e293b;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  white-space: nowrap;
}
.punto-azul {
  width: 10px; height: 10px; background: #3b82f6; border-radius: 50%; display: inline-block;
  border: 2px solid white; box-shadow: 0 0 5px rgba(59,130,246,0.5);
}
.divisor-v { width: 1px; height: 20px; background: #e2e8f0; }
.map-status-msg { font-size: 11px; font-weight: 600; color: #64748b; }

@keyframes pulse-blue {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.6; }
  100% { transform: scale(1); opacity: 1; }
}

.loader-map {
  background: rgba(59, 130, 246, 0.9);
  color: white;
  font-size: 10px;
  padding: 4px 10px;
  border-radius: 20px;
  position: absolute;
  top: 60px;
  left: 10px;
}

.campo-nota-delivery { display: flex; flex-direction: column; gap: 8px; }
.campo-nota-delivery label { font-size: 12px; font-weight: 600; color: #64748b; }
.campo-nota-delivery textarea {
  width: 100%; height: 80px; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; font-size: 12px; outline: none; transition: 0.2s; resize: none;
}
.campo-nota-delivery textarea:focus { border-color: #3b82f6; }

/* SWITCH TOGGLE */
.switch { position: relative; display: inline-block; width: 44px; height: 22px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; }
.slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background-color: white; transition: .4s; }
input:checked + .slider { background-color: #3b82f6; }
input:checked + .slider:before { transform: translateX(22px); }
.slider.round { border-radius: 34px; }
.slider.round:before { border-radius: 50%; }

.lista-items-carrito { flex: 1; min-height: 150px; overflow-y: auto; padding-right: 5px; margin-bottom: 15px; }
.carrito-vacio-state { text-align: center; margin-top: 50px; color: #cbd5e1; }
.ilustracion-carrito { font-size: 60px; margin-bottom: 10px; opacity: 0.3; }
.carrito-vacio-state h4 { margin: 0; color: #94a3b8; }
.carrito-vacio-state p { font-size: 12px; }

.item-cart-fila { display: flex; align-items: center; padding: 10px 0; border-bottom: 1px dashed #f1f5f9; }
.item-cart-main { flex: 1; display: flex; gap: 8px; align-items: center; }
.item-cant { font-size: 13px; color: #3b82f6; font-weight: 800; background: #f0f7ff; padding: 2px 6px; border-radius: 4px; }
.item-nom { font-size: 13px; color: #1e293b; font-weight: 600; }
.item-cart-precio { font-size: 13px; font-weight: 700; color: #1e3a8a; margin-right: 15px; }
.btn-del { border: none; background: transparent; color: #cbd5e1; cursor: pointer; transition: 0.2s; }
.btn-del:hover { color: #ef4444; }

.footer-carrito-pos { border-top: 1px solid #f1f5f9; padding-top: 15px; background: white; }
.fila-resumen { display: flex; justify-content: space-between; font-size: 14px; color: #64748b; margin-bottom: 8px; }
.fila-delivery-cost { padding-bottom: 8px; border-bottom: 1px dashed #e2e8f0; margin-bottom: 10px; align-items: flex-start; }
.lbl-delivery { color: #8b5cf6; font-weight: 700; display: flex; flex-direction: column; gap: 2px; }
.tag-paradas-extras { font-size: 11px; color: #a855f7; font-weight: normal; margin-left: 20px;}
.costo-delivery { color: #8b5cf6; font-weight: 800; align-self: flex-start; }
.fila-resumen-total { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.usd-grande { font-size: 24px; font-weight: 800; color: #1e293b; }

.btn-cobrar-pos { background: #10b981; color: white; border: none; padding: 15px; border-radius: 12px; font-weight: 800; font-size: 16px; cursor: pointer; transition: 0.2s; display: flex; justify-content: center; align-items: center; gap: 10px; width: 100%; margin-top: 15px;}
.btn-cobrar-pos:hover:not(:disabled) { background: #059669; }
.btn-cobrar-pos:disabled { opacity: 0.5; cursor: not-allowed; }

/* CSS PARA EL CIERRE DE CAJA */
.documento-a4 { background: white; border-radius: 8px; padding: 40px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); color: #0f172a; min-height: auto; width: 100%; }
.doc-header { display: flex; justify-content: space-between; border-bottom: 2px solid #1e293b; padding-bottom: 20px; margin-bottom: 30px; }
.doc-logo-title { display: flex; align-items: center; gap: 15px; }
.logo-water { font-size: 34px; background: #eff6ff; width: 60px; height: 60px; border-radius: 12px; display: flex; justify-content: center; align-items: center; }
.doc-logo-title h2 { margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 1px; }
.doc-logo-title p { margin: 0; color: #64748b; font-size: 12px; }
.doc-info { text-align: right; }
.doc-title { font-size: 18px; font-weight: 800; text-transform: uppercase; margin: 0 0 10px 0; letter-spacing: 0.5px; color: #3b82f6; }
.doc-info p { margin: 3px 0; font-size: 13px; }

.seccion-titulo { font-size: 14px; text-transform: uppercase; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin: 0 0 15px 0; letter-spacing: 1px; }
.doc-seccion { margin-bottom: 35px; }

.productos-compactos { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px 20px; }
.prod-fila-compacta { display: flex; align-items: center; padding: 6px 15px 6px 6px; background: white; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 13px; }
.prod-cant-box { background: #3b82f6; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 4px; padding: 4px 10px; margin-right: 15px; min-width: 45px; }
.prod-cant-box .prod-minitext { font-size: 8px; color: #bfdbfe; font-weight: 700; text-transform: uppercase; margin-bottom: 2px; }
.prod-cant-box .prod-bigtext { font-size: 13px; font-weight: 800; color: white; line-height: 1; }

.prod-desc-box { flex: 1; color: #1e293b; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 10px; }

.prod-total-box { display: flex; flex-direction: column; align-items: flex-end; justify-content: center; }
.prod-total-box .prod-minitext { font-size: 8px; color: #94a3b8; font-weight: 700; text-transform: uppercase; margin-bottom: 2px; }
.prod-total-box .prod-bigtext { font-size: 14px; font-weight: 800; color: #0f172a; line-height: 1; }

/* MODAL STYLES */
.super-modal-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.7); display: flex; justify-content: center; align-items: center; z-index: 1000;
}
.modal-cliente-content {
  background: white; width: 90%; max-width: 500px; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); overflow: hidden;
}
.modal-header {
  padding: 20px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;
}
.modal-header h3 { font-size: 18px; margin: 0; color: #1e293b; }
.btn-cerrar-modal { background: transparent; border: none; font-size: 20px; color: #94a3b8; cursor: pointer; }

.cuerpo-busqueda, .cuerpo-registro { padding: 25px; }
.input-grande-wrapper input {
  width: 100%; padding: 15px; border: 2px solid #f1f5f9; border-radius: 12px; font-size: 16px; outline: none; transition: 0.2s;
}
.input-grande-wrapper input:focus { border-color: #3b82f6; }

.lista-resultados-clientes { margin-top: 20px; max-height: 250px; overflow-y: auto; }
.result-cliente-item { display: flex; align-items: center; padding: 12px; border-radius: 10px; cursor: pointer; transition: 0.2s; }
.result-cliente-item:hover { background: #f0f7ff; }
.avatar-cli { width: 35px; height: 35px; background: #e2e8f0; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-right: 15px; }
.txts-cli { flex: 1; display: flex; flex-direction: column; }
.txts-cli strong { font-size: 14px; color: #1e293b; }
.txts-cli span { font-size: 11px; color: #64748b; }
.btn-check-cli { background: transparent; border: none; color: #3b82f6; font-size: 18px; display: none; }
.result-cliente-item:hover .btn-check-cli { display: block; }

.no-cli-found { text-align: center; padding: 20px; font-size: 14px; color: #64748b; }
.btn-link-reg { background: transparent; border: none; color: #3b82f6; font-weight: 700; cursor: pointer; text-decoration: underline; }

.btn-abrir-registro {
  width: 100%; margin-top: 20px; padding: 12px; background: transparent; color: #3b82f6; border: 2px dashed #3b82f6; border-radius: 10px; font-weight: 700; cursor: pointer;
}

.form-grid-cli { display: flex; flex-direction: column; gap: 15px; }
.campo-cli { display: flex; flex-direction: column; gap: 6px; }
.campo-cli label { font-size: 13px; font-weight: 600; color: #64748b; }
.campo-cli input { padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; outline: none; }

.acciones-registro { margin-top: 25px; display: flex; gap: 10px; }
.btn-volver-busqueda { flex: 1; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; font-weight: 600; }
.btn-guardar-cli { flex: 2; padding: 12px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 700; }

.slide-down { animation: slideDown 0.3s ease-out; }
@keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 1024px) {
  .pos-main-container { flex-direction: column; height: auto; }
  .seccion-carrito-pos { width: 100%; }
}
/* FINAL DELIVERY STYLES */
.final-delivery-container {
  background: white;
  border-radius: 20px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

.route-builder {
  display: flex;
  flex-direction: column;
}

.route-step {
  display: flex;
  gap: 12px;
  min-height: 50px;
}

.step-icon-col {
  width: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dot-blue { width: 14px; height: 14px; background: #3b82f6; border-radius: 50%; border: 3px solid #dbeafe; margin-top: 10px; }
.dot-purple { width: 14px; height: 14px; background: #a855f7; border-radius: 50%; border: 3px solid #f3e8ff; margin-top: 10px; }
.line-path { width: 2px; flex: 1; background: #f1f5f9; margin: 4px 0; }

.step-input-col { flex: 1; position: relative; }
.address-fixed { padding: 10px 0; font-size: 13px; color: #64748b; font-weight: 500; }

.step-order-label {
  font-size: 10px;
  font-weight: 800;
  color: #a855f7;
  text-transform: uppercase;
  margin-bottom: 4px;
  letter-spacing: 0.5px;
}

.input-with-action {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  padding: 0 10px;
}

.input-with-action input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 10px 0;
  font-size: 14px;
  outline: none;
}

.btn-clear-in { background: transparent; border: none; color: #cbd5e1; cursor: pointer; }

.step-action-col { width: 40px; display: flex; justify-content: center; align-items: center; }
.btn-plus-route {
  width: 32px; height: 32px; border-radius: 8px; border: none; background: #f1f5f9; color: #a855f7; font-size: 20px; font-weight: 700; cursor: pointer;
}
.btn-remove-route { background: transparent; border: none; color: #94a3b8; cursor: pointer; }

.clickable-origin {
  cursor: pointer;
  padding: 8px;
  border-radius: 12px;
  transition: background 0.2s;
}
.clickable-origin:hover { background: #f0f7ff; }
.step-active { background: #f0f7ff !important; border: 1px solid #dbeafe; }
.clickable-dest { display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; cursor: pointer; font-size: 13px; color: #1e293b; background: white; transition: 130ms; }
.clickable-dest:hover { background: #f8fafc; border-color: #cbd5e1; }
.edit-hint-icon { font-size: 10px; opacity: 0.5; }

.pulse-active { animation: pulse-blue 2s infinite; }
.text-active { color: #1e3a8a !important; font-weight: 700 !important; }

.map-link-btn {
  margin-top: 10px;
  color: #a855f7;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 8px;
  transition: 0.2s;
}
.map-link-btn:hover { background: #f3e8ff; }

.map-main-wrapper {
  margin-top: 15px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  height: 250px;
  position: relative;
}

.leaflet-map-frame-v2 { width: 100%; height: 100%; }

.map-hint-text {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.6);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 10px;
  z-index: 1000;
}

.sugerencias-overlay {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 2000;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  width: 100%;
  max-height: 250px;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  margin-top: 5px;
  font-family: 'Inter', system-ui, sans-serif;
}
.sug-item-m { 
  padding: 14px 18px; 
  font-size: 14px; 
  border-bottom: 1px solid #f1f5f9; 
  cursor: pointer; 
  color: #111827; /* Negro sólido y profundo */
  font-weight: 600; /* Más vistoso */
  line-height: 1.5;
  letter-spacing: -0.01em;
  transition: background 0.2s;
}
.sug-item-m:hover {
  background: #f1f5f9; /* Solo cambio de fondo sutil, texto sigue negro */
}
.sug-item-m:last-child {
  border-bottom: none;
}
.sin-resultados-m {
  padding: 15px;
  font-size: 13px;
  color: #64748b;
  text-align: center;
  font-weight: 500;
}

.nota-entrega-v2 textarea {
  width: 100%;
  margin-top: 15px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px;
  height: 60px;
  font-size: 13px;
  resize: none;
  font-family: inherit;
}

.acciones-factura { display: flex; flex-direction: column; gap: 8px; margin-top: 20px; }
.modal-ticket-container { 
  background: white; 
  border-radius: 16px; 
  padding: 15px; 
  max-width: 400px; 
  width: 95%; 
  max-height: 90vh; 
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.hint-val-cli { font-size: 11px; color: #f59e0b; font-weight: 600; text-align: center; margin-top: 10px; }
.disabled-sw { opacity: 0.5; }
.btn-add-circle:disabled { background: #f1f5f9; color: #cbd5e1; cursor: not-allowed; }

.btn-imprimir-ticket { 
  background: #2563eb; 
  color: white; 
  border: none; 
  padding: 14px; 
  border-radius: 12px; 
  font-weight: 700; 
  cursor: pointer; 
  font-size: 14px;
  transition: 0.2s;
}
.btn-imprimir-ticket:hover { background: #1d4ed8; }
.btn-cerrar-ticket { 
  background: #f8fafc; 
  color: #64748b; 
  border: 1px solid #e2e8f0; 
  padding: 12px; 
  border-radius: 12px; 
  font-weight: 600; 
  cursor: pointer; 
  font-size: 14px;
}

/* BLOQUEO POS SIN CLIENTE */
.vista-pos { position: relative; }
.pos-locked .seccion-catalogo, .pos-locked .lista-items-carrito, .pos-locked .footer-carrito-pos {
  filter: blur(2px);
  pointer-events: none;
  opacity: 0.6;
}
.pos-lock-overlay {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(255, 255, 255, 0.4); z-index: 100;
  display: flex; justify-content: center; align-items: center;
}
.lock-card {
  background: white; padding: 40px; border-radius: 24px; text-align: center;
  box-shadow: 0 20px 50px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; max-width: 320px;
}
.lock-icon { font-size: 50px; display: block; margin-bottom: 15px; }
.lock-card h3 { margin: 0 0 10px; color: #1e293b; }
.lock-card p { font-size: 14px; color: #64748b; margin-bottom: 25px; line-height: 1.5; }
.btn-lock-action {
  background: #3b82f6; color: white; border: none; padding: 12px 24px;
  border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.2s;
}
.btn-lock-action:hover { background: #2563eb; transform: translateY(-2px); }

.loader-mini-search { font-size: 12px; margin-right: 8px; animation: spin 1s infinite linear; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
/* --- Estilos Premium Admin Dashboard de Ventas --- */
.vista-admin-dashboard { display: flex; flex-direction: column; gap: 25px; padding-top: 10px; }
.subtitle-admin { color: #64748b; font-size: 14px; margin-top: 5px; }

.premium-kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; }
.premium-kpi-card { background: white; padding: 25px; border-radius: 20px; display: flex; align-items: flex-start; gap: 20px; border: 1px solid rgba(226, 232, 240, 0.8); box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05); transition: transform 0.3s ease, box-shadow 0.3s ease; position: relative; overflow: hidden; }

/* Header Administrador Izquierda */
.header-admin-left { display: flex; justify-content: space-between; align-items: center; border-bottom: none; margin-bottom: 25px; padding: 0; }
.title-container-left h2 { font-size: 28px; color: #1e293b; font-weight: 800; margin: 0; letter-spacing: -0.5px; }
.title-container-left .subtitle-admin-left { color: #64748b; font-size: 14px; margin-top: 5px; font-weight: 500; }

.badge-rol-admin { display: flex; align-items: center; gap: 12px; background: white; padding: 12px 20px; border-radius: 20px; box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05); border: 1px solid rgba(226, 232, 240, 0.8); transition: transform 0.3s ease; cursor: default; }
.badge-rol-admin:hover { transform: translateY(-2px); box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.08); }


/* Modal Transacciones */
.modal-tx-lista { max-width: 600px; max-height: 80vh; display: flex; flex-direction: column; }
.scroll-modal-list { flex: 1; overflow-y: auto; padding: 10px 0; margin-top: 10px; padding-right: 5px; }
.scroll-modal-list::-webkit-scrollbar { width: 6px; }
.scroll-modal-list::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
.scroll-modal-list::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

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
.kpi-label { font-size: 13px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
.kpi-value { font-size: 28px; font-weight: 800; color: #0f172a; margin: 0; line-height: 1; letter-spacing: -0.5px; }
.kpi-trend { font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 4px; }
.kpi-trend.positive { color: #10b981; }
.kpi-trend.negative { color: #ef4444; }
.kpi-trend.neutral { color: #8b5cf6; }
.trend-icon { font-size: 14px; }

.premium-dashboard-row { display: grid; grid-template-columns: 2fr 1.2fr; gap: 25px; align-items: stretch; }

.premium-chart-card, .premium-table-card { background: white; padding: 30px; border-radius: 20px; border: 1px solid rgba(226, 232, 240, 0.8); box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05); display: flex; flex-direction: column; }
.card-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
.card-title-premium { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0; }
.btn-more-options { background: none; border: none; font-size: 20px; color: #94a3b8; cursor: pointer; transition: color 0.2s; padding: 5px; }
.btn-more-options:hover { color: #3b82f6; }
.view-all-link { font-size: 14px; font-weight: 600; color: #3b82f6; text-decoration: none; transition: 0.2s; }
.view-all-link:hover { color: #2563eb; text-decoration: underline; }

.chart-wrapper { width: 100%; position: relative; flex: 1; display: flex; flex-direction: column; justify-content: flex-end; }
.svg-smooth-chart { width: 100%; height: 200px; overflow: visible; }
.data-point { transition: r 0.3s ease, fill 0.3s ease; cursor: pointer; }
.data-point:hover { r: 8; fill: #3b82f6; stroke: white; }
.chart-x-axis { display: flex; justify-content: space-between; margin-top: 15px; font-size: 12px; font-weight: 600; color: #94a3b8; }

.tx-list { display: flex; flex-direction: column; gap: 15px; }
.tx-item { display: flex; align-items: center; padding: 15px; border-radius: 12px; background: #f8fafc; transition: background 0.2s, transform 0.2s; border: 1px solid transparent; cursor: pointer; }
.tx-item:hover { background: white; border-color: #e2e8f0; transform: translateX(5px); box-shadow: 0 4px 10px rgba(0,0,0,0.03); }
.tx-icon-col { margin-right: 15px; }
.tx-avatar { width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, #e0f2fe, #bae6fd); color: #0284c7; display: flex; justify-content: center; align-items: center; font-weight: 800; font-size: 16px; }
.tx-info-col { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.tx-id { font-size: 14px; font-weight: 700; color: #1e293b; }
.tx-time { font-size: 12px; color: #64748b; font-weight: 500; }
.badge-method { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; background: #f1f5f9; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }
.tx-amount-col { margin-left: auto; text-align: right; }
.tx-amount { font-size: 16px; font-weight: 800; color: #10b981; }

.empty-state-tx { display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 40px 20px; text-align: center; color: #94a3b8; height: 100%; }
.empty-icon { font-size: 40px; margin-bottom: 10px; opacity: 0.5; }

/* Animaciones removidas */

@media (max-width: 1200px) {
  .premium-dashboard-row { grid-template-columns: 1fr; }
}

/* NOTIFICACIONES MAPA */
.btn-ver-mapa-notif {
  background: #f0f9ff;
  color: #0284c7 !important;
  border: 1px solid #bae6fd;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
  display: flex;
  align-items: center;
  gap: 5px;
}
.btn-ver-mapa-notif:hover { background: #e0f2fe; }

.notif-map-container {
  margin-top: 15px;
  border-radius: 12px;
  overflow: hidden;
  border: 1.5px solid #e2e8f0;
  animation: slideDown 0.3s ease-out;
}
.map-notif-frame {
  height: 200px;
  width: 100%;
  z-index: 1;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* METODOS DE PAGO STYLES - RESTAURADOS */
.multi-pago-section { display: flex; flex-direction: column; gap: 15px; background: #f8fafc; padding: 15px; border-radius: 16px; margin-bottom: 20px; }
.cabecera-multipago { display: flex; justify-content: space-between; align-items: center; }
.metodo-label { font-size: 13px; font-weight: 800; color: #64748b; text-transform: uppercase; }
.badge-faltante { font-size: 11px; background: #fef2f2; color: #ef4444; padding: 4px 10px; border-radius: 12px; font-weight: 700; }
.badge-pagado { font-size: 11px; background: #f0fdf4; color: #10b981; padding: 4px 10px; border-radius: 12px; font-weight: 700; }
.lista-pagos-agregados { display: flex; flex-direction: column; gap: 8px; background: white; padding: 10px; border-radius: 12px; border: 1px dashed #cbd5e1; }
.pago-placeholder { font-size: 12px; color: #94a3b8; text-align: center; padding: 10px; }
.item-pago-agregado { display: flex; justify-content: space-between; align-items: center; background: #f8fafc; padding: 8px 12px; border-radius: 8px; }
.info-pago-txt { display: flex; flex-direction: column; gap: 4px; }
.pago-met { font-size: 13px; font-weight: 700; color: #1e293b; }
.pago-montos { display: flex; align-items: center; gap: 8px; }
.input-monto-pago { width: 80px; padding: 4px 8px; border: 1px solid #cbd5e1; border-radius: 6px; outline: none; font-size: 13px; }
.pago-bs { font-size: 11px; color: #64748b; }
.btn-eliminar-pago { background: none; border: none; color: #ef4444; cursor: pointer; font-size: 16px; }
.grid-pagos-v2 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.pago-btn-item { display: flex; flex-direction: column; align-items: center; gap: 6px; background: white; border: 1px solid #e2e8f0; padding: 10px 5px; border-radius: 12px; cursor: pointer; font-size: 11px; font-weight: 600; color: #475569; transition: 0.2s; }
.pago-btn-item:hover { background: #f0f7ff; border-color: #3b82f6; color: #3b82f6; }
.pago-icon-v2 { font-size: 18px; }
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
.y-styled-input { width: 100%; border: none; background: #f8fafc; padding: 12px 15px; border-radius: 12px; font-size: 14px; color: #1e293b; font-weight: 600; outline: none; border: 1px solid transparent; transition: 0.3s; }
.y-styled-input:focus { border-color: #00d26a; background: white; box-shadow: 0 0 0 4px rgba(0,210,106,0.1); }
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
</style>

<style>
/* ESTILOS DE IMPRESIÓN GLOBALES (NO SCOPED) */
@media print {
  @page {
    margin: 0 !important;
  }

  /* CERO PADDING/MARGIN/HEIGHT PARA TODO EL DOCUMENTO. 
     Esto evita cualquier desbordamiento fantasma. */
  html, body, #app, .app-layout {
    background: white !important;
    margin: 0 !important;
    padding: 0 !important;
    display: block !important;
    height: auto !important;
    min-height: 0 !important;
    overflow: visible !important;
    position: static !important;
  }

  /* Ocultar inyecciones ajenas a Vue (si existen al final del body) */
  body > *:not(#app) {
    display: none !important;
  }

  /* Ocultar el contenido normal de la aplicación */
  .main-content, aside, .sidebar-dark, nav, .perfil-usuario-top {
    display: none !important;
  }

  /* Ocultar los modales que no se van a imprimir */
  .super-modal-overlay:not(.modal-print-active) {
    display: none !important;
  }

  /* Convertir el modal de impresión en una simple caja en flujo normal (static)
     ¡Esto es vital! Si tiene position: fixed o absolute, daña las hojas en Chrome */
  .modal-print-active {
    position: static !important;
    display: block !important;
    width: 80mm !important;
    height: auto !important;
    background: transparent !important;
    margin: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
    transform: none !important;
  }

  .modal-print-active * {
    visibility: visible !important;
  }

  .acciones-factura, .no-print, .btn-cerrar-modal, .btn-cerrar-ticket, .btn-imprimir-ticket {
    display: none !important;
  }

  /* Resetear contenedores internos */
  .modal-ticket-container { 
    width: 80mm !important; 
    max-width: 80mm !important; 
    margin: 0 !important;
    padding: 0 !important;
    box-shadow: none !important; 
    border: none !important;
    background: white !important;
    position: static !important;
    display: block !important;
  }

  /* Tamaño final del ticket (evita break-after por precaución) */
  .factura-ticket { 
    width: 80mm !important; 
    max-width: 80mm !important; 
    padding: 1mm 3mm 3mm 3mm !important; 
    box-sizing: border-box !important;
    display: block !important;
    margin: 0 !important;
    border: none !important;
    position: static !important;
    break-after: avoid !important;
    break-inside: avoid !important;
    page-break-after: avoid !important;
  }
}

/* Opciones de Dirección Registrada */
.opcion-direccion-registrada {
  margin-bottom: 20px;
  background: #f0f9ff;
  padding: 15px;
  border-radius: 14px;
  border: 1px solid #bae6fd;
  font-size: 13px;
  color: #0369a1;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
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
  height: 20px; width: 20px; background-color: #fff; border: 2px solid #0284c7; border-radius: 6px; 
  display: inline-block; position: relative; transition: 0.3s;
}
.checkbox-container-v2 input:checked ~ .checkmark-v2 { background-color: #0284c7; }
.checkmark-v2:after { content: ""; position: absolute; display: none; left: 6px; top: 2px; width: 5px; height: 10px; border: solid white; border-width: 0 2px 2px 0; transform: rotate(45deg); }
.checkbox-container-v2 input:checked ~ .checkmark-v2:after { display: block; }
</style>