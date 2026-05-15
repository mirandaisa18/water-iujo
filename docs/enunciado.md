# Enunciado del Proyecto: Sistema de Gestión de Recargas y Ventas de Botellones de Agua

## Información General
**Responsable:** Eduar Suarez  
**Proyecto:** Sistema de Gestión de Recargas y Ventas de botellones de agua.

---

## Módulos Funcionales y Requerimientos de Negocio

### 1. Gestión de Productos e Inventario
Este módulo se encarga del control y diferenciación de los activos y suministros del negocio.

*   **Diferenciación de Ítems:**
    *   **Insumo:** Agua (medida por litros o por capacidad de botellón estándar).
    *   **Producto Físico:** Botellones nuevos (unidades).
*   **Control de Compras:** Registro detallado de la adquisición de botellones vacíos a proveedores para asegurar la disponibilidad del stock.

### 2. Módulo de Ventas y Servicios
Gestión operativa de las transacciones comerciales principales.

*   **Lógica de Recarga:** Procesamiento de la venta del servicio de llenado cuando el cliente suministra su propio envase (Estructura de costo: Agua + Procesamiento).
*   **Venta Integral:** Venta combinada de "Botellón Nuevo + Recarga". El sistema realiza el cálculo automático sumando el costo del envase y el líquido, descontando simultáneamente una unidad del inventario físico.
*   **Precios Dinámicos:** Flexibilidad para ajustar tarifas de recarga basadas en la capacidad del envase (Ejemplo: 5L, 10L, 20L).

### 3. Gestión de Gastos Operativos
Control y registro de las obligaciones financieras mensuales.

*   **Registro de Egresos:** Módulo dedicado a la carga de costos fijos operativos, incluyendo:
    *   Suministro eléctrico.
    *   Servicio de Internet.
    *   Arrendamiento del local.
    *   Suministro de agua de red.

### 4. Facturación Rápida
*   **Interfaz de Punto de Venta:** Optimización para ventas de mostrador con flujo ágil.
*   **Métodos de Pago:** Soporte multimoneda y multiformato (Efectivo, Pago Móvil, Divisas).

---

## Requerimientos Contables y Sistematización
Automatización de la transformación de datos operativos en informes financieros estructurados.

### Reportes Financieros
*   **Balance General:**
    *   **Activos:** Conciliación de Caja/Bancos e Inventario de botellones nuevos.
    *   **Pasivos:** Gestión de cuentas por pagar a proveedores.
    *   **Patrimonio:** Visualización de capital y utilidades acumuladas.
*   **Estado de Resultados:**
    *   **Ingresos:** Clasificación segmentada por "Solo Recargas" y "Venta de Botellones".
    *   **Gastos:** Consolidación de costos operativos (electricidad, internet, alquiler, agua).
    *   **Utilidad Neta:** Cálculo de rentabilidad real post-deducciones.
*   **Reporte de Volumen:** Estadística de litros totales despachados en periodos de tiempo específicos.

---

## Especificaciones Técnicas y Experiencia de Usuario (UX)

### Control de Acceso (RBAC)
*   **Administrador:** Acceso total a gestión de precios, auditoría de compras y reportes contables.
*   **Despachador/Cajero:** Permisos limitados al registro operativo de ventas y recargas.

### Validaciones Críticas de Sistema
*   **Control de Stock Real:** Restricción automatizada para ventas integrales (botellón + recarga) si el inventario físico es insuficiente.
*   **Alertas Tempranas:** Notificaciones automáticas al alcanzar niveles mínimos de stock para reposición de envases.

### Interfaz y Usabilidad
*   **Diseño:** Interfaz minimalista, limpia y de alto rendimiento, optimizada para entornos de alta rotación en mostrador.
