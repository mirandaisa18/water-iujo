<template>
  <div class="app-layout">
    <Sidebar />

    <main class="main-content">
      
      <!-- HEADER PREMIUM UNIFICADO -->
      <header class="page-header header-admin-v2 no-print">
        <div class="header-left-group">
          <div class="title-container-v2">
            <h2 class="title-main-v2">{{ esAdmin ? 'Operaciones (Admin)' : 'Punto de Venta' }}</h2>
            <p class="subtitle-main-v2">{{ esAdmin ? 'Gestión global y monitoreo de caja.' : 'Panel operativo de ventas y cierres.' }}</p>
          </div>

          <!-- TABS DINÁMICAS SEG�sN ROL -->
          <div class="tabs-modern-v2" v-if="esCajero">
            <button class="t-btn-v2" :class="{ activo: tabActivaCajero === 'pos' }" @click="tabActivaCajero = 'pos'">�Y>' Caja POS</button>
            <button class="t-btn-v2" :class="{ activo: tabActivaCajero === 'resumen' }" @click="tabActivaCajero = 'resumen'">�Y"< Cierre Z</button>
          </div>
          <div class="tabs-modern-v2" v-if="esAdmin">
            <button class="t-btn-v2" :class="{ activo: tabActivaAdmin === 'pos' }" @click="tabActivaAdmin = 'pos'">�Y>' POS</button>
            <button class="t-btn-v2" :class="{ activo: tabActivaAdmin === 'dashboard' }" @click="tabActivaAdmin = 'dashboard'">�Y"S Dashboard</button>
            <button class="t-btn-v2" :class="{ activo: tabActivaAdmin === 'config' }" @click="tabActivaAdmin = 'config'">�sT️ Ajustes</button>
          </div>
        </div>

        <div class="header-right-group">
          <!-- TASA BCV INTEGRADA -->
          <div class="tasa-badge-premium-v2">
            <div class="tasa-icon-v2">�Y'�</div>
            <div class="tasa-data-v2">
              <span class="t-label">TASA BCV</span>
              <span class="t-value">Bs. {{ store.tasaBCV.toFixed(2) }}</span>
            </div>
          </div>

          <div class="user-badge-v2" @click="router.push('/configuracion')">
            <div class="user-info-v2">
              <span class="u-name">{{ nombreRol }}</span>
              <span class="u-email">{{ emailUsuario }}</span>
            </div>
            <div class="u-avatar">�Y'�</div>
          </div>
        </div>
      </header>

      <!-- VISTA ADMIN: DASHBOARD -->
      <div v-if="esAdmin && tabActivaAdmin === 'dashboard'" class="vista-admin-dashboard">
        
        <!-- KPIs Premium -->
        <div class="premium-kpi-grid">
          <div class="premium-kpi-card card-blue">
            <div class="kpi-icon-wrapper"><span class="kpi-icon">�Y'�</span></div>
            <div class="kpi-info">
              <span class="kpi-label">Ingresos del Día (USD)</span>
              <h3 class="kpi-value">${{ (ingresosDelDia || 0).toFixed(2) }}</h3>
              <div class="kpi-trend positive">
                <span class="trend-icon">�?-</span>
                <span>12.5% más que ayer</span>
              </div>
            </div>
          </div>
          
          <div class="premium-kpi-card card-purple">
            <div class="kpi-icon-wrapper"><span class="kpi-icon">�Y��</span></div>
            <div class="kpi-info">
              <span class="kpi-label">Tickets Generados</span>
              <h3 class="kpi-value">{{ ventasDelDia }}</h3>
              <div class="kpi-trend positive">
                <span class="trend-icon">�?-</span>
                <span>Flujo constante</span>
              </div>
            </div>
          </div>

          <div class="premium-kpi-card card-orange">
            <div class="kpi-icon-wrapper"><span class="kpi-icon">�Y'�</span></div>
            <div class="kpi-info">
              <span class="kpi-label">Ingresos en Bs.</span>
              <h3 class="kpi-value">Bs. {{ (ingresosDelDia * tasaBCV).toFixed(2) }}</h3>
              <div class="kpi-trend neutral">
                <span class="trend-icon">�?'</span>
                <span>Tasa: Bs. {{ tasaBCV }}</span>
              </div>
            </div>
          </div>

          <div class="premium-kpi-card card-green">
            <div class="kpi-icon-wrapper"><span class="kpi-icon">�Y'�</span></div>
            <div class="kpi-info">
              <span class="kpi-label">Productividad</span>
              <h3 class="kpi-value">�"ptima</h3>
              <div class="kpi-trend positive">
                <span class="trend-icon">�?-</span>
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
              <button class="btn-more-options">�<�</button>
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

          <!-- �sltimas Transacciones -->
          <div class="premium-table-card">
            <div class="card-header-flex">
              <h3 class="card-title-premium">�sltimas Transacciones</h3>
              <a href="#" class="view-all-link" @click.prevent="showModalTodasTransacciones = true">Ver todas</a>
            </div>
            
            <div v-if="ultimosTickets.length === 0" class="empty-state-tx">
              <span class="empty-icon">�Y��</span>
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

      <!-- VISTA ADMIN: CONFIGURACI�"N INTEGRADA -->
      <div v-if="esAdmin && tabActivaAdmin === 'config'" class="vista-admin-dashboard fade-in">
        <div class="premium-dashboard-row">
          <div class="premium-table-card config-card-main" style="flex: 1">
            <div class="tarjeta-header">
              <div class="header-con-icono">
                <span class="icono-seccion naranja">�sT️</span>
                <h3>Ajustes Maestros de Caja</h3>
              </div>
              <p class="card-subtitle-premium">Configura los parámetros críticos de la operación diaria</p>
            </div>
            
            <div class="config-pos-grid-v2">
              <div class="config-item-v2">
                <label>Tasa Cambiaria (USD/BS)</label>
                <div class="input-modern-wrapper">
                  <span class="prefix-icon">�Y'�</span>
                  <input type="number" v-model.number="store.tasaBCV" step="0.01" />
                  <button @click="store.actualizarTasa" class="btn-refresh-tasa">�Y""</button>
                </div>
              </div>
              
              <div class="config-item-v2">
                <label>Stock de Alerta</label>
                <div class="input-modern-wrapper">
                  <span class="prefix-icon">�Y"�</span>
                  <input type="number" v-model.number="store.preferenciasPOS.alertaStockBajoVal" />
                </div>
              </div>

              <div class="config-item-v2">
                <label>Próxima Factura #</label>
                <div class="input-modern-wrapper">
                  <span class="prefix-icon">�Y��</span>
                  <input type="number" v-model.number="store.proximoNumeroFactura" />
                </div>
              </div>

              <div class="config-item-v2">
                <label>IVA (%)</label>
                <div class="input-modern-wrapper">
                  <span class="prefix-icon">�Y��</span>
                  <input type="number" value="16" disabled />
                </div>
              </div>
            </div>

            <div class="config-footer-actions">
              <button class="btn-cancelar-config" @click="tabActivaAdmin = 'dashboard'">Volver</button>
              <button class="btn-guardar-premium" @click="store.persistirTodo">�Ys? Guardar Configuración</button>
            </div>
          </div>
        </div>
      </div>

      <!-- VISTA POS: TERMINAL DE VENTAS -->
      <div v-if="(esCajero && tabActivaCajero === 'pos') || (esAdmin && tabActivaAdmin === 'pos')" class="vista-pos" :class="{ 'pos-locked': !clienteSeleccionado }">
        <div v-if="!clienteSeleccionado && carrito.length === 0" class="pos-lock-overlay">
          <div class="lock-card">
            <span class="lock-icon">�Y'�</span>
            <h3>Seleccione un cliente</h3>
            <p>Debe elegir un cliente para comenzar la venta</p>
            <button class="btn-lock-action" @click="abrirSelectorCliente">Abrir Selector</button>
          </div>
        </div>

        <div class="pos-main-container">
          
          <!-- SECCI�"N IZQUIERDA: CATÁLOGO -->
          <div class="seccion-catalogo">
            <div class="controles-busqueda">
              <div class="input-busqueda-wrapper">
                <span class="lupa">�Y"�</span>
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

          <!-- SECCI�"N DERECHA: CARRITO -->
          <div class="seccion-carrito-pos">
            
            <!-- BUSCADOR / REGISTRO DE CLIENTE -->
            <div class="cliente-selector-container">
              <div v-if="!clienteSeleccionado" class="caja-cliente-vacia" @click="abrirSelectorCliente">
                <span class="icono-user-dotted">�Y'�</span>
                <span class="txt-seleccionar">Seleccionar Cliente</span>
              </div>
              <div v-else class="caja-cliente-activa">
                <div class="info-cliente-sel">
                  <span class="icono-user-full">�Y'�</span>
                  <div class="detalles-cli">
                    <span class="nom-cli">{{ clienteSeleccionado.nombre }}</span>
                    <span class="rif-cli">{{ clienteSeleccionado.rif }}</span>
                  </div>
                </div>
                <button class="btn-quitar-cli" @click="clienteSeleccionado = null">�o.</button>
              </div>
            </div>

            <div class="delivery-toggle-row">
              <div class="label-delivery">
                <span class="icono-truck">�Yss</span>
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
                        <button class="btn-gps-locate" @click="obtenerGPSOrigen" title="Usar mi ubicación actual">�Y"�</button>
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
                         <button v-if="destinosYummy.length > 1" @click="eliminarDestino(index)" class="btn-remove-dest" title="Eliminar parada">�o.</button>
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
                <div class="ilustracion-carrito">�Y>'</div>
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
                  <button class="btn-del" @click="eliminarDelCarrito(index)">�o.</button>
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
              <div class="fila-resumen">
                <span>IVA (16%)</span>
                <span>${{ ivaUSD.toFixed(2) }}</span>
              </div>
              <div v-if="delivery && costoDelivery > 0" class="fila-resumen fila-delivery-cost">
                <span class="lbl-delivery">
                  �Y>� Delivery
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
              <!-- SECCI�"N DE MULTIPAGO -->
              <div class="multi-pago-section no-print">
                <div class="cabecera-multipago">
                  <span class="metodo-label">M�?TODOS DE PAGO</span>
                  <span v-if="faltanteUSD > 0" class="badge-faltante">Falta: ${{ faltanteUSD.toFixed(2) }}</span>
                  <span v-else class="badge-pagado">¡Total Cubierto!</span>
                </div>

                <div class="lista-pagos-agregados">
                    <div v-for="(pago, idx) in metodosDePago" :key="idx" class="pago-agregado-wrapper" @click="abrirModalPago(idx)">
                      <div class="item-pago-agregado" :class="{ 'pago-listo': pago.verificado }">
                        <div class="info-pago-txt">
                          <span class="pago-met">{{ pago.metodo }} {{ pago.verificado ? '�o.' : '⏳' }}</span>
                          <div class="pago-montos">
                            <span class="pago-usd-small">${{ (pago.monto || 0).toFixed(2) }}</span>
                            <span class="pago-bs">Bs. {{ ((pago.monto || 0) * tasaBCV).toFixed(2) }}</span>
                          </div>
                        </div>
                        <div class="pago-acciones-mini">
                          <button class="btn-eliminar-pago" @click.stop="eliminarPago(idx)" v-if="!pago.verificado">�o.</button>
                          <span class="pago-edit-hint">Detalle �??</span>
                        </div>
                      </div>
                    </div>
                   <div v-if="metodosDePago.length === 0" class="pago-placeholder">
                      Selecciona un método para pagar...
                   </div>
                </div>

                <div class="grid-pagos-v2">
                  <button v-for="(met, k) in store.metodosPagoConfig" 
                          :key="k" 
                          class="pago-btn-item" 
                          @click="agregarPago(met)">
                    <span class="pago-icon-v2">
                      {{ 
                        met === 'Efectivo' ? '�Y'�' : 
                        met === 'Pago Móvil' ? '�Y"�' : 
                        met === 'Zelle' ? '�Y?��Y?�' : 
                        met === 'Tarjeta' ? '�Y'�' : 
                        met === 'Biopago' ? '�Y��' : 
                        '�Y��' 
                      }}
                    </span>
                    {{ met }}
                  </button>
                </div>
              </div>

              
              <button class="btn-cobrar-pos" :class="{ 'btn-aprobado': pagoVerificadoGlobal }" :disabled="carrito.length === 0 || !pagoVerificadoGlobal" @click="procesarPago">
                <span class="icono-pay">{{ pagoVerificadoGlobal ? '�o.' : '�Y>'' }}</span>
                {{ pagoVerificadoGlobal ? 'APROBAR Y GENERAR FACTURA' : 'ESPERANDO VERIFICACI�"N' }}
              </button>
            </div>
          </div>

        </div>
      </div>

      <!-- DASHBOARD / CIERRE Z DEL CAJERO (RESTAURADO) -->
      <div v-if="esCajero && tabActivaCajero === 'resumen'" class="vista-admin-dashboard fade-in">
        <div class="vista-cajero-print-container" id="seccion-cierre-z">
           <!-- KPIs del Turno -->
           <div class="premium-kpi-grid">
              <div class="premium-kpi-card card-blue">
                <div class="kpi-icon-wrapper"><span class="kpi-icon">�Y'�</span></div>
                <div class="kpi-info">
                  <span class="kpi-label">Ventas POS</span>
                  <h3 class="kpi-value">${{ totalVentasPOSCajero.toFixed(2) }}</h3>
                </div>
              </div>
              <div class="premium-kpi-card card-purple">
                <div class="kpi-icon-wrapper"><span class="kpi-icon">�YO�</span></div>
                <div class="kpi-info">
                  <span class="kpi-label">Ventas Web</span>
                  <h3 class="kpi-value">${{ totalVentasWebCajero.toFixed(2) }}</h3>
                </div>
              </div>
              <div class="premium-kpi-card card-green">
                <div class="kpi-icon-wrapper"><span class="kpi-icon">�Y"S</span></div>
                <div class="kpi-info">
                  <span class="kpi-label">Total del Turno</span>
                  <h3 class="kpi-value">${{ (totalVentasPOSCajero + totalVentasWebCajero).toFixed(2) }}</h3>
                </div>
              </div>
           </div>

           <!-- Documento de Cierre -->
           <div class="premium-table-card documento-a4" style="margin-top: 25px;">
              <div class="doc-header">
                <div class="doc-logo-title">
                  <div class="logo-water">�Y'�</div>
                  <div>
                    <h2>WATER IUJO</h2>
                    <p>RIF: J-50000000-0</p>
                  </div>
                </div>
                <div class="doc-info">
                  <h1 class="doc-title">REPORTE Z - CIERRE DE CAJA</h1>
                  <p><strong>Fecha:</strong> {{ new Date().toLocaleDateString() }}</p>
                  <p><strong>Cajero:</strong> {{ store.perfilUsuario.nombre || 'Cajero Principal' }}</p>
                </div>
              </div>

              <div class="doc-seccion">
                <h3 class="seccion-titulo">Resumen de Métodos de Pago</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr v-for="(datos, metodo) in totalesPorMetodo" :key="metodo" style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 10px; font-weight: 600;">{{ metodo }}</td>
                    <td style="padding: 10px; text-align: right;">${{ datos.total.toFixed(2) }}</td>
                  </tr>
                </table>
              </div>

              <div class="doc-firmas-container no-print" style="margin-top: 30px;">
                <button class="btn-guardar-premium" @click="imprimirPantalla" style="width: 100%;">�Y-�️ Generar Reporte de Cierre Z</button>
              </div>
           </div>

           <!-- Lista de Transacciones en Tiempo Real -->
           <div class="premium-table-card" style="margin-top: 25px;">
              <div class="card-header-flex">
                 <h3>Transacciones Recientes (Tiempo Real)</h3>
                 <span class="badge-rol-admin">{{ store.tickets.length }} Operaciones</span>
              </div>
              <div class="tx-list">
                 <div v-for="t in [...store.tickets].reverse()" :key="t.id" class="tx-item" @click="verDetalleTicketAdmin(t)">
                    <div class="tx-info-col">
                       <span class="tx-id">#{{ t.id }}</span>
                       <span class="tx-time">{{ t.hora || 'Ahora' }}</span>
                    </div>
                    <div class="tx-method-col">
                       <span class="badge-method">{{ t.metodo || 'Varios' }}</span>
                    </div>
                    <div class="tx-amount-col">
                       <span class="tx-amount" style="color: #10b981;">+${{ t.monto.toFixed(2) }}</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <!-- MODAL PARA CLIENTES (Búsqueda y Registro) -->
      <div v-if="showModalCliente" class="super-modal-overlay">
        <div class="modal-cliente-content">
          <div class="modal-header">
            <h3>{{ modoRegistro ? 'Registrar Nuevo Cliente' : 'Buscar Cliente' }}</h3>
            <button class="btn-cerrar-modal" @click="showModalCliente = false">�o.</button>
          </div>

          <!-- MODO B�sSQUEDA -->
          <div v-if="!modoRegistro" class="cuerpo-busqueda">
            <div class="input-grande-wrapper">
              <input type="text" v-model="busquedaCliente" placeholder="Nombre o RIF/Cédula..." autofocus />
            </div>
            
            <div class="lista-resultados-clientes">
              <div v-for="cli in clientesFiltrados" :key="cli.rif" class="result-cliente-item" @click="seleccionarCliente(cli)">
                <div class="avatar-cli">�Y'�</div>
                <div class="txts-cli">
                  <strong>{{ cli.nombre }}</strong>
                  <span>{{ cli.rif }}</span>
                </div>
                <button class="btn-check-cli">�o"</button>
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

    <!-- ZONA DE MODALES GLOBALES (Aislados para impresión) -->
    <!-- MODAL DE FACTURA / TICKET -->
    <div v-if="showFacturaModal" class="super-modal-overlay modal-print-active">
        <div v-if="datosFactura" class="modal-ticket-container">
          <TicketPos :factura="datosFactura" />
          
          <div class="acciones-factura no-print">
            <button class="btn-imprimir-ticket" @click="imprimirFactura">�Y-�️ Imprimir Factura</button>
            <button class="btn-cerrar-ticket" @click="finalizarVenta">Cerrar y Nueva Venta</button>
          </div>
        </div>
      </div>

      <!-- MODAL TODAS LAS TRANSACCIONES (ADMIN) -->
      <div v-if="showModalTodasTransacciones" class="super-modal-overlay no-print">
        <div class="modal-cliente-content modal-tx-lista">
          <div class="modal-header">
            <h3>Todas las Transacciones (Hoy)</h3>
            <button class="btn-cerrar-modal" @click="showModalTodasTransacciones = false">�o.</button>
          </div>
          <div class="lista-todas scroll-modal-list">
            <div v-if="store.tickets.length === 0" class="empty-state-tx">
              <span class="empty-icon">�Y��</span>
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

      <!-- MODAL DETALLE DE TICKET HIST�"RICO (ADMIN) -->
      <div v-if="showDetalleTicketModal" class="super-modal-overlay modal-print-active">
        <div class="modal-ticket-container">
          <TicketPos :factura="ticketSeleccionadoAdmin" />
          
          <div v-if="ticketSeleccionadoAdmin?.deliveryInfo" class="evidencia-delivery no-print" style="margin-top: 20px; text-align: center; border-top: 1px dashed #cbd5e1; padding-top: 15px;">
             <h4 style="color: #1e293b; margin-bottom: 5px;">�Y"� Seguimiento de Delivery</h4>
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
            <button class="btn-imprimir-ticket" @click="imprimirTicketAdmin">�Y-�️ Imprimir Ticket</button>
            <button class="btn-cerrar-ticket" @click="showDetalleTicketModal = false">Cerrar Detalle</button>
          </div>
        </div>
      </div>

      <!-- MODAL VER IMAGEN (COMPROBANTE) -->
      <div v-if="imagenAmpliadaUrl" class="super-modal-overlay no-print" @click="imagenAmpliadaUrl = null">
        <div class="modal-imagen-content anim-bounce" style="position: relative; max-width: 90%; text-align: center;" @click.stop>
          <button class="btn-cerrar-modal pos-abs" style="position: absolute; top: -15px; right: -15px; background: #ef4444; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 20px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.3); z-index: 10;" @click="imagenAmpliadaUrl = null">�o.</button>
          <img :src="imagenAmpliadaUrl" style="max-width: 100%; max-height: 85vh; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.3);" />
        </div>
      </div>

      <!-- MODAL DE NOTIFICACIONES: PEDIDOS WEB -->
      <div v-if="showNotificaciones" class="super-modal-overlay no-print">
        <div class="modal-cliente-content modal-notificaciones">
          <header class="modal-header">
            <h3>�Y"" Pedidos Web por Validar</h3>
            <button class="btn-cerrar-modal" @click="showNotificaciones = false">�o.</button>
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
 
       <!-- MODAL DETALLE DE PAGO (DEDICADO) -->
       <div v-if="showModalPagoDetalle" class="super-modal-overlay no-print">
         <div class="modal-pago-detalle-content anim-bounce">
           <div class="modal-pago-header">
              <div class="header-pago-info">
                <span class="lbl-pago-met">M�?TODO: {{ pagoSeleccionado?.metodo }}</span>
                <div class="total-a-pagar-badge">
                  <span class="lbl-total">Total a Pagar</span>
                  <span class="val-total">${{ totalUSD.toFixed(2) }}</span>
                </div>
              </div>
              <button class="btn-cerrar-pago-modal" @click="showModalPagoDetalle = false">�o.</button>
           </div>
 
           <div class="modal-pago-body" v-if="pagoSeleccionado">
              <div class="campos-modal-grid">
                
                <!-- Monto a Abonar -->
                <div class="pago-field-card full-width highlight-card">
                   <div class="pago-field-icon">�Y'�</div>
                   <div class="pago-field-body">
                     <label>Monto a Abonar (USD)</label>
                     <input type="number" v-model.number="pagoSeleccionado.monto" @input="pagoSeleccionado.montoBS = pagoSeleccionado.monto * tasaBCV" :disabled="pagoSeleccionado.verificado" />
                   </div>
                   <div class="monto-bs-tag">Bs. {{ (pagoSeleccionado.monto * tasaBCV).toFixed(2) }}</div>
                </div>
 
                <!-- Efectivo -->
                <template v-if="pagoSeleccionado.metodo === 'Efectivo'">
                  <div class="pago-field-card">
                    <div class="pago-field-icon">�Y'�</div>
                    <div class="pago-field-body">
                      <label>Monto Recibido USD</label>
                      <input type="number" v-model.number="pagoSeleccionado.recibido" placeholder="0.00" />
                    </div>
                  </div>
                  <div class="pago-field-card">
                    <div class="pago-field-icon">�Y�T</div>
                    <div class="pago-field-body">
                      <label>Cambio a devolver</label>
                      <span class="txt-cambio-grande">
                        ${{ Math.max(0, (pagoSeleccionado.recibido || 0) - pagoSeleccionado.monto).toFixed(2) }}
                      </span>
                    </div>
                  </div>
                </template>
 
                <!-- Pago Móvil / Transferencia -->
                <template v-if="pagoSeleccionado.metodo === 'Pago Móvil' || pagoSeleccionado.metodo === 'Transferencia'">
                  <div class="pago-field-card full-width" :class="{ 'field-missing': !pagoSeleccionado.telefono_pago }">
                    <div class="pago-field-icon">�Y"�</div>
                    <div class="pago-field-body">
                      <label>Número de Teléfono *</label>
                      <input type="text" v-model="pagoSeleccionado.telefono_pago" placeholder="Ej: 04121234567" :disabled="pagoSeleccionado.verificado" />
                    </div>
                  </div>
                  <div class="pago-field-card" :class="{ 'field-missing': !pagoSeleccionado.referencia }">
                    <div class="pago-field-icon">�Y"�</div>
                    <div class="pago-field-body">
                      <label>Referencia *</label>
                      <input type="text" v-model="pagoSeleccionado.referencia" placeholder="Referencia" :disabled="pagoSeleccionado.verificado" />
                    </div>
                  </div>
                  <div class="pago-field-card" :class="{ 'field-missing': !pagoSeleccionado.banco }">
                    <div class="pago-field-icon">�Y��</div>
                    <div class="pago-field-body">
                      <label>Banco Emisor *</label>
                      <select v-model="pagoSeleccionado.banco" :disabled="pagoSeleccionado.verificado">
                        <option value="" disabled>Seleccione Banco</option>
                        <option>Banco de Venezuela</option>
                        <option>Banesco</option>
                        <option>Mercantil</option>
                        <option>Provincial</option>
                        <option>Otros</option>
                      </select>
                    </div>
                  </div>
                  <div class="pago-field-card" :class="{ 'field-missing': !pagoSeleccionado.pagador }">
                    <div class="pago-field-icon">�Y'�</div>
                    <div class="pago-field-body">
                      <label>Nombre del Pagador *</label>
                      <input type="text" v-model="pagoSeleccionado.pagador" placeholder="Nombre completo" :disabled="pagoSeleccionado.verificado" />
                    </div>
                  </div>
                  <div class="pago-field-card">
                    <div class="pago-field-icon">�Y"z</div>
                    <div class="pago-field-body">
                      <label>Teléfono de Contacto</label>
                      <input type="text" v-model="pagoSeleccionado.telefono" placeholder="04xx-xxxxxxx" :disabled="pagoSeleccionado.verificado" />
                    </div>
                  </div>
                </template>
 
                <!-- Zelle -->
                <template v-if="pagoSeleccionado.metodo === 'Zelle'">
                  <div class="pago-field-card full-width" :class="{ 'field-missing': !pagoSeleccionado.correo }">
                    <div class="pago-field-icon">�Y"�</div>
                    <div class="pago-field-body">
                      <label>Correo Zelle *</label>
                      <input type="email" v-model="pagoSeleccionado.correo" placeholder="Correo electrónico" :disabled="pagoSeleccionado.verificado" />
                    </div>
                  </div>
                  <div class="pago-field-card" :class="{ 'field-missing': !pagoSeleccionado.referencia }">
                    <div class="pago-field-icon">�Y"�</div>
                    <div class="pago-field-body">
                      <label>Referencia *</label>
                      <input type="text" v-model="pagoSeleccionado.referencia" placeholder="Número" :disabled="pagoSeleccionado.verificado" />
                    </div>
                  </div>
                  <div class="pago-field-card" :class="{ 'field-missing': !pagoSeleccionado.pagador }">
                    <div class="pago-field-icon">�Y'�</div>
                    <div class="pago-field-body">
                      <label>Nombre Titular *</label>
                      <input type="text" v-model="pagoSeleccionado.pagador" placeholder="Titular de cuenta" :disabled="pagoSeleccionado.verificado" />
                    </div>
                  </div>
                </template>
              </div>
 
              <div class="modal-pago-footer">
                <div v-if="pagoSeleccionado.verificado" class="banner-exito-pago anim-fade-in">
                  �o. PAGO VERIFICADO CORRECTAMENTE
                </div>
                
                <button v-if="pagoSeleccionado.metodo !== 'Efectivo' && !pagoSeleccionado.verificado" 
                        class="btn-verificar-premium-modal" 
                        :disabled="!pagoSeleccionado.referencia || (pagoSeleccionado.metodo !== 'Zelle' && !pagoSeleccionado.banco) || !pagoSeleccionado.pagador"
                        @click="verificarPagoIndividual(pagoSeleccionadoIdx)">
                  VERIFICAR PAGO
                </button>
 
                <button class="btn-finalizar-pago-modal" @click="showModalPagoDetalle = false">
                  LISTO / CONTINUAR
                </button>
              </div>
           </div>
         </div>
       </div>
    </main>
  </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue';
import TicketPos from '../components/TicketPos.vue';
import { ref, computed, onMounted, onUnmounted, watch, nextTick, shallowRef } from 'vue';
import { useRouter } from 'vue-router';
import { useSistemaStore } from '../stores/sistema';
import { listaProductosInventario, listaClientesData } from '../data/mockData';
import html2pdf from 'html2pdf.js';

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
const tabActivaCajero = ref('pos');

const totalesPorMetodo = computed(() => {
  const metodos = {
    'Efectivo': { pos: 0, web: 0, total: 0 },
    'Zelle': { pos: 0, web: 0, total: 0 },
    'Pago Móvil': { pos: 0, web: 0, total: 0 },
    'Transferencia': { pos: 0, web: 0, total: 0 },
    'Biopago': { pos: 0, web: 0, total: 0 },
    'Tarjeta': { pos: 0, web: 0, total: 0 }
  };
  
  store.tickets.forEach(t => {
    const tipoVenta = t.origen === 'cliente' ? 'web' : 'pos';
    if (t.metodosPago && Array.isArray(t.metodosPago)) {
      t.metodosPago.forEach(p => {
        if (!metodos[p.metodo]) metodos[p.metodo] = { pos: 0, web: 0, total: 0 };
        metodos[p.metodo][tipoVenta] += p.monto;
        metodos[p.metodo].total += p.monto;
      });
    } else if (t.metodo) {
      if (!metodos[t.metodo]) metodos[t.metodo] = { pos: 0, web: 0, total: 0 };
      metodos[t.metodo][tipoVenta] += (t.monto || 0);
      metodos[t.metodo].total += (t.monto || 0);
    }
  });
  return metodos;
});

const totalVentasPOSCajero = computed(() => store.tickets.filter(t => t.origen !== 'cliente').reduce((sum, t) => sum + (t.monto || 0), 0));
const totalVentasWebCajero = computed(() => store.tickets.filter(t => t.origen === 'cliente').reduce((sum, t) => sum + (t.monto || 0), 0));

const imprimirPantalla = () => {
  const elemento = document.getElementById('seccion-cierre-z');
  if (!elemento) return;

  const opciones = {
    margin: 10,
    filename: `cierre-z-${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().from(elemento).set(opciones).save();
};
 // Default to POS for better usability as requested

const showModalTodasTransacciones = ref(false);
const showDetalleTicketModal = ref(false);
const ticketSeleccionadoAdmin = ref(null);

const verDetalleTicketAdmin = (ticket) => {
  ticketSeleccionadoAdmin.value = ticket;
  showDetalleTicketModal.value = true;
};

const imprimirTicketAdmin = () => {
  const elemento = document.getElementById('seccion-ticket');
  if (!elemento) return;

  const opciones = {
    margin: 0,
    filename: `ticket-${ticketSeleccionadoAdmin.value?.id || 'admin'}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 3, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: [80, 250], orientation: 'portrait' }
  };
  html2pdf().from(elemento).set(opciones).save();
};

// ESTADO POS
const busquedaPOS = ref('');
const carrito = ref([]);
const metodosDePago = ref([]); // [{ metodo: 'Efectivo', monto: 0, montoBS: 0, referencia: '', banco: '', pagador: '', telefono: '', verificado: false }]
const pagoVerificadoGlobal = ref(false); // Bandera para habilitar el botón final de cobro

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
    montoBS: montoAIngresar * tasaBCV.value,
    referencia: '',
    banco: '',
    pagador: '',
    telefono: '',
    correo: '',
    ultimos4: '',
    recibido: montoAIngresar,
    verificado: false // Todos inician sin verificar para mostrar campos
  });
  pagoVerificadoGlobal.value = false;
  
  // Abrir modal automáticamente para el nuevo pago
  abrirModalPago(metodosDePago.value.length - 1);
};

