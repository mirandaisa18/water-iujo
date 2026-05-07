# Sistema de Gestión de Recargas y Ventas de Botellones de Agua

Bienvenido al repositorio del Sistema Integral de Ventas para operaciones de embotellado y recarga de agua purificada, desarrollado con un Frontend dinámico en Vue/Vite y un Backend robusto en Node.js (Express + SQLite).

## Módulos Funcionales y Requerimientos de Negocio

El sistema ha sido construido bajo arquitecturas de alto rendimiento diseñadas para satisfacer las siguientes áreas operativas:

### 1. Gestión de Productos e Inventario
La arquitectura permite una diferenciación clara entre el servicio y los productos tangibles:
- **Insumo Principal:** Agua (Medida transaccionalmente por litros o por capacidad de botellón estándar, ej. 10L, 19L, 20L).
- **Producto Físico:** Botellones nuevos (unidades métricas o stock físico).
- **Control de Compras:** Existe el registro enfocado a la adquisición de botellones vacíos a proveedores clave para retroalimentar el stock.

### 2. Módulo de Ventas y Servicios
Para adaptarse a los escenarios comerciales reales de embotelladoras, el POS ejecuta:
- **Lógica de Recarga:** Venta prioritaria del servicio de llenado aplicable cuando el cliente trae o usa su propio envase (Cobro por consumo de agua + proceso).
- **Venta Integral:** Módulo de "Botellón Nuevo + Recarga". El back-end suma automáticamente el costo del envase de plástico virgen más el contenido líquido y realiza una descarga (debitando una unidad) del inventario físico.
- **Precios Dinámicos:** Capacidad modular y responsiva para ajustar los precios al vuelo en recargas dependiendo del tamaño (5L, 10L, 20L, etc.).

### 3. Gestión de Gastos Operativos
Toda utilidad requiere una base sólida de egresos. El Gestor incorpora un módulo para asentar mensualmente los **Costos Fijos Operativos (OPEX)**:
- Electricidad.
- Internet/Telecomunicaciones.
- Alquiler o arriendo del local.
- Agua o matriz proveedora.

### 4. Facturación Rápida (Caja & POS)
- **Interfaz Simplificada:** Un diseño táctil o point-and-click veloz para las operaciones de alto flujo en mostrador sin ralentizar los turnos.
- Registro atómico de métodos de pago multi-divisa (Efectivo, Pago Móvil, Divisas).

---

## Requerimientos Contables (Sistematización)

Toda venta es procesada para alimentar un sistema financiero asíncrono y en tiempo real con 5 dimensiones críticas:

### Balance General
- **Activos:** Caja, Cuentas Bancarias, Inventario tasado en botellones nuevos disponibles (liquidez estática).
- **Pasivos:** Cuentas referenciadas por pagar a proveedores institucionales.
- **Patrimonio:** Expresión de capital y utilidades retenidas o acumuladas mes a mes.

### Estado de Resultados
- **Ramas de Ingresos:** Los tickets desgloban de forma analítica dos columnas: "Solo Recargas" vs. "Venta de Botellones".
- **Estructura de Gastos:** Incorpora el descuento financiero de servicios base (Electricidad, internet, alquiler y suministro primario).
- **Kpi de Utilidad Neta:** Proyección algorítmica y veraz que resulta de restar la línea de gastos operativos de la línea de ganancia bruta.

### Reporte de Volumen Comercial
- Análisis de **litraje despachado**, permitiendo filtrar reportes de flujo de líquidos bajo selectores de fecha personalizados (diario, semanal, mensual o "Custom Range").

---

## Especificaciones Técnicas y UX

La interfaz visual y el backend se ensamblan con validaciones estrictas y protección de estado.

### 1. Control de Permisos por Roles (RBAC)
- **Administrador:** Capacidad global de gestión de precios, inyección de nuevas unidades en compras de botellones y visibilidad exclusiva sobre reportes contables y utilidades.
- **Cajero / Despachador:** Limite atómico enfocado en registro y visualización de ventas, reportes ciegos (cierres Z) y recargas de mostrador.
- **Delivery:** Visión limitada al registro de actividad individual e historial de despacho en calle.

### 2. Validaciones Críticas & Backend Integro
- Regla 1: Está terminalmente **prohibida** en sistema la venta y facturación de la oferta "Botellón con Recarga" si el inventario de estantería y bodega refleja balance cero en envases físicos, deteniendo la operación en el POS con alerta sonora/visual.
- Regla 2: Un módulo de inteligencia proactiva emitirá alertas naranjas de Stock Mínimo previniendo quiebres de inventarios frente a la inminencia de reposición de envases.

### Instalación (Quick Start)
En la terminal, ejecuta `npm install` tanto en `backend` como en el front `vue`.
Puedes arrancar la estructura dual desde la raíz con:
```bash
npm run dev
```
