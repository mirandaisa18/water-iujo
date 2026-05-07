<template>
  <div class="factura-ticket" id="seccion-ticket">
    <div class="ticket-header">
      <span class="ticket-logo">💧</span>
      <h2>WATER IUJO</h2>
      <p>J-30555666-0</p>
      <p>Av. Las Industrias, Barquisimeto-Lara</p>
      <p>Tel: 0251-1234567</p>
    </div>

    <div class="ticket-info">
      <p><strong>Factura #:</strong> {{ factura.numero || factura.id }}</p>
      <p><strong>Fecha:</strong> {{ factura.fecha }} <span v-if="factura.hora">· {{ factura.hora }}</span></p>
      <p v-if="factura.cajero"><strong>Vendedor:</strong> {{ factura.cajero }}</p>
      
      <!-- Desglose de pagos múltiples o único -->
      <div v-if="factura.metodosPago && factura.metodosPago.length > 0" class="ticket-multi-pagos">
         <strong>Formas de Pago:</strong>
         <div v-for="(p, i) in factura.metodosPago" :key="i" class="pago-ticket-item">
            <span>• {{ p.metodo }}:</span>
            <span>${{ p.monto.toFixed(2) }}</span>
         </div>
      </div>
      <p v-else-if="factura.metodoPago || factura.metodo"><strong>Pago:</strong> {{ factura.metodoPago || factura.metodo }}</p>
    </div>

    <div class="ticket-divider"></div>

    <div class="ticket-cliente" v-if="factura.cliente">
      <p><strong>Cliente:</strong> {{ typeof factura.cliente === 'string' ? factura.cliente : factura.cliente.nombre }}</p>
      <p v-if="factura.cliente.rif"><strong>RIF/CI:</strong> {{ factura.cliente.rif }}</p>
    </div>

    <div class="ticket-divider"></div>

    <table class="tabla-ticket">
      <thead>
        <tr>
          <th>DESCRIPCIÓN</th>
          <th class="txt-cen">CANT</th>
          <th class="txt-der">TOTAL</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in factura.items" :key="i">
          <td>{{ item.nombre }}</td>
          <td class="txt-cen">{{ item.cantidad || item.cant }}</td>
          <td class="txt-der">${{ ((item.precioVenta || item.precio || 0) * (item.cantidad || item.cant)).toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>

    <div class="ticket-divider"></div>

    <div class="controles-totales-ticket">
      <div class="fila-ticket">
        <span>SUBTOTAL USD:</span>
        <span>${{ (factura.subtotalUSD || 0).toFixed(2) }}</span>
      </div>
      
      <div class="fila-ticket">
        <span>IVA (16%):</span>
        <span>${{ (factura.ivaUSD || 0).toFixed(2) }}</span>
      </div>

      <div class="fila-ticket" v-if="factura.delivery && factura.delivery.costo > 0">
        <span class="txt-delivery">DELIVERY:</span>
        <span class="txt-delivery">+ ${{ factura.delivery.costo.toFixed(2) }}</span>
      </div>
      
      <div class="fila-ticket total-usd-fila">
        <span>TOTAL USD:</span>
        <strong>${{ (factura.totalUSD || 0).toFixed(2) }}</strong>
      </div>

      <div class="fila-ticket">
        <span>TASA:</span>
        <span>{{ (factura.tasa || 0).toFixed(2) }} Bs/USD</span>
      </div>

      <div class="fila-ticket total-bs">
        <span>TOTAL BS:</span>
        <strong>{{ (factura.totalBS || 0).toLocaleString('es-VE', { minimumFractionDigits: 2 }) }} Bs</strong>
      </div>
    </div>

    <div v-if="factura.delivery" class="ticket-delivery">
      <div class="ticket-divider"></div>
      <strong>ESTADO: DELIVERY</strong>
      <div class="paradas-ticket">
        <p v-for="(d, idx) in factura.delivery.destinos" :key="idx">
          • Parada {{idx + 1}}: {{ d.direccion }}
        </p>
      </div>
    </div>

    <div class="ticket-footer">
      <p>¡Gracias por su compra!</p>
      <p>Conserve su ticket para devoluciones</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  factura: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.factura-ticket {
  background: white;
  width: 100%;
  max-width: 340px;
  padding: 25px;
  border-radius: 12px;
  font-family: 'Inter', system-ui, sans-serif;
  color: #1e293b;
  margin: 0 auto;
}

.ticket-header { text-align: center; margin-bottom: 20px; }
.ticket-logo { font-size: 24px; display: block; margin-bottom: 5px; }
.ticket-header h2 { margin: 5px 0; font-size: 18px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; }
.ticket-header p { font-size: 11px; margin: 2px 0; color: #64748b; }

.ticket-divider { border-bottom: 1px dashed #e2e8f0; margin: 15px 0; }

.tabla-ticket { width: 100%; border-collapse: collapse; font-size: 12px; }
.tabla-ticket th { text-align: left; border-bottom: 1px solid #f1f5f9; padding: 8px 0; font-weight: 700; color: #64748b; }
.tabla-ticket td { padding: 8px 0; vertical-align: middle; border-bottom: 1px solid #f8fafc; }

.ticket-info p, .ticket-cliente p { font-size: 12px; margin: 5px 0; display: flex; justify-content: space-between; }
.ticket-info p strong, .ticket-cliente p strong { color: #475569; font-weight: 600; }

.controles-totales-ticket { margin-top: 15px; }
.fila-ticket { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px; }
.fila-ticket-nota { display: flex; justify-content: center; font-size: 9px; color: #94a3b8; font-style: italic; margin-bottom: 8px; margin-top: -3px; text-align: center; }
.txt-delivery { color: #1e3a8a; font-weight: 700; }
.total-usd-fila { border-top: 1px dashed #e2e8f0; padding-top: 8px; margin-top: 8px; font-size: 14px; }
.total-bs { 
  font-size: 16px; 
  border-top: 1px solid #e2e8f0; 
  padding-top: 12px; 
  margin-top: 10px; 
  font-weight: 800; 
  color: #1e293b;
}

.ticket-multi-pagos { margin: 10px 0; font-size: 12px; border: 1px dashed #e2e8f0; padding: 10px; border-radius: 8px; background: #f8fafc; }
.ticket-multi-pagos strong { display: block; margin-bottom: 5px; color: #475569; font-size: 11px; text-transform: uppercase; }
.pago-ticket-item { display: flex; justify-content: space-between; margin-bottom: 2px; color: #1e293b; font-weight: 600; }

.ticket-footer { text-align: center; font-size: 11px; margin-top: 25px; line-height: 1.4; color: #94a3b8; }
.txt-der { text-align: right !important; }
.txt-cen { text-align: center !important; }

.ticket-delivery {
  font-size: 11px;
  color: #1e3a8a;
  background-color: #f8fafc;
  padding: 10px;
  border-radius: 8px;
  margin-top: 15px;
}
.paradas-ticket { margin-top: 8px; }
.paradas-ticket p {
  margin: 4px 0;
  color: #475569;
}

@media print {
  .factura-ticket { 
    width: 80mm !important; 
    padding: 4mm !important;
    box-shadow: none !important; 
    margin: 0 !important;
    border-radius: 0 !important;
    break-inside: avoid !important;
    page-break-after: avoid !important;
  }
}
</style>