const showModalPagoDetalle = ref(false);
const pagoSeleccionadoIdx = ref(-1);
const pagoSeleccionado = computed(() => {
  if (pagoSeleccionadoIdx.value === -1) return null;
  return metodosDePago.value[pagoSeleccionadoIdx.value];
});

const abrirModalPago = (idx) => {
  pagoSeleccionadoIdx.value = idx;
  showModalPagoDetalle.value = true;
};

const verificarPagoIndividual = (idx) => {
  const p = metodosDePago.value[idx];
  
  if (p.metodo === 'Pago Móvil' || p.metodo === 'Transferencia') {
    if (!p.referencia || !p.banco || !p.pagador) {
      alert("Por favor complete los campos obligatorios.");
      return;
    }
  }

  p.verificado = true;
  
  // Si todos están listos, habilitar el botón global
  if (metodosDePago.value.every(m => m.metodo === 'Efectivo' || m.verificado)) {
    pagoVerificadoGlobal.value = true;
  }
};

// Observador para habilitar el botón de cobrar automáticamente si solo hay efectivo
watch(metodosDePago, (nuevos) => {
  if (nuevos.length > 0 && nuevos.every(m => m.metodo === 'Efectivo' || m.verificado)) {
    pagoVerificadoGlobal.value = true;
  } else {
    pagoVerificadoGlobal.value = false;
  }
}, { deep: true });

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

  direccionDeliverySimple.value = validStops.map(d => d.direccion).join(' �?' ');

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


// PRODUCTOS MOCK (Agregamos cantidadTemp para el contador)
const listaProductosPOS = ref(listaProductosInventario);


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
const ivaUSD = computed(() => subTotalUSD.value * 0.16);
const totalUSD = computed(() => subTotalUSD.value + ivaUSD.value + (delivery.value ? costoDelivery.value : 0));
const totalBS = computed(() => totalUSD.value * tasaBCV.value);
const totalItemsCarrito = computed(() => carrito.value.reduce((sum, i) => sum + i.cantidad, 0));

// Datos del Admin (Tickets)
const ingresosDelDia = computed(() => store.ingresosDelDia);
const ventasDelDia = computed(() => store.ventasDelDia);
const ultimosTickets = computed(() => {
  return [...store.tickets].reverse().slice(0, 5); // �sltimas 5 transacciones
});

// M�?TODOS
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
    const cli = { ...nuevoCliente.value, origen: 'POS' };
    const res = await store.guardarClienteDB(cli); // persistir en SQLite vía Backend
    
    if (res && (res.success || res.id)) {
      clienteSeleccionado.value = res.client || { ...cli, id: res.id };
      showModalCliente.value = false;
      nuevoCliente.value = { nombre: '', rif: '', telefono: '', direccion: '' };
      alert('Cliente guardado exitosamente en Base de Datos Profesional.');
      await store.fetchClientes(); // Refrescar lista global
    } else {
      alert('Error al guardar cliente: ' + (res.error || 'Desconocido'));
    }
  } else {
    alert('Por favor rellena al menos el Nombre y Cédula/RIF del cliente');
  }
};

