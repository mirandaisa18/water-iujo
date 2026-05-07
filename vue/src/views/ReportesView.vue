<template>
  <div class="app-layout">
    
    <Sidebar />

    <main class="main-content">
      
      <header class="page-header header-admin-left">
        <div class="title-container-left">
          <h2 class="title-admin-left">
             {{ esAdmin ? 'Reportes Financieros Globales' : (esDelivery ? 'Registro de Actividad' : 'Monitoreo de Ventas') }}
          </h2>
          <p class="subtitle-admin-left">
             {{ esAdmin ? 'Analiza el rendimiento general del negocio.' : (esDelivery ? 'Consulta el historial de tus entregas y despachos.' : 'Visualiza el resumen de operaciones del día.') }}
          </p>
        </div>
        
        <div class="header-actions">
          <button v-if="esAdmin" class="btn-descargar">
            <span class="icono-descarga">📥</span> Descargar Reporte
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

      <div v-if="esAdmin || esDelivery" class="vista-admin-dashboard">
        
        <!-- KPIs Premium de Reportes -->
        <div v-if="!esDelivery" class="premium-kpi-grid">
          <div class="premium-kpi-card card-green">
            <div class="kpi-icon-wrapper"><span class="kpi-icon">💰</span></div>
            <div class="kpi-info">
              <span class="kpi-label">Ingresos Hoy</span>
              <h3 class="kpi-value">${{ kpiIngresosHoy.toFixed(2) }}</h3>
              <div class="kpi-trend positive">
                <span class="trend-icon">↗</span>
                <span>Caja de hoy</span>
              </div>
            </div>
          </div>
          
          <div class="premium-kpi-card card-blue">
            <div class="kpi-icon-wrapper"><span class="kpi-icon">🧾</span></div>
            <div class="kpi-info">
              <span class="kpi-label">Tickets Generados</span>
              <h3 class="kpi-value">{{ kpiTicketsHoy }}</h3>
              <div class="kpi-trend neutral">
                <span class="trend-icon">→</span>
                <span>En el turno de hoy</span>
              </div>
            </div>
          </div>

          <div class="premium-kpi-card card-orange">
            <div class="kpi-icon-wrapper"><span class="kpi-icon">💧</span></div>
            <div class="kpi-info">
              <span class="kpi-label">Litros Despachados</span>
              <h3 class="kpi-value">{{ kpiLitrosHoy }} L</h3>
              <div class="kpi-trend positive">
                <span class="trend-icon">↗</span>
                <span>Hoy</span>
              </div>
            </div>
          </div>
        </div>

        <!-- KPIs Delivery (Registro) -->
        <div v-if="esDelivery" class="premium-kpi-grid">
           <div class="premium-kpi-card card-blue">
            <div class="kpi-icon-wrapper"><span class="kpi-icon">🛵</span></div>
            <div class="kpi-info">
              <span class="kpi-label">Total Entregas</span>
              <h3 class="kpi-value">{{ totalesFiltrados.ventas }}</h3>
              <div class="kpi-trend neutral"><span>Despachos realizados</span></div>
            </div>
          </div>
          <div class="premium-kpi-card card-green">
            <div class="kpi-icon-wrapper"><span class="kpi-icon">💰</span></div>
            <div class="kpi-info">
              <span class="kpi-label">Total Recaudado</span>
              <h3 class="kpi-value">${{ totalesFiltrados.ingresos.toFixed(2) }}</h3>
              <div class="kpi-trend positive"><span>Cobro en ruta</span></div>
            </div>
          </div>
          <div class="premium-kpi-card card-orange">
            <div class="kpi-icon-wrapper"><span class="kpi-icon">💧</span></div>
            <div class="kpi-info">
              <span class="kpi-label">Litros Totales</span>
              <h3 class="kpi-value">{{ totalesFiltrados.litros }} L</h3>
              <div class="kpi-trend neutral"><span>Agua entregada</span></div>
            </div>
          </div>
        </div>

        <div class="premium-table-card filters-card-premium">
          <div class="inputs-fecha">
            <div class="input-group-premium">
              <label>DESDE</label>
              <input type="date" v-model="fechaDesdeInput" :min="minDateVal" :max="hoyISO" />
            </div>
            <div class="input-group-premium">
              <label>HASTA</label>
              <input type="date" v-model="fechaHastaInput" :min="minDateVal" :max="hoyISO" />
            </div>
            <button class="btn-guardar" @click="aplicarFiltros" style="display:flex; align-items:center; gap:8px; align-self:flex-end; padding:12px 25px; margin-bottom: 2px;">
              <span>🔍</span> Aplicar Filtro
            </button>
          </div>

          <!-- Filtros Ráparidos para Delivery (Mejorado) -->
          <div v-if="esDelivery" class="quick-filters-delivery-premium">
            <span class="filter-label">Filtros Rápidos:</span>
            <div class="btn-group-filters">
              <button class="btn-quick-v2" :class="{ active: periodoActivo === 'semanal' }" @click="setPeriodo('semanal')">
                <span class="icon">📅</span> Semana
              </button>
              <button class="btn-quick-v2" :class="{ active: periodoActivo === 'quincenal' }" @click="setPeriodo('quincenal')">
                <span class="icon">🗓️</span> Quincena
              </button>
              <button class="btn-quick-v2" :class="{ active: periodoActivo === 'mensual' }" @click="setPeriodo('mensual')">
                <span class="icon">📊</span> Mes
              </button>
            </div>
          </div>
        </div>

        <div v-if="!esDelivery" class="tabs-container">
          <button class="tab" :class="{ activo: tabActiva === 'balance' }" @click="tabActiva = 'balance'">Balance General</button>
          <button class="tab" :class="{ activo: tabActiva === 'litros' }" @click="tabActiva = 'litros'">Litros & Semanas</button>
        </div>

        <!-- VISTA: BALANCE GENERAL -->
        <div v-if="tabActiva === 'balance'" class="grid-reportes" style="display: block;">
          <div class="tarjeta-blanca" style="padding: 40px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h2 style="font-size: 26px; color: #1e293b; margin: 0;">Balance General & Estado de Resultados</h2>
              <p style="color: #64748b; font-size: 14px; margin-top:5px;">Rendimiento del negocio en el periodo: {{ fechaDesde }} al {{ fechaHasta }}</p>
            </div>
            
            <!-- KPIs Estado de Resultados -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px;">
              <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; border: 1px solid #bbf7d0;">
                <h4 style="color: #166534; margin: 0; font-size: 12px; text-transform: uppercase;">Ingresos (Ventas)</h4>
                <p style="color: #15803d; font-size: 28px; font-weight: 800; margin: 5px 0;">${{ totalesFiltrados.ingresos.toFixed(2) }}</p>
              </div>
              <div style="background: #fff7ed; padding: 20px; border-radius: 12px; border: 1px solid #ffedd5;">
                <h4 style="color: #9a3412; margin: 0; font-size: 12px; text-transform: uppercase;">Egresos (Gastos)</h4>
                <p style="color: #c2410c; font-size: 28px; font-weight: 800; margin: 5px 0;">${{ totalesFiltrados.egresos.toFixed(2) }}</p>
              </div>
              <div style="background: #fef2f2; padding: 20px; border-radius: 12px; border: 1px solid #fecaca;">
                <h4 style="color: #991b1b; margin: 0; font-size: 12px; text-transform: uppercase;">Costos (Compras)</h4>
                <p style="color: #b91c1c; font-size: 28px; font-weight: 800; margin: 5px 0;">${{ totalesFiltrados.compras.toFixed(2) }}</p>
              </div>
              <div :style="{ background: kpiUtilidadNeta >= 0 ? '#eff6ff' : '#fff1f2', border: kpiUtilidadNeta >= 0 ? '1px solid #bfdbfe' : '1px solid #fecdd3' }" style="padding: 20px; border-radius: 12px;">
                <h4 :style="{ color: kpiUtilidadNeta >= 0 ? '#1e40af' : '#9f1239' }" style="margin: 0; font-size: 12px; text-transform: uppercase;">Utilidad Neta</h4>
                <p :style="{ color: kpiUtilidadNeta >= 0 ? '#1d4ed8' : '#e11d48' }" style="font-size: 28px; font-weight: 800; margin: 5px 0;">${{ kpiUtilidadNeta.toFixed(2) }}</p>
              </div>
            </div>

            <!-- Estructura Balance General -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; border-top: 2px solid #f1f5f9; padding-top: 30px;">
              <!-- ACTIVOS -->
              <div>
                <h3 style="color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Activos</h3>
                <div style="display: flex; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #f1f5f9;">
                   <span>Caja y Bancos (Ventas Acumuladas)</span>
                   <span class="negrita">${{ sumaCajaTotal.toFixed(2) }}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #f1f5f9;">
                   <span>Inventario (Stock x Precio Venta)</span>
                   <span class="negrita">${{ valorInventarioTotal.toFixed(2) }}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 15px 0; background: #f8fafc; margin-top: 10px;">
                   <strong style="color: #3b82f6;">TOTAL ACTIVOS</strong>
                   <strong style="color: #3b82f6;">${{ (sumaCajaTotal + valorInventarioTotal).toFixed(2) }}</strong>
                </div>
              </div>

              <!-- PASIVOS Y PATRIMONIO -->
              <div>
                <h3 style="color: #1e293b; border-bottom: 2px solid #ef4444; padding-bottom: 10px;">Pasivos y Patrimonio</h3>
                <div style="display: flex; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #f1f5f9;">
                   <span>Cuentas por Pagar (Compras Realizadas)</span>
                   <span class="negrita" style="color: #ef4444;">${{ pasivosTotal.toFixed(2) }}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #f1f5f9;">
                   <span>Utilidades Acumuladas</span>
                   <span class="negrita">${{ utilidadAcumulada.toFixed(2) }}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 15px 0; background: #f8fafc; margin-top: 10px;">
                   <strong style="color: #1e293b;">TOTAL PASIVO + PATRIMONIO</strong>
                   <strong style="color: #1e293b;">${{ (pasivosTotal + utilidadAcumulada).toFixed(2) }}</strong>
                </div>
              </div>
            </div>
            
            <div style="margin-top: 30px; text-align: center; color: #64748b; font-size: 12px; font-style: italic;">
               * El Balance General refleja la posición financiera consolidada del sistema basada en los registros históricos.
            </div>
          </div>
        </div>

        <!-- VISTA: LITROS Y MESES (Grouped for Admin/Cajero) -->
        <div v-if="tabActiva === 'litros' && !esDelivery" class="grid-reportes">
          <div class="tarjeta-blanca tabla-container">
            <!-- ... existing grouped table content ... -->
            <div class="tarjeta-header">
              <h3>Resumen de Operación</h3>
              <span class="mes-badge">Por Temporada</span>
            </div>
            <div class="table-responsive">
              <table class="tabla-resumen">
                <thead>
                  <tr><th>SEMANA / FECHA</th><th>LITROS</th><th># VENTAS</th><th>INGRESOS</th></tr>
                </thead>
                <tbody>
                  <template v-for="week in agrupacionVentas" :key="week.date">
                    <tr @click="toggleSemana(week.date)" style="cursor: pointer; background: #f8fafc;">
                      <td><strong>{{ week.label }}</strong> <span style="font-size:10px; color:#3b82f6; margin-left:10px;">{{ semanasExpandidas[week.date] ? '▲ Ocultar días' : '▼ Ver días' }}</span></td>
                      <td><strong>{{ week.litros }} L</strong></td>
                      <td><strong>{{ week.ventas }}</strong></td>
                      <td class="negrita">${{ week.ingresos.toFixed(2) }}</td>
                    </tr>
                    <tr v-if="semanasExpandidas[week.date]" v-for="dy in week.daysArr" :key="dy.date" style="background: #ffffff; border-bottom:1px dashed #e2e8f0;">
                      <td style="padding-left: 20px; font-size: 13px; color: #64748b;">└─ {{ dy.date }}</td>
                      <td style="font-size: 13px; color: #475569;">{{ dy.litros }} L</td>
                      <td style="font-size: 13px; color: #475569;">{{ dy.ventas }}</td>
                      <td style="font-size: 13px; color: #475569;">${{ dy.ingresos.toFixed(2) }}</td>
                    </tr>
                  </template>
                  <tr v-if="agrupacionVentas.length === 0">
                    <td colspan="4" style="text-align: center; color: #94a3b8; font-style: italic;">No hay operaciones registradas en las fechas seleccionadas.</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr><td class="total-texto">TOTAL RANGO</td><td class="total-azul">{{ totalesFiltrados.litros }} L</td><td class="total-negro">{{ totalesFiltrados.ventas }}</td><td class="total-azul">${{ totalesFiltrados.ingresos.toFixed(2) }}</td></tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div class="tarjeta-blanca grafico-container">
            <div class="grafico-header">
              <div>
                <h3>TENDENCIA DE LITROS</h3><p>Variación de despacho diario (filtro)</p>
              </div>
              <div class="leyenda-grafico"><span class="punto-azul"></span> LITROS</div>
            </div>
            <div class="area-grafico">
              <svg viewBox="0 0 400 200" class="svg-line-chart">
                <line x1="0" y1="40" x2="400" y2="40" stroke="#f0f0f0" stroke-width="1"/>
                <line x1="0" y1="100" x2="400" y2="100" stroke="#f0f0f0" stroke-width="1"/>
                <line x1="0" y1="160" x2="400" y2="160" stroke="#f0f0f0" stroke-width="1"/>
                
                <polyline v-if="getSvgPoints" :points="getSvgPoints" fill="none" stroke="#2196F3" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                
                <circle v-for="(circ, idx) in getSvgCircles" :key="idx" :cx="circ.cx" :cy="circ.cy" r="4" fill="#2196F3" />
              </svg>
              <div class="eje-x" style="display:flex; justify-content:space-between; margin-top:5px; padding:0 10px;">
                <span v-for="(circ, idx) in getSvgCircles" :key="'lbl'+idx" style="font-size:8px;">{{ circ.label }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- VISTA: HISTORIAL DE DELIVERIES (Solo para Delivery) -->
        <div v-if="tabActiva === 'litros' && esDelivery" class="historial-delivery-container">
           <div class="premium-table-card">
              <div class="tarjeta-header">
                <h3>Historial Detallado de Entregas</h3>
                <span class="mes-badge">Listado Completo</span>
              </div>
              
              <div class="table-responsive">
                <table class="tabla-premium">
                  <thead>
                    <tr>
                      <th>FECHA/HORA</th>
                      <th>CLIENTE</th>
                      <th>DIRECCIÓN</th>
                      <th>ÍTEMS</th>
                      <th>MÉTODO</th>
                      <th>COBRADO</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="t in ticketsDeliveryDetalle" :key="t.id">
                      <td>
                        <div class="fecha-cell">
                          <span class="main-date">{{ formatFecha(t.timestamp) }}</span>
                          <span class="sub-time">{{ t.hora }}</span>
                        </div>
                      </td>
                      <td>
                        <div class="cliente-info">
                          <span class="nombre-cliente">{{ t.cliente }}</span>
                        </div>
                      </td>
                      <td class="direccion-cell">
                        <span class="direccion-txt">{{ t.direccion || 'Sin dirección registrada' }}</span>
                      </td>
                      <td>
                        <div class="items-mini-list">
                          <span v-for="(item, idx) in t.items" :key="idx" class="item-tag">
                            {{ item.cant }}x {{ item.nombre }}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span class="badge" :class="'badge-' + (t.colorMetodo || 'azul')">{{ t.metodo }}</span>
                      </td>
                      <td class="monto-cell">
                        <span class="monto-val">${{ t.monto.toFixed(2) }}</span>
                      </td>
                    </tr>
                    <tr v-if="ticketsDeliveryDetalle.length === 0">
                      <td colspan="6">
                        <div class="empty-state-delivery">
                          <div class="empty-icon-wrapper">
                            <span class="empty-icon">🚚</span>
                          </div>
                          <h4>Sin datos en este rango</h4>
                          <p>No se encontraron entregas registradas entre las fechas seleccionadas. Prueba con otro periodo o verifica tus filtros.</p>
                          <button class="btn-reset-filter" @click="setPeriodo('semanal')">Ver última semana</button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
           </div>
        </div>
      </div>

      <div v-if="esCajero" class="vista-cajero-print-container">

        <!-- Selección de Visualización (Moderno) -->
        <div class="tabs-premium-cajero no-print">
          <button class="t-btn" :class="{ activo: tabActivaCajero === 'cierre' }" @click="tabActivaCajero = 'cierre'"><span class="t-icon">🧾</span> Cierre Z</button>
          <button class="t-btn" :class="{ activo: tabActivaCajero === 'transacciones-pos' }" @click="tabActivaCajero = 'transacciones-pos'"><span class="t-icon">🛒</span> Historial POS</button>
          <button class="t-btn" :class="{ activo: tabActivaCajero === 'transacciones-web' }" @click="tabActivaCajero = 'transacciones-web'"><span class="t-icon">🌐</span> Historial Web</button>
        </div>

        <!-- REPORTE TIPO PDF/A4 PARA IMPRESIÓN -->
        <div v-show="tabActivaCajero === 'cierre'" class="documento-a4 printable-cierre">
          <div class="doc-header">
            <div class="doc-logo-title">
              <div class="logo-water">💧</div>
              <div>
                <h2>WATER IUJO</h2>
                <p>RIF: J-50000000-0</p>
              </div>
            </div>
            <div class="doc-info">
              <h1 class="doc-title">REPORTE Z - CIERRE DE CAJA</h1>
              <p><strong>Fecha y Hora:</strong> {{ fechaActual }} &bull; {{ horaActual }}</p>
              <p><strong>Cajero:</strong> {{ emailUsuario }}</p>
            </div>
          </div>

          <div class="doc-seccion">
            <h3 class="seccion-titulo" style="margin-bottom: 10px;">1. Novedades / Observaciones del Turno</h3>
            <div class="agregar-nota-box no-print" style="border: none; padding: 0; margin-bottom: 20px; background: transparent;">
              <textarea 
                v-model="notaCierre" 
                placeholder="Escribe aquí si hubo sobrantes, faltantes o eventos importantes del turno... (Opcional)"
                style="width: 100%; padding: 15px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none; min-height: 80px; resize: vertical;"
              ></textarea>
            </div>
            
            <div class="doc-nota-block" v-if="notaCierre" style="padding: 10px; border: 1px solid #e2e8f0; font-style: italic;">
              <p>{{ notaCierre }}</p>
            </div>
          </div>

          <div class="doc-seccion">
            <h3 class="seccion-titulo">2. Resumen de Ingresos (Cuenta T Clasificada)</h3>
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px; border: 2px solid #e2e8f0;">
              <thead>
                <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                  <th style="padding: 12px; border-right: 2px solid #e2e8f0; width: 25%;">MÉTODO DE PAGO</th>
                  <th style="padding: 12px; text-align: right; border-right: 1px solid #e2e8f0; width: 25%;">🛒 CAJA POS</th>
                  <th style="padding: 12px; text-align: right; border-right: 1px solid #e2e8f0; width: 25%;">🌐 WEB O.</th>
                  <th style="padding: 12px; text-align: right; background: #e2e8f0; width: 25%;">TOTAL GENERAL</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(datos, metodo) in totalesPorMetodo" :key="metodo" style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 12px; font-weight: 600; border-right: 2px solid #e2e8f0;">{{ metodo }}</td>
                  <td style="padding: 12px; text-align: right; color: #475569; border-right: 1px solid #f1f5f9;">${{ datos.pos.toFixed(2) }}</td>
                  <td style="padding: 12px; text-align: right; color: #3b82f6; border-right: 1px solid #f1f5f9;">${{ datos.web.toFixed(2) }}</td>
                  <td style="padding: 12px; text-align: right; font-weight: 800; color: #1e293b; background: #f8fafc;">${{ datos.total.toFixed(2) }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr style="background: #1e293b; color: white;">
                  <td style="padding: 12px; border-right: 2px solid #334155; font-weight: 700;">TOTAL ({{ listaTickets.length }} Ops)</td>
                  <td style="padding: 12px; text-align: right; font-weight: 700; border-right: 1px solid #334155;">${{ totalVentasPOSCajero.toFixed(2) }}</td>
                  <td style="padding: 12px; text-align: right; font-weight: 700; border-right: 1px solid #334155;">${{ totalVentasWebCajero.toFixed(2) }}</td>
                  <td style="padding: 12px; text-align: right; font-weight: 800; font-size: 16px;">${{ (totalVentasPOSCajero + totalVentasWebCajero).toFixed(2) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div class="doc-seccion">
            <h3 class="seccion-titulo">3. Desglose de Productos Despachados</h3>
            <div class="productos-compactos">
              <div v-for="(prod, nombre) in resumenProductos" :key="nombre" class="prod-fila-compacta">
                <div class="prod-cant-box">
                  <span class="prod-minitext">CANT</span>
                  <span class="prod-bigtext">{{ prod.cant }}</span>
                </div>
                <div class="prod-desc-box">{{ nombre }}</div>
                <div class="prod-total-box">
                  <span class="prod-minitext">TOTAL</span>
                  <span class="prod-bigtext">${{ prod.total.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="doc-firmas-container" style="margin-top: 40px; padding: 20px; border-top: 2px dashed #cbd5e1;">
            <h3 class="seccion-titulo no-print" style="margin-bottom: 20px; font-size: 14px; text-align: center;">Confirmación de Cambio de Turno</h3>
            
            <div class="firmas-digitales-inputs no-print" style="display: flex; gap: 20px; justify-content: space-around; margin-bottom: 30px;">
               <div class="input-firma-box" style="flex: 1; text-align: center;">
                  <label style="display: block; font-size: 11px; font-weight: 700; margin-bottom: 5px;">Cajero Entregando</label>
                  <input type="password" v-model="claveEntregante" placeholder="Colocar firma/clave..." style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 4px; text-align: center;" />
               </div>
               <div class="input-firma-box" style="flex: 1; text-align: center;">
                  <label style="display: block; font-size: 11px; font-weight: 700; margin-bottom: 5px;">Cajero Entrando / Relevo</label>
                  <input type="password" v-model="claveReceptor" placeholder="Colocar firma/clave..." style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 4px; text-align: center;" />
               </div>
            </div>

            <div style="text-align: center;">
                <button class="btn-imprimir-cierre no-print" :disabled="!claveEntregante || !claveReceptor" @click="imprimirCierre" style="padding: 12px 30px; font-size: 15px; font-weight: bold; cursor: pointer; border-radius: 8px; border: none; background-color: #10b981; color: white;">
                  Imprimir Cierre Z
                </button>
            </div>
          </div>
        </div>

        <!-- HISTORIAL DE TRANSACCIONES DETALLADO (POS Y WEB SEPARADOS) -->
        <div v-show="tabActivaCajero === 'transacciones-pos' || tabActivaCajero === 'transacciones-web'" class="transacciones-cajero no-print">
          <h3 class="transacciones-titulo">
            {{ tabActivaCajero === 'transacciones-pos' ? 'Ventas Procesadas en Caja (POS)' : 'Pedidos Validados por Web' }}
          </h3>
          <p class="transacciones-subtitle">
            Haz clic sobre cualquier fila para visualizar el ticket {{ tabActivaCajero === 'transacciones-web' ? 'y el comprobante subido por el cliente' : '' }}.
          </p>
          
          <div class="table-responsive-transacciones">
            <table class="tabla-transacciones">
              <thead>
                <tr>
                  <th>N°</th>
                  <th>HORA</th>
                  <th>CLIENTE</th>
                  <th>MÉTODO PAGO</th>
                  <th>ARTÍCULOS</th>
                  <th style="text-align: right;">MONTO</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="t in ticketsActivosList" :key="t.id" @click="verDetalleTicket(t)" class="row-clickable">
                  <td style="font-weight: 700; color: #64748b;">#{{ t.id }}</td>
                  <td>
                    <span class="hora-badge">{{ t.timestamp ? new Date(t.timestamp).toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit', hour12:true}) : '--:--' }}</span>
                  </td>
                  <td style="font-weight: 600; color: #1e293b;">{{ t.cliente?.nombre || t.cliente || 'Consumidor Final' }}</td>
                  <td>
                    <span class="metodo-txt" v-if="t.metodosPago && t.metodosPago.length > 0">
                      {{ t.metodosPago.map(m => m.metodo).join(' + ') }}
                    </span>
                    <span class="metodo-txt" v-else>{{ t.metodo || 'Efectivo' }}</span>
                    <!-- Icono de cámara si incluye imagenPago -->
                    <span v-if="t.imagenPago" style="margin-left: 8px; font-size: 14px;" title="Tiene comprobante adjunto">📸</span>
                  </td>
                  <td style="font-size: 13px; color: #475569;">{{ Array.isArray(t.items) ? t.items.reduce((s,i)=>s+(i.cantidad||i.cant||1),0) : '-' }} ítems</td>
                  <td class="monto-transaccion">${{ (t.monto || 0).toFixed(2) }}</td>
                </tr>
                <tr v-if="ticketsActivosList.length === 0">
                  <td colspan="6" class="text-center-empty">No hay transacciones en esta sección.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- MODAL DETALLE DE TICKET Y COMPROBANTE -->
      <div v-if="showModalDetalle" class="super-modal-overlay no-print-bg modal-split" @click="showModalDetalle = false">
        
        <div class="split-wrapper" @click.stop>
          <div class="modal-ticket-container">
            <TicketPos :factura="ticketSeleccionado" />
            
            <div class="acciones-factura no-print" style="display:flex; gap:10px; margin-top:15px; justify-content:center;">
              <button class="btn-imprimir-ticket" @click="imprimirCierre">🖨️ Imprimir Ticket</button>
              <button class="btn-cerrar-ticket" @click="showModalDetalle = false">Cerrar Detalle</button>
            </div>
          </div>
          
          <div v-if="ticketSeleccionado?.origen === 'cliente'" class="evidencia-panel">
            <h4 class="evidencia-titulo">📸 Comprobante del Cliente</h4>
            <div v-if="ticketSeleccionado?.imagenPago" class="evidencia-marco">
               <img :src="ticketSeleccionado.imagenPago" class="evidencia-img" />
            </div>
            <div v-else class="evidencia-marco-empty">
               <span style="font-size: 40px; margin-bottom: 10px; opacity: 0.5;">🚫</span>
               <p style="color: #64748b; font-size: 13px; text-align: center; margin: 0; line-height: 1.5;">
                  <strong>Transacción sin foto adjunta</strong><br><br>
                  Ocurre si el pedido es antiguo (antes de la actualización) o si el cliente lo omitió.
               </p>
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSistemaStore } from '../stores/sistema';
import { historicoTickets, listaProductosInventario, listaClientesData } from '../data/mockData';

const router = useRouter();
const store = useSistemaStore();

// --- LÓGICA DE ROLES Y SEGURIDAD ---
const esAdmin = computed(() => store.rolUsuario === 'admin');
const esCajero = computed(() => store.rolUsuario === 'cajero');
const esDelivery = computed(() => store.rolUsuario === 'delivery');

const tabActivaCajero = ref('transacciones-pos');
const ahora = ref(new Date());
let timer = null;

onMounted(() => {
  // 1. Seguridad: Ahora permitimos el acceso a Admin, Cajero Y Delivery. Si no es ninguno, va al login.
  if (!esAdmin.value && !esCajero.value && !esDelivery.value) {
    router.push('/login');
    return;
  }

  // 2. Carga de datos para Admin
  if (esAdmin.value) {
    store.fetchGastos();
    store.fetchCompras();
    store.fetchHistorialVentas(); 
    store.fetchClientes();
    store.fetchInventario();
  }

  // 3. Ajustes para Delivery
  if (esDelivery.value) {
    tabActiva.value = 'litros';
    setPeriodo('semanal'); 
  }

  // 4. Timer para tiempo real
  timer = setInterval(() => {
    ahora.value = new Date();
  }, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const nombreRol = computed(() => store.perfilUsuario?.nombre || (esAdmin.value ? 'Administrador' : 'Cajero'));
const emailUsuario = computed(() => store.perfilUsuario?.email || (esAdmin.value ? 'admin@wateriujo.com' : 'caja@wateriujo.com'));
// --- LÓGICA DEL CAJERO ---
const fechaActual = computed(() => {
  return ahora.value.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
});
const horaActual = computed(() => {
  return ahora.value.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
});

const notaCierre = ref('');
const showNota = ref(false);
const imagenPago = ref(null);
const periodoActivo = ref('semanal');
const claveEntregante = ref('');
const claveReceptor = ref('');
const deliveryCost = ref(1.50);
const busquedaTicket = ref('');
const ticketSeleccionado = ref(null);
const showModalDetalle = ref(false);

// Base de datos de los tickets del cajero (Vinculado al STORE para tiempo real)
const listaTickets = computed(() => store.tickets);

const tabActiva = ref('litros');

const hoyISO = new Date().toISOString().substring(0, 10);
const fechaDesdeInput = ref(hoyISO);
const fechaHastaInput = ref(hoyISO);

const fechaDesde = ref(hoyISO);
const fechaHasta = ref(hoyISO);

const aplicarFiltros = () => {
  fechaDesde.value = fechaDesdeInput.value;
  fechaHasta.value = fechaHastaInput.value;
};

// Validación de inputs Date
const minDateVal = computed(() => {
  if (listaTickets.value.length === 0) return hoyISO;
  // Ordenar por fecha para encontrar la primera
  const sorted = [...listaTickets.value].sort((a,b) => (a.timestamp || '').localeCompare(b.timestamp || ''));
  return sorted[0].timestamp ? sorted[0].timestamp.substring(0, 10) : hoyISO;
});

const setPeriodo = (tipo) => {
  const hoy = new Date();
  let desde = new Date();
  
  if (tipo === 'semanal') {
    desde.setDate(hoy.getDate() - 7);
  } else if (tipo === 'quincenal') {
    desde.setDate(hoy.getDate() - 15);
  } else if (tipo === 'mensual') {
    desde.setMonth(hoy.getMonth() - 1);
  }
  
  fechaDesdeInput.value = desde.toISOString().substring(0, 10);
  fechaHastaInput.value = hoy.toISOString().substring(0, 10);
  periodoActivo.value = tipo;
  aplicarFiltros();
};

const formatFecha = (ts) => {
  if (!ts) return '-';
  const d = new Date(ts);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const ticketsDeliveryDetalle = computed(() => {
  return listaTickets.value
    .filter(t => {
      const d = (t.timestamp || '').substring(0, 10);
      return d >= fechaDesde.value && d <= fechaHasta.value;
    })
    .map(t => {
      // Intentar buscar dirección si el cliente existe en la data
      const clienteData = listaClientesData.find(c => c.nombre === t.cliente);
      return {
        ...t,
        direccion: t.direccion || (clienteData ? clienteData.direccion : null)
      };
    })
    .sort((a,b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
});

// Helper para litros
const getLiters = (item) => {
  const n = (item.nombre || '').toLowerCase();
  let l = 0;
  if(n.includes('19l')) l = 19;
  else if(n.includes('20l')) l = 20;
  else if(n.includes('12l')) l = 12;
  else if(n.includes('10l')) l = 10;
  return l * ((item.cantidad !== undefined ? item.cantidad : item.cant) || 0);
};

// KPIs Admin
const kpiTicketsFilter = computed(() => listaTickets.value.filter(t => t.timestamp && t.timestamp.startsWith(hoyISO)));
const kpiIngresosHoy = computed(() => kpiTicketsFilter.value.reduce((s,t) => s+(t.monto||0), 0));
const kpiTicketsHoy = computed(() => kpiTicketsFilter.value.length);
const kpiLitrosHoy = computed(() => kpiTicketsFilter.value.reduce((s,t) => s + (t.items||[]).reduce((ss,i) => ss+getLiters(i),0), 0));

// Lógica de Semanas y Días
const agrupacionVentas = computed(() => {
  const grupos = {};
  
  listaTickets.value.forEach(t => {
     if(!t.timestamp) return;
     const tDate = t.timestamp.substring(0,10);
     if (tDate >= fechaDesde.value && tDate <= fechaHasta.value) {
        const d = new Date(t.timestamp);
        const day = d.getDay() || 7;
        const mon = new Date(d);
        mon.setDate(d.getDate() - day + 1);
        const wDate = mon.toISOString().substring(0,10);

        if (!grupos[wDate]) {
           grupos[wDate] = { label: `Sem. inicio ${wDate}`, date: wDate, litros: 0, ventas: 0, ingresos: 0, days: {} };
        }
        
        const lts = (t.items||[]).reduce((ss,i)=>ss+getLiters(i),0);
        
        grupos[wDate].litros += lts;
        grupos[wDate].ventas += 1;
        grupos[wDate].ingresos += (t.monto||0);
        
        if (!grupos[wDate].days[tDate]) grupos[wDate].days[tDate] = { date: tDate, litros:0, ventas:0, ingresos:0 };
        grupos[wDate].days[tDate].litros += lts;
        grupos[wDate].days[tDate].ventas += 1;
        grupos[wDate].days[tDate].ingresos += (t.monto||0);
     }
  });

  const weeksArr = Object.values(grupos).sort((a,b) => b.date.localeCompare(a.date));
  weeksArr.forEach(w => {
     w.daysArr = Object.values(w.days).sort((a,b) => b.date.localeCompare(a.date));
  });

  return weeksArr;
});

// LÓGICA DE BALANCE GENERAL (TOTALES HISTÓRICOS)
const sumaCajaTotal = computed(() => {
  return store.tickets.reduce((s, t) => s + (t.monto || 0), 0);
});

const valorInventarioTotal = computed(() => {
  return store.inventario.reduce((s, p) => s + ((p.stock || p.Stock_Actual || 0) * (p.precio || p.precioVenta || 0)), 0);
});

const pasivosTotal = computed(() => {
  return store.compras.reduce((s, c) => s + (c.total || 0), 0);
});

const utilidadAcumulada = computed(() => {
  const gastosTotales = store.gastos.reduce((s, g) => s + (g.monto || 0), 0);
  return sumaCajaTotal.value - (gastosTotales + pasivosTotal.value);
});


const totalesFiltrados = computed(() => {
  const ventas = agrupacionVentas.value.reduce((acc, w) => {
    acc.litros += w.litros;
    acc.ventas += w.ventas;
    acc.ingresos += w.ingresos;
    return acc;
  }, { litros: 0, ventas: 0, ingresos: 0, egresos: 0, compras: 0 });
  
  const gastosFiltradosRango = store.gastos.filter(g => {
    const d = (g.fecha || '').substring(0, 10);
    return d >= fechaDesde.value && d <= fechaHasta.value;
  });
  
  const comprasFiltradasRango = store.compras.filter(c => {
    const d = (c.fecha || '').substring(0, 10);
    return d >= fechaDesde.value && d <= fechaHasta.value;
  });
  
  ventas.egresos = gastosFiltradosRango.reduce((s, g) => s + g.monto, 0);
  ventas.compras = comprasFiltradasRango.reduce((s, c) => s + (c.total || 0), 0);
  
  return ventas;
});

const kpiUtilidadNeta = computed(() => {
  return totalesFiltrados.value.ingresos - (totalesFiltrados.value.egresos + totalesFiltrados.value.compras);
});

const semanasExpandidas = ref({});
const toggleSemana = (wDate) => { semanasExpandidas.value[wDate] = !semanasExpandidas.value[wDate]; };

// Gráfico SVG dinámico
const lineChartData = computed(() => {
  let rawDays = [];
  agrupacionVentas.value.forEach(w => { rawDays.push(...w.daysArr) });
  return rawDays.sort((a,b) => a.date.localeCompare(b.date));
});
const maxSvgY = computed(() => {
  const mx = Math.max(...lineChartData.value.map(d=>d.litros), 0);
  return mx < 10 ? 10 : mx;
});
const getSvgCircles = computed(() => {
   if (lineChartData.value.length === 0) return [];
   const xStep = 360 / Math.max(lineChartData.value.length - 1, 1);
   return lineChartData.value.map((d, i) => {
     let x = 20 + (i * xStep);
     const y = 160 - ((d.litros / maxSvgY.value) * 120);
     const labelParts = d.date.split('-'); 
     return { cx: x, cy: y, label: `${labelParts[2]}/${labelParts[1]}` };
   });
});
const getSvgPoints = computed(() => {
  return getSvgCircles.value.map(c => `${c.cx},${c.cy}`).join(' ');
});

// Computado maestro que desglosa e itera todos los tickets agrupando productos, cantidades y dólares
const resumenProductos = computed(() => {
  const productos = {};
  
  // 1. Inicializar exhaustivamente todos los productos reales que vendemos en 0
  listaProductosInventario.forEach(prod => {
    productos[prod.nombre] = { cant: 0, total: 0 };
  });

  // 2. Acumular las ventas ejecutadas hoy en la caja
  listaTickets.value.forEach(ticket => {
    if(ticket.items && Array.isArray(ticket.items)) {
      ticket.items.forEach(item => {
        if (!productos[item.nombre]) {
           productos[item.nombre] = { cant: 0, total: 0 };
        }
        const qty = item.cantidad !== undefined ? item.cantidad : (item.cant || 0);
        const price = item.precioVenta !== undefined ? item.precioVenta : (item.precio || 0);
        
        productos[item.nombre].cant += qty;
        productos[item.nombre].total += (price * qty);
      });
    }
  });
  return productos;
});

const verDetalleTicket = (ticket) => {
  ticketSeleccionado.value = ticket;
  showModalDetalle.value = true;
};

// Magia: Filtrado automático
const ticketsFiltrados = computed(() => {
  const termino = busquedaTicket.value.toLowerCase().trim();
  if (!termino) return listaTickets.value;
  return listaTickets.value.filter(t => 
    t.id.toLowerCase().includes(termino) || 
    t.descripcion.toLowerCase().includes(termino) ||
    t.metodo.toLowerCase().includes(termino)
  );
});

// Cálculos de totales dinámicos
const totalesPorMetodo = computed(() => {
  const metodos = {
    'Efectivo': { pos: 0, web: 0, total: 0 },
    'Zelle': { pos: 0, web: 0, total: 0 },
    'Pago Móvil': { pos: 0, web: 0, total: 0 },
    'Transferencia': { pos: 0, web: 0, total: 0 },
    'Biopago': { pos: 0, web: 0, total: 0 },
    'Tarjeta': { pos: 0, web: 0, total: 0 }
  };
  
  listaTickets.value.forEach(t => {
    // origen puede venir como 'cliente' cuando es venta web v1 o 'caja' (o nada) cuando es manual POS
    const tipoVenta = t.origen === 'cliente' ? 'web' : 'pos';

    // Si el ticket tiene desglose de multipagos
    if (t.metodosPago && Array.isArray(t.metodosPago)) {
      t.metodosPago.forEach(p => {
        if (!metodos[p.metodo]) metodos[p.metodo] = { pos: 0, web: 0, total: 0 };
        metodos[p.metodo][tipoVenta] += p.monto;
        metodos[p.metodo].total += p.monto;
      });
    } 
    // Si es un ticket con un solo método
    else if (t.metodo) {
      if (!metodos[t.metodo]) metodos[t.metodo] = { pos: 0, web: 0, total: 0 };
      metodos[t.metodo][tipoVenta] += (t.monto || 0);
      metodos[t.metodo].total += (t.monto || 0);
    }
  });
  return metodos;
});

const totalVentasPOSCajero = computed(() => listaTickets.value.filter(t => t.origen !== 'cliente').reduce((sum, t) => sum + (t.monto || 0), 0));
const totalVentasWebCajero = computed(() => listaTickets.value.filter(t => t.origen === 'cliente').reduce((sum, t) => sum + (t.monto || 0), 0));

const ticketsOrganizadosCajero = computed(() => {
  return [...listaTickets.value].sort((a, b) => {
    return new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime();
  });
});

const ticketsActivosList = computed(() => {
  if (tabActivaCajero.value === 'transacciones-pos') {
    return ticketsOrganizadosCajero.value.filter(t => t.origen !== 'cliente');
  } else if (tabActivaCajero.value === 'transacciones-web') {
    return ticketsOrganizadosCajero.value.filter(t => t.origen === 'cliente');
  }
  return [];
});

// Función para el botón del cajero
const imprimirCierre = () => {
  if (claveEntregante.value === '' || claveReceptor.value === '') {
    alert("Ambos cajeros deben colocar su clave para validar el cierre.");
    return;
  }
  showNota.value = false;
  window.print();
};
</script>

<style scoped>
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

.btn-descargar { background: #10b981; color: white; border: none; padding: 10px 25px; border-radius: 10px; font-weight: 700; cursor: pointer; font-size: 14px; transition: 0.3s; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2); }
.btn-descargar:hover { background: #059669; transform: translateY(-2px); box-shadow: 0 6px 15px rgba(16, 185, 129, 0.3); }

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
.kpi-trend.positive { color: #10b981; }
.kpi-trend.neutral { color: #8b5cf6; }

/* FILTROS PREMIUM */
.filters-card-premium { padding: 25px 35px; }
.inputs-fecha { display: flex; align-items: flex-end; gap: 20px; }
.input-group-premium { display: flex; flex-direction: column; gap: 8px; flex: 1; }
.input-group-premium label { font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }
.input-group-premium input { padding: 12px 15px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 14px; outline: none; background: #f8fafc; font-weight: 600; color: #1e293b; }
.btn-guardar { background: #3b82f6; color: white; border: none; padding: 13px 30px; border-radius: 10px; font-weight: 700; cursor: pointer; transition: 0.2s; }
.btn-guardar:hover { background: #2563eb; transform: translateY(-1px); }

/* DELIVERY REPORT STYLES - MEJORADOS */
.quick-filters-delivery-premium { 
  display: flex; 
  align-items: center; 
  gap: 15px; 
  margin-top: 25px; 
  padding-top: 20px; 
  border-top: 1px solid #f1f5f9; 
}
.filter-label { font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
.btn-group-filters { display: flex; background: #f1f5f9; padding: 4px; border-radius: 12px; }
.btn-quick-v2 { 
  border: none; 
  background: transparent; 
  padding: 8px 16px; 
  border-radius: 10px; 
  font-size: 13px; 
  font-weight: 700; 
  color: #64748b; 
  cursor: pointer; 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  transition: 0.2s; 
}
.btn-quick-v2 .icon { font-size: 15px; }
.btn-quick-v2:hover { color: #3b82f6; }
.btn-quick-v2.active { background: white; color: #3b82f6; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }

/* TABLA DELIVERY DETALLE */
.tabla-premium { width: 100%; border-collapse: separate; border-spacing: 0; margin-top: 10px; }
.tabla-premium th { 
  text-align: left; 
  padding: 15px 20px; 
  border-bottom: 2px solid #f1f5f9; 
  color: #94a3b8; 
  font-size: 11px; 
  font-weight: 800; 
  text-transform: uppercase; 
  letter-spacing: 1px; 
  white-space: nowrap;
}
.tabla-premium td { 
  padding: 20px; 
  border-bottom: 1px solid #f8fafc; 
  color: #1e293b; 
  font-size: 14px; 
  font-weight: 600; 
  background: white;
}
.tabla-premium tbody tr:hover td { background: #fcfdfe; }

.fecha-cell { display: flex; flex-direction: column; }
.main-date { font-weight: 800; color: #1e293b; font-size: 14px; }
.sub-time { font-size: 11px; color: #64748b; margin-top: 2px; }

.nombre-cliente { font-weight: 700; color: #1e293b; }
.direccion-cell { max-width: 250px; }
.direccion-txt { 
  color: #64748b; 
  font-size: 13px; 
  line-height: 1.4;
  display: -webkit-box; 
  -webkit-line-clamp: 2; 
  line-clamp: 2; 
  -webkit-box-orient: vertical; 
  overflow: hidden; 
}

.items-mini-list { display: flex; flex-wrap: wrap; gap: 6px; }
.item-tag { 
  background: #f1f5f9; 
  color: #475569; 
  padding: 4px 10px; 
  border-radius: 6px; 
  font-size: 11px; 
  font-weight: 700; 
  white-space: nowrap; 
}

.monto-cell { text-align: right; }
.monto-val { font-size: 16px; font-weight: 900; color: #3b82f6; }

.badge-azul { background: #eff6ff; color: #3b82f6; }
.badge-verde { background: #ecfdf5; color: #10b981; }
.badge-naranja { background: #fff7ed; color: #f59e0b; }
.badge-morado { background: #f5f3ff; color: #8b5cf6; }

/* EMPTY STATE PREMIUN */
.empty-state-delivery { padding: 60px 40px; text-align: center; max-width: 400px; margin: 0 auto; }
.empty-icon-wrapper { 
  width: 80px; 
  height: 80px; 
  background: #f1f5f9; 
  border-radius: 50%; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  margin: 0 auto 20px; 
}
.empty-icon { font-size: 40px; opacity: 0.5; }
.empty-state-delivery h4 { font-size: 18px; color: #1e293b; margin-bottom: 10px; }
.empty-state-delivery p { font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 25px; }
.btn-reset-filter { 
  background: #3b82f6; 
  color: white; 
  border: none; 
  padding: 10px 20px; 
  border-radius: 10px; 
  font-weight: 700; 
  cursor: pointer; 
  transition: 0.2s; 
}
.btn-reset-filter:hover { background: #2563eb; transform: translateY(-1px); }

/* TABS */
.tabs-container { display: flex; gap: 10px; border-bottom: 2px solid #f1f5f9; margin-bottom: 30px; }
.tab { padding: 12px 25px; border: none; background: transparent; color: #94a3b8; font-weight: 700; font-size: 14px; cursor: pointer; position: relative; transition: 0.3s; }
.tab.activo { color: #3b82f6; }
.tab.activo::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 100%; height: 2px; background: #3b82f6; }

/* TABLAS Y GRÁFICOS */
.grid-reportes { display: grid; grid-template-columns: 1.5fr 1fr; gap: 30px; }
.premium-table-card { background: white; padding: 30px; border-radius: 20px; border: 1px solid rgba(226, 232, 240, 0.8); box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05); }

.tarjeta-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
.tarjeta-header h3 { font-size: 18px; font-weight: 800; color: #0f172a; margin: 0; }
.mes-badge { background: #e0f2fe; color: #0369a1; padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; }

.table-responsive { overflow-x: auto; }
.tabla-resumen { width: 100%; border-collapse: collapse; }
.tabla-resumen th { text-align: left; font-size: 11px; font-weight: 700; color: #94a3b8; padding: 12px 0; border-bottom: 2px solid #f1f5f9; text-transform: uppercase; letter-spacing: 1px; }
.tabla-resumen td { padding: 18px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 600; color: #1e293b; }

.total-texto { font-weight: 800; color: #64748b; }
.total-azul { font-weight: 800; color: #3b82f6; font-size: 16px; }

/* GRÁFICOS SIMULADOS */
.grafico-header { margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
.grafico-header h3 { font-size: 16px; font-weight: 800; color: #0f172a; margin: 0; }
.grafico-header p { font-size: 12px; color: #94a3b8; margin: 2px 0 0 0; font-weight: 600; }

.area-grafico { height: 250px; background: #f8fafc; border-radius: 12px; border: 1px dashed #cbd5e1; display: flex; justify-content: center; align-items: center; color: #94a3b8; font-weight: 600; font-size: 12px; }

/* Animación removida */

/* ====================================
   ESTILOS VISTA CAJERO (FORMATO A4 PDF)
   ==================================== */
.vista-cajero-print-container { max-width: 700px; margin: 0 auto; width: 100%; }

.agregar-nota-box { background: white; padding: 20px; border-radius: 10px; border: 1px dashed #cbd5e1; margin-bottom: 25px; }
.agregar-nota-box label { display: block; font-weight: 700; color: #1e293b; margin-bottom: 10px; font-size: 14px; }
.agregar-nota-box textarea { width: 100%; padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; font-size: 14px; outline: none; transition: 0.2s; min-height: 80px; resize: vertical; }
.agregar-nota-box textarea:focus { border-color: #3b82f6; background: white; }

/* LA HOJA TIPO DOCUMENTO  */
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

.doc-metodos-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 15px; }
.doc-metodo-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; display: flex; flex-direction: column; }
.doc-metodo-cero { opacity: 0.5; }
.doc-met-lbl { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 5px; }
.doc-met-val { font-size: 20px; font-weight: 800; color: #1e293b; }
.doc-total-box { background: #1e293b; color: white; padding: 15px 25px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; font-weight: 700; }
.doc-total-val { font-size: 22px; color: #34d399; }

.productos-compactos { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px 20px; }
.prod-fila-compacta { display: flex; align-items: center; padding: 6px 15px 6px 6px; background: white; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 13px; }
.prod-cant-box { background: #3b82f6; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 4px; padding: 4px 10px; margin-right: 15px; min-width: 45px; }
.prod-cant-box .prod-minitext { font-size: 8px; color: #bfdbfe; font-weight: 700; text-transform: uppercase; margin-bottom: 2px; }
.prod-cant-box .prod-bigtext { font-size: 13px; font-weight: 800; color: white; line-height: 1; }

.prod-desc-box { flex: 1; color: #1e293b; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 10px; }

.prod-total-box { display: flex; flex-direction: column; align-items: flex-end; justify-content: center; }
.prod-total-box .prod-minitext { font-size: 8px; color: #94a3b8; font-weight: 700; text-transform: uppercase; margin-bottom: 2px; }
.prod-total-box .prod-bigtext { font-size: 14px; font-weight: 800; color: #0f172a; line-height: 1; }

.doc-nota-block { border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; background: #fafafa; font-size: 14px; line-height: 1.6; min-height: 80px; white-space: pre-wrap; }
.text-sin-novedad { color: #94a3b8; font-style: italic; }



/* ====================================
   RESPONSIVE MÓVIL
   ==================================== */
@media (max-width: 1024px) { .grid-reportes { grid-template-columns: 1fr; } }
@media (max-width: 768px) {
  .app-layout { flex-direction: column; }
  .main-content { padding: 20px; }
  .page-header { flex-direction: column; align-items: flex-start; gap: 15px; }
  .header-actions { width: 100%; justify-content: space-between; flex-direction: row-reverse; align-items: center; }
  .perfil-usuario-top { padding: 10px 15px; margin-top: 0; }
  .info-texto-top { text-align: left; }
  .tarjeta-header { flex-direction: column; align-items: flex-start; gap: 15px; }
  .btn-descargar, .btn-imprimir { width: 100%; justify-content: center; }
  .search-box { width: 100%; }
  .filtros-card { flex-direction: column; align-items: flex-start; gap: 15px; }
  .inputs-fecha { flex-direction: column; width: 100%; }
  .input-group input { width: 100%; }
  .tabs-container { overflow-x: auto; white-space: nowrap; padding-bottom: 5px; }
}

/* ESTILOS DE TICKET REUTILIZADOS */
.super-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 20px; }
.modal-ticket-container { background: white; border-radius: 12px; padding: 20px; max-width: 380px; width: 100%; }

.acciones-factura { display: flex; flex-direction: column; gap: 8px; margin-top: 25px; }
.btn-imprimir-ticket { background: #3b82f6; color: white; border: none; padding: 12px; border-radius: 10px; font-weight: 700; cursor: pointer; }
.btn-cerrar-ticket { background: #f1f5f9; color: #64748b; border: none; padding: 12px; border-radius: 10px; font-weight: 600; cursor: pointer; }

@media print {
  @page { margin: 0; size: auto; }
  
  /* 1. Reset Extremo del Documento */
  html, body, #app, .app-layout, .main-content { 
    background: white !important; 
    margin: 0 !important; 
    padding: 0 !important; 
    height: auto !important; 
    min-height: 0 !important;
    overflow: visible !important;
    display: block !important;
    position: static !important;
  }

  /* 2. Ocultar todos los hermanos de la jerarquía que no sean el ticket */
  #app > *:not(.app-layout),
  .app-layout > *:not(.main-content),
  .main-content > *:not(.super-modal-overlay) {
    display: none !important;
  }

  /* Ocultar elementos UI específicos */
  aside, .sidebar-dark, .sidebar-mini, .page-header, .tabs-container, .filtros-reporte, .premium-kpi-grid, .grid-reportes, .perfil-usuario-top, .no-print, .acciones-factura { 
    display: none !important; 
  }

  /* 3. El Contenedor del Reporte se vuelve el Flujo Principal */
  .super-modal-overlay { 
    position: static !important; 
    display: block !important;
    background: white !important; 
    padding: 0 !important;
    margin: 0 !important;
    width: 100% !important;
    min-height: 0 !important;
  }

  /* Caso Ticket Térmico (80mm) */
  .modal-ticket-container { 
    width: 80mm !important; 
    margin: 0 auto !important;
    box-shadow: none !important; 
    padding: 0 !important;
    border: none !important;
    display: block !important;
  }

  .factura-ticket { 
    width: 80mm !important; 
    padding: 6mm !important;
    box-sizing: border-box !important;
    display: block !important;
    margin: 0 auto !important;
    break-inside: avoid;
  }

  /* Caso Reporte Cierre Z (A4) - Especial */
  .documento-a4.printable-cierre { 
    position: relative !important;
    padding: 10mm !important; 
    margin: 0 !important; 
    border: none !important; 
    box-shadow: none !important; 
    width: 100% !important; 
    max-width: 100% !important; 
    min-height: auto !important;
    transform: scale(0.98);
    transform-origin: top center;
    display: block !important;
    break-inside: avoid;
  }
}

/* --- TABS PREMIUM CAJERO --- */
.tabs-premium-cajero { display: flex; gap: 10px; background: white; padding: 8px; border-radius: 16px; margin-bottom: 30px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.02); justify-content: center; }
.t-btn { flex: 1; max-width: 250px; background: transparent; border: none; padding: 12px 15px; border-radius: 12px; color: #64748b; font-weight: 700; font-size: 13px; cursor: pointer; transition: 0.3s; display: flex; justify-content: center; align-items: center; gap: 8px; }
.t-btn:hover { background: #f8fafc; color: #334155; }
.t-btn.activo { background: #3b82f6; color: white; box-shadow: 0 6px 15px rgba(59,130,246,0.25); }
.t-btn.activo .t-icon { opacity: 1; }
.t-icon { font-size: 16px; }

/* --- TABLA TRANSACCIONES CAJERO --- */
.transacciones-cajero { background: white; border-radius: 16px; padding: 25px; margin-top: 30px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
.transacciones-titulo { font-size: 18px; color: #1e293b; font-weight: 800; margin: 0; }
.transacciones-subtitle { color: #64748b; font-size: 13px; margin: 5px 0 20px 0; }
.table-responsive-transacciones { width: 100%; overflow-x: auto; border-radius: 12px; border: 1px solid #f1f5f9; }
.tabla-transacciones { width: 100%; border-collapse: collapse; text-align: left; }
.tabla-transacciones th { background: #f8fafc; padding: 12px 15px; font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0; white-space: nowrap; }
.tabla-transacciones td { padding: 14px 15px; font-size: 14px; border-bottom: 1px solid #f1f5f9; color: #334155; vertical-align: middle; white-space: nowrap; }
.tabla-transacciones tr:hover { background-color: #f8fafc; }
.badge-origen { padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; }
.badge-origen.web { background: #dbeafe; color: #1d4ed8; border: 1px solid #bfdbfe; }
.badge-origen.pos { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
.hora-badge { font-family: monospace; font-size: 12px; background: #f1f5f9; padding: 4px 8px; border-radius: 6px; color: #64748b; }
.metodo-txt { font-weight: 600; color: #0f172a; }
.monto-transaccion { font-weight: 800; color: #10b981; text-align: right; font-size: 15px; }
.text-center-empty { text-align: center; color: #94a3b8; padding: 30px !important; font-style: italic; }

.row-clickable { cursor: pointer; transition: 0.2s background-color, 0.2s transform; }
.row-clickable:hover { background-color: #f1f5f9 !important; border-radius: 8px; transform: translateX(4px); }

/* --- MODAL DETALLE Y FOTO --- */
.modal-split { display: flex; align-items: center; justify-content: center; padding: 20px; overflow-y: auto; }
.split-wrapper { display: flex; align-items: flex-start; gap: 30px; max-width: 900px; width: 100%; flex-wrap: wrap; justify-content: center; }
.evidencia-panel { background: white; padding: 25px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 10px 40px rgba(0,0,0,0.1); display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 400px; justify-content: center; }
.evidencia-titulo { margin: 0 0 15px 0; color: #1e293b; font-size: 16px; font-weight: 800; }
.evidencia-img { max-width: 100%; border-radius: 10px; border: 1px solid #cbd5e1; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
.evidencia-marco-empty { background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 40px 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; }

@media (max-width: 768px) {
  .transacciones-cajero { padding: 15px; margin-top: 20px; }
  .tabla-transacciones th, .tabla-transacciones td { padding: 10px; font-size: 12px; }
  .split-wrapper { gap: 15px; }
  .evidencia-panel { padding: 15px; }
}
</style>