const procesarPago = () => {
  // 1. VALIDACI�"N: Carrito no vacío
  if (carrito.value.length === 0) {
    alert('�s�️ El carrito está vacío. Agregue productos para continuar.');
    return;
  }

  // 2. VALIDACI�"N: Cliente seleccionado
  if (!clienteSeleccionado.value) {
    alert('�s�️ Por favor, seleccione un cliente para procesar la factura.');
    return;
  }

  // 3. VALIDACI�"N: Pago completo
  if (faltanteUSD.value > 0.01) {
    alert(`�s�️ El pago está incompleto. Faltan $${faltanteUSD.value.toFixed(2)} por cubrir.`);
    return;
  }

  if (metodosDePago.value.length === 0) {
    alert('�s�️ Debe registrar al menos un método de pago.');
    return;
  }

  // 4. VALIDACI�"N: Aprobación de Pago (RESTAURADO)
  if (!pagoVerificadoGlobal.value) {
    alert('�s�️ Debe verificar y aprobar los pagos electrónicos antes de generar la factura.');
    return;
  }

  const ahora = new Date();
  facturaRegistradaPerSale.value = false; // Reiniciar bandera para esta nueva factura
  
  // Guardamos los datos para la factura
  const correlativo = store.proximoNumeroFactura.toString().padStart(3, '0');
  
  datosFactura.value = {
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
    ivaUSD: ivaUSD.value,
    totalUSD: totalUSD.value,
    totalBS: totalBS.value,
    metodo: metodosDePago.value.length === 1 ? metodosDePago.value[0].metodo : 'PAGOS M�sLTIPLES',
    delivery: delivery.value ? {
       costo: costoDelivery.value,
       direccion: destinosYummy.value[destinosYummy.value.length - 1].direccion || direccionDeliverySimple.value || 'N/A',
       destinos: [...destinosYummy.value],
       distancia: distanciaKms.value,
       nota: notaDelivery.value
    } : null
  };

  // Mostrar modal de factura y registrar de inmediato
  showFacturaModal.value = true;
  
  if (datosFactura.value && !facturaRegistradaPerSale.value) {
    store.registrarVentaGlobal({
      ...datosFactura.value,
      monto: totalUSD.value,
      metodo: metodosDePago.value.length > 1 ? 'Múltiple' : metodosDePago.value[0].metodo
    });
    facturaRegistradaPerSale.value = true;
  }
};

const imprimirFactura = () => {
  const elemento = document.getElementById('seccion-ticket');
  if (!elemento) {
    alert("Error: No se encontró el elemento del ticket.");
    return;
  }

  // Incrementar contador si es la primera vez
  if (datosFactura.value && !datosFactura.value.impreso) {
    store.incrementarFactura();
    datosFactura.value.impreso = true;
  }

  const opciones = {
    margin: 0,
    filename: `factura-${datosFactura.value?.numero || 'pos'}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 3, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: [80, 250], orientation: 'portrait' }
  };

  // Generar y descargar el PDF
  html2pdf().from(elemento).set(opciones).save();
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

onMounted(() => {
  console.log('DEBUG: VentasView Mounted', {
    rol: store.rolUsuario,
    esAdmin: esAdmin.value,
    esCajero: esCajero.value,
    tabActivaAdmin: tabActivaAdmin.value
  });
  
  // Carga inicial de datos
  store.fetchGeneralData();
  
  // PROBLEMA 3: Polling cada 5 segundos para tiempo real
  bcvInterval = setInterval(() => {
    store.fetchGeneralData();
  }, 5000);
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
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #ffffff;
  padding: 20px;
  border-radius: 12px;
  margin: 20px 0;
  border: 1px solid #eef2f6;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
}

.cabecera-multipago {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.metodo-label {
  font-size: 11px;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-faltante {
  background: #fff1f2;
  color: #e11d48;
  padding: 4px 12px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid #ffe4e6;
}

.badge-pagado {
  background: #f0fdf4;
  color: #16a34a;
  padding: 4px 12px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid #dcfce7;
}

.lista-pagos-agregados {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 180px;
  overflow-y: auto;
  padding-right: 4px;
}

.pago-agregado-wrapper {
  background: #ffffff;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.pago-agregado-wrapper:hover {
  border-color: #2196F3;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.08);
}

.item-pago-agregado {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-pago-agregado.pago-listo {
  background: #f0f7ff;
  border-left: 4px solid #2196F3;
}

.pago-met {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 2px;
}

.pago-montos {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pago-usd-small {
  font-size: 14px;
  font-weight: 800;
  color: #1e293b;
}

.pago-bs {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
}

.pago-acciones-mini {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-eliminar-pago {
  background: #fff1f2;
  color: #e11d48;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  transition: 0.2s;
}

.btn-eliminar-pago:hover {
  background: #e11d48;
  color: white;
}

.pago-placeholder {
  text-align: center;
  padding: 24px;
  color: #94a3b8;
  font-size: 12px;
  background: #f8fafc;
  border: 1.5px dashed #e2e8f0;
  border-radius: 12px;
}

.grid-pagos-v2 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 10px;
}

.pago-btn-item {
  background: #ffffff;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  padding: 14px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 11px;
  font-weight: 700;
  color: #475569;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.pago-btn-item:hover {
  background: #ffffff;
  border-color: #2196F3;
  color: #2196F3;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(33, 150, 243, 0.12);
}

.pago-icon-v2 {
  font-size: 22px;
  width: 44px;
  height: 44px;
  background: #f8fafc;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
}

.pago-btn-item:hover .pago-icon-v2 {
  background: #e3f2fd;
  color: #2196F3;
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
/* CAT�LOGO PREMIUM */
.seccion-catalogo {
  flex: 1;
  background: white;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
  border: 1px solid #f1f5f9;
}
.controles-busqueda {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}
.input-busqueda-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 15px;
  transition: all 0.2s;
}
.input-busqueda-wrapper:focus-within {
  border-color: #2196F3;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.08);
  background: white;
}
.lupa { color: #94a3b8; margin-right: 12px; font-size: 16px; }
.input-busqueda-wrapper input {
  border: none; outline: none; width: 100%; font-size: 14px; font-weight: 500; color: #1e293b; background: transparent;
}
.select-categoria {
  border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 0 15px; font-size: 12px; font-weight: 700; color: #475569; cursor: pointer; background: white; transition: 0.2s;
}
.select-categoria:hover { border-color: #cbd5e1; }

/* LISTA DE PRODUCTOS PREMIUM */
.lista-productos-pos { flex: 1; overflow-y: auto; display: flex; flex-direction: column; padding-right: 5px; }
.item-producto-fila {
  display: flex; align-items: center; padding: 16px 10px; border-bottom: 1px solid #f8fafc; transition: all 0.2s; border-radius: 8px;
}
.item-producto-fila:hover { 
  background: #f0f7ff; 
  transform: translateX(5px);
}

.info-producto-detalles { flex: 1; }
.nombre-principal { font-size: 15px; font-weight: 700; color: #1e293b; display: flex; align-items: center; gap: 8px; }
.badge-servicio { background: #e0f2fe; color: #0369a1; font-size: 10px; padding: 3px 10px; border-radius: 6px; font-weight: 700; text-transform: uppercase; }
.datos-secundarios { display: flex; gap: 12px; margin-top: 6px; }
.tag-categoria { font-size: 11px; color: #94a3b8; font-weight: 600; background: #f1f5f9; padding: 2px 8px; border-radius: 4px; }
.tag-stock { font-size: 11px; color: #10b981; font-weight: 700; display: flex; align-items: center; gap: 4px; }
.tag-stock::before { content: "?"; font-size: 8px; }

.precios-item { text-align: right; min-width: 110px; }
.precio-usd-bold { font-size: 17px; font-weight: 800; color: #1e293b; }
.precio-bs-sub { font-size: 11px; color: #94a3b8; font-weight: 600; }

/* CONTROLES MINI EN CARRITO PREMIUM */
.item-cart-controls-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}
.mini-control-cant {
  display: flex;
  align-items: center;
  background: #f1f5f9;
  border-radius: 8px;
  padding: 3px;
}
.btn-mini-cant {
  width: 24px; height: 24px; border: none; background: white; border-radius: 6px; cursor: pointer; color: #2196F3; font-weight: 800; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.btn-mini-cant:hover { background: #2196F3; color: white; }
.val-mini-cant {
  width: 35px;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  border: none;
  background: transparent;
  outline: none;
}

.btn-add-circle {
  width: 36px; height: 36px; border-radius: 10px; border: none; background-color: #f1f7ff; color: #2196F3; font-size: 22px; font-weight: 700; display: flex; justify-content: center; align-items: center; cursor: pointer; transition: all 0.2s;
}
.btn-add-circle:hover { background: #2196F3; color: white; transform: scale(1.1); }


/* CARRITO */
/* CARRITO PREMIUM */
.seccion-carrito-pos {
  width: 400px; 
  background: white; 
  border-radius: 12px; 
  display: flex; 
  flex-direction: column; 
  padding: 20px; 
  box-shadow: 0 4px 20px rgba(0,0,0,0.04); 
  overflow-y: auto;
  border: 1px solid #f1f5f9;
}

.cliente-selector-container { margin-bottom: 20px; }
.caja-cliente-vacia {
  border: 2px dashed #e2e8f0; 
  border-radius: 12px; 
  padding: 20px; 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  color: #94a3b8; 
  cursor: pointer; 
  transition: all 0.2s;
  background: #fcfdfe;
}
.caja-cliente-vacia:hover { 
  border-color: #2196F3; 
  color: #2196F3; 
  background: #f0f7ff; 
  transform: translateY(-2px);
}
.icono-user-dotted { font-size: 28px; margin-bottom: 8px; opacity: 0.6; }
.txt-seleccionar { font-size: 14px; font-weight: 700; }

.caja-cliente-activa {
  background: #f8fafc; 
  border-radius: 12px; 
  padding: 14px 18px; 
  display: flex; 
  justify-content: space-between; 
  align-items: center;
  border: 1px solid #eef2f6;
}
.info-cliente-sel { display: flex; align-items: center; gap: 14px; }
.icono-user-full { font-size: 22px; color: #2196F3; }
.detalles-cli { display: flex; flex-direction: column; }
.nom-cli { font-size: 15px; font-weight: 700; color: #1e293b; }
.rif-cli { font-size: 12px; color: #64748b; font-weight: 500; }
.btn-quitar-cli { background: #fee2e2; border: none; color: #ef4444; width: 28px; height: 28px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
.btn-quitar-cli:hover { background: #ef4444; color: white; }

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

.lista-items-carrito { flex: 1; min-height: 150px; overflow-y: auto; padding-right: 5px; margin-bottom: 20px; }
.carrito-vacio-state { text-align: center; margin-top: 60px; color: #cbd5e1; }
.ilustracion-carrito { font-size: 70px; margin-bottom: 15px; opacity: 0.2; }
.carrito-vacio-state h4 { margin: 0; color: #94a3b8; font-weight: 700; }
.carrito-vacio-state p { font-size: 13px; margin-top: 5px; }

.item-cart-fila { display: flex; align-items: center; padding: 14px 0; border-bottom: 1px dashed #f1f5f9; }
.item-cart-main { flex: 1; display: flex; gap: 10px; align-items: center; }
.item-cant { font-size: 13px; color: #2196F3; font-weight: 800; background: #f0f7ff; padding: 3px 8px; border-radius: 6px; }
.item-nom { font-size: 14px; color: #1e293b; font-weight: 600; }
.item-cart-precio { font-size: 14px; font-weight: 700; color: #1e293b; margin-right: 15px; }
.btn-del { border: none; background: transparent; color: #cbd5e1; cursor: pointer; transition: 0.2s; font-size: 16px; }
.btn-del:hover { color: #ef4444; }

.footer-carrito-pos { border-top: 2px solid #f8fafc; padding-top: 20px; background: white; }
.fila-resumen { display: flex; justify-content: space-between; font-size: 14px; color: #64748b; margin-bottom: 10px; font-weight: 500; }
.fila-delivery-cost { padding-bottom: 10px; border-bottom: 1px dashed #f1f5f9; margin-bottom: 15px; align-items: flex-start; }
.lbl-delivery { color: #2196F3; font-weight: 700; display: flex; flex-direction: column; gap: 2px; }
.tag-paradas-extras { font-size: 11px; color: #64748b; font-weight: normal; margin-left: 0; margin-top: 2px; }
.costo-delivery { color: #2196F3; font-weight: 800; align-self: flex-start; font-size: 15px; }
.fila-resumen-total { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.usd-grande { font-size: 24px; font-weight: 800; color: #1e293b; }

.btn-cobrar-pos { 
  background: #2196F3; 
  color: white; 
  border: none; 
  padding: 18px; 
  border-radius: 12px; 
  font-weight: 800; 
  font-size: 15px; 
  cursor: pointer; 
  transition: all 0.3s; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  gap: 12px; 
  width: 100%; 
  margin-top: 15px;
  box-shadow: 0 4px 15px rgba(33, 150, 243, 0.2);
}
.btn-cobrar-pos:hover:not(:disabled) { 
  background: #1976D2; 
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(33, 150, 243, 0.3);
}
.btn-cobrar-pos.btn-aprobado {
  background: #10b981 !important;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2);
}
.btn-cobrar-pos.btn-aprobado:hover:not(:disabled) {
  background: #059669 !important;
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
}
.btn-cobrar-pos:disabled { 
  background: #cbd5e1;
  color: #94a3b8;
  cursor: not-allowed; 
  box-shadow: none;
}

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

/* MODAL PREMIUM STYLES */
.super-modal-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(4px); display: flex; justify-content: center; align-items: center; z-index: 2000;
}
.modal-cliente-content {
  background: white; width: 90%; max-width: 500px; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); overflow: hidden; border: 1px solid rgba(255,255,255,0.1);
}
.modal-header {
  padding: 24px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; background: #ffffff;
}
.modal-header h3 { font-size: 20px; font-weight: 800; color: #1e293b; margin: 0; }
.btn-cerrar-modal { background: #f1f5f9; border: none; width: 32px; height: 32px; border-radius: 8px; font-size: 14px; color: #64748b; cursor: pointer; transition: 0.2s; }
.btn-cerrar-modal:hover { background: #e2e8f0; color: #1e293b; }

.cuerpo-busqueda, .cuerpo-registro { padding: 30px; }
.input-grande-wrapper input {
  width: 100%; padding: 18px 24px; border: 2.5px solid #f1f5f9; border-radius: 14px; font-size: 16px; font-weight: 600; outline: none; transition: all 0.3s; color: #1e293b; background: #fcfdfe;
}
.input-grande-wrapper input:focus { border-color: #2196F3; background: white; box-shadow: 0 4px 15px rgba(33, 150, 243, 0.1); }

.lista-resultados-clientes { margin-top: 25px; max-height: 300px; overflow-y: auto; padding-right: 5px; }
.result-cliente-item { display: flex; align-items: center; padding: 14px; border-radius: 12px; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; }
.result-cliente-item:hover { background: #f0f7ff; border-color: #e0f2fe; }
.avatar-cli { width: 40px; height: 40px; background: #e3f2fd; color: #2196F3; border-radius: 10px; display: flex; justify-content: center; align-items: center; margin-right: 18px; font-size: 18px; }
.txts-cli { flex: 1; display: flex; flex-direction: column; }
.txts-cli strong { font-size: 15px; color: #1e293b; font-weight: 700; }
.txts-cli span { font-size: 12px; color: #94a3b8; font-weight: 500; }
.btn-check-cli { background: #2196F3; border: none; color: white; width: 30px; height: 30px; border-radius: 8px; font-size: 14px; display: none; }
.result-cliente-item:hover .btn-check-cli { display: flex; align-items: center; justify-content: center; }

.no-cli-found { text-align: center; padding: 30px; font-size: 14px; color: #64748b; }
.btn-link-reg { background: transparent; border: none; color: #2196F3; font-weight: 700; cursor: pointer; text-decoration: underline; }

.btn-abrir-registro {
  width: 100%; margin-top: 25px; padding: 15px; background: #f0f7ff; color: #2196F3; border: 2px dashed #2196F3; border-radius: 12px; font-weight: 800; font-size: 14px; cursor: pointer; transition: 0.2s;
}
.btn-abrir-registro:hover { background: #e0f2fe; transform: translateY(-2px); }

.form-grid-cli { display: flex; flex-direction: column; gap: 20px; }
.campo-cli { display: flex; flex-direction: column; gap: 8px; }
.campo-cli label { font-size: 12px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
.campo-cli input { padding: 14px; border: 1.5px solid #eef2f6; border-radius: 10px; outline: none; font-size: 14px; font-weight: 600; color: #1e293b; transition: 0.2s; }
.campo-cli input:focus { border-color: #2196F3; box-shadow: 0 4px 10px rgba(33, 150, 243, 0.05); }

.acciones-registro { margin-top: 30px; display: flex; gap: 12px; }
.btn-volver-busqueda { flex: 1; padding: 15px; background: #f1f5f9; border: none; border-radius: 12px; cursor: pointer; font-weight: 700; color: #64748b; transition: 0.2s; }
.btn-volver-busqueda:hover { background: #e2e8f0; color: #1e293b; }
.btn-guardar-cli { flex: 2; padding: 15px; background: #2196F3; color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: 800; font-size: 15px; box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3); transition: 0.2s; }
.btn-guardar-cli:hover { background: #1976D2; transform: translateY(-2px); }

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

/* Estilos de Métodos de Pago ya consolidados en el bloque scoped superior */
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

/* --- ESTILOS HEADER PREMIUM UNIFICADO --- */
.header-admin-v2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 15px 30px;
  border-radius: 20px;
  margin-bottom: 25px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  border: 1px solid rgba(226, 232, 240, 0.8);
}
.header-left-group { display: flex; align-items: center; gap: 40px; }
.title-main-v2 { font-size: 22px; font-weight: 900; color: #1e293b; margin: 0; letter-spacing: -0.5px; }
.subtitle-main-v2 { font-size: 13px; color: #64748b; margin: 5px 0 0; font-weight: 500; }
.tabs-modern-v2 { display: flex; background: #f1f5f9; padding: 4px; border-radius: 12px; gap: 4px; border: 1px solid #eef2f6; }
.t-btn-v2 { border: none; background: none; padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 700; color: #64748b; cursor: pointer; transition: all 0.2s; }
.t-btn-v2:hover { color: #1e293b; background: rgba(255,255,255,0.6); }
.t-btn-v2.activo { background: white; color: #2196F3; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }

.header-right-group { display: flex; align-items: center; gap: 20px; }
.tasa-badge-premium-v2 { display: flex; align-items: center; gap: 12px; background: #ffffff; padding: 8px 18px; border-radius: 12px; border: 1px solid #eef2f6; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
.tasa-icon-v2 { font-size: 20px; }
.tasa-data-v2 { display: flex; flex-direction: column; }
.t-label { font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
.t-value { font-size: 14px; font-weight: 800; color: #2196F3; }

.user-badge-v2 { display: flex; align-items: center; gap: 12px; cursor: pointer; transition: 0.3s; padding: 6px; border-radius: 12px; }
.user-badge-v2:hover { background: #f8fafc; }
.user-info-v2 { display: flex; flex-direction: column; align-items: flex-end; }
.u-name { font-size: 14px; font-weight: 800; color: #1e293b; }
.u-email { font-size: 11px; color: #94a3b8; }
.u-avatar { width: 40px; height: 40px; border-radius: 12px; background: #2196F3; color: white; display: flex; justify-content: center; align-items: center; font-size: 16px; box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3); font-weight: 800; }

.vista-pos { flex: 1; display: flex; flex-direction: column; min-height: 0; position: relative; }

/* AJUSTE LAYOUT POS PARA LLENAR PANTALLA */
.main-content { height: 100vh; display: flex; flex-direction: column; overflow: hidden; padding: 25px; box-sizing: border-box; }
.pos-main-container { flex: 1; min-height: 0; display: flex; gap: 25px; }
.seccion-catalogo, .seccion-carrito-pos { height: 100%; display: flex; flex-direction: column; min-height: 0; }
.lista-productos-pos, .lista-items-carrito { flex: 1; overflow-y: auto; padding-right: 10px; }
.lista-productos-pos::-webkit-scrollbar, .lista-items-carrito::-webkit-scrollbar { width: 6px; }
.lista-productos-pos::-webkit-scrollbar-thumb, .lista-items-carrito::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }

/* --- ESTILOS DASHBOARD CAJERO RESTAURADO --- */
.vista-cajero-print-container { max-width: 900px; margin: 0 auto; width: 100%; padding-bottom: 50px; }
.documento-a4 { background: white; border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); color: #0f172a; border: 1px solid #e2e8f0; }
.doc-header { display: flex; justify-content: space-between; border-bottom: 2px solid #1e293b; padding-bottom: 20px; margin-bottom: 30px; }
.doc-logo-title { display: flex; align-items: center; gap: 15px; }
.logo-water { font-size: 30px; background: #eff6ff; width: 50px; height: 50px; border-radius: 12px; display: flex; justify-content: center; align-items: center; }
.doc-logo-title h2 { margin: 0; font-size: 20px; font-weight: 900; }
.doc-info { text-align: right; }
.doc-title { font-size: 16px; font-weight: 800; color: #3b82f6; margin: 0 0 5px 0; }
.seccion-titulo { font-size: 13px; text-transform: uppercase; color: #64748b; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; margin-bottom: 15px; font-weight: 800; }
.tx-list { display: flex; flex-direction: column; gap: 10px; }
.tx-item { display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; cursor: pointer; transition: 0.2s; }
.tx-item:hover { transform: translateX(5px); border-color: #3b82f6; background: white; }
.tx-id { font-weight: 800; color: #1e293b; }
.tx-time { font-size: 12px; color: #94a3b8; margin-left: 10px; }
.badge-method { background: #eff6ff; color: #3b82f6; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; }
.tx-amount { font-weight: 800; font-size: 16px; }
.btn-guardar-premium { background: #1e293b; color: white; border: none; padding: 15px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.3s; }
.btn-guardar-premium:hover { background: #0f172a; transform: translateY(-2px); }

@media print {
  .app-layout, .main-content { background: white !important; margin: 0 !important; padding: 0 !important; }
  .no-print, aside, header, .tasa-bcv-banner-premium { display: none !important; }
  .vista-cajero-print-container { max-width: 100% !important; margin: 0 !important; }
  .documento-a4 { box-shadow: none !important; border: none !important; padding: 0 !important; }
}
</style>

<style>
/* ESTILOS DE IMPRESI�"N GLOBALES (NO SCOPED) */
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

/* ESTILOS MODAL PAGO DEDICADO - DISE�'O WATER IUJO */
.modal-pago-detalle-content {
  background: #ffffff;
  width: 90%;
  max-width: 580px;
  border-radius: 12px;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  font-family: inherit;
}

.modal-pago-header {
  background: #ffffff;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eef2f6;
}

.header-pago-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lbl-pago-met {
  font-size: 11px;
  font-weight: 700;
  color: #2196F3;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.total-a-pagar-badge {
  display: flex;
  align-items: center;
  gap: 10px;
}

.lbl-total {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.val-total {
  font-size: 26px;
  font-weight: 800;
  color: #1e293b;
}

.btn-cerrar-pago-modal {
  background: #f8fafc;
  color: #64748b;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-cerrar-pago-modal:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.modal-pago-body {
  padding: 24px;
  background: #fcfdfe;
}

.campos-modal-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.pago-field-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.pago-field-card:focus-within {
  border-color: #2196F3;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.08);
}

.pago-field-icon {
  font-size: 22px;
  width: 44px;
  height: 44px;
  background: #f1f7ff;
  color: #2196F3;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pago-field-body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.pago-field-body label {
  font-size: 10px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.pago-field-body input, .pago-field-body select {
  border: none !important;
  padding: 0 !important;
  font-size: 15px !important;
  font-weight: 600 !important;
  color: #1e293b !important;
  background: transparent !important;
  width: 100%;
  outline: none;
}

.highlight-card {
  background: #f0f7ff !important;
  border: 1px solid #2196F3 !important;
}

.monto-bs-tag {
  background: #e3f2fd;
  color: #2196F3;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
}

.txt-cambio-grande {
  font-size: 24px;
  font-weight: 800;
  color: #10b981;
}

.field-missing {
  border-color: #fee2e2 !important;
  background: #fffcfc !important;
}

.modal-pago-footer {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.banner-exito-pago {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 16px;
  border-radius: 12px;
  text-align: center;
  font-weight: 700;
  border: 1px solid #c8e6c9;
  font-size: 14px;
  letter-spacing: 0.5px;
}

.btn-verificar-premium-modal {
  width: 100%;
  padding: 16px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 4px 14px rgba(33, 150, 243, 0.3);
}
.btn-verificar-premium-modal:hover:not(:disabled) {
  background: #1976D2;
}
.btn-verificar-premium-modal:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-finalizar-pago-modal {
  width: 100%;
  padding: 16px;
  background: #1e293b;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-finalizar-pago-modal:hover {
  background: #0f172a;
}

.pago-usd-small { font-weight: 700; color: #1e293b; }
.pago-edit-hint { font-size: 10px; color: #2196F3; font-weight: 700; }
.pago-acciones-mini { display: flex; align-items: center; gap: 8px; }
.full-width { grid-column: span 2; }

