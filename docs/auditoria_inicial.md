# Auditoría inicial del repositorio

Este documento resume el estado actual del proyecto al comenzar el plan de cambios.

## 1. Objetivo

Registrar el estado real del backend y frontend para identificar las áreas que deben mejorarse primero.

## 2. Estado actual del backend

### 2.1. Ventas
- `backend/src/controllers/VentasController.ts` implementa el registro de ventas.
- Se valida que exista al menos un item en la venta.
- Se identifica y valida el stock de botellones físicos para ventas tipo botellón, combo o integral.
- Si no hay stock suficiente, la venta se rechaza con un error 400.
- Si el stock es suficiente, se descuenta de la tabla `Producto`.
- Se valida que el cliente exista en la tabla `clientes`.
- Se valida que el vendedor exista en la tabla `Usuario`.
- La venta se inserta en la tabla `ventas` y sus detalles en `detalle_ventas`.
- Hay un endpoint de historial de ventas que filtra ventas de cajeros por `x-user-role` y `x-user-id`.

### 2.2. Reportes
- `backend/src/controllers/ReportController.ts` ofrece `getBalanceReport` y `getVolumeReport`.
- El balance general calcula activos como suma de ventas más valor de inventario, pasivos como compras y patrimonio como activos menos pasivos.
- El estado de resultados desglosa ingresos por recargas y por botellones.
- `getVolumeReport` calcula litros totales en base a `Detalle_Venta` y genera una tendencia semanal simulada.
- Los endpoints `getProductsReport`, `getPaymentsReport` y `getUsersActivityReport` todavía retornan `501 Not Implemented`.

### 2.3. Gastos
- `backend/src/controllers/GastosController.ts` permite consultar gastos y registrar nuevos gastos.
- Valida campos obligatorios y monto mayor a cero.
- Retorna datos con formato compatible para frontend.

### 2.4. Inventario
- `backend/src/controllers/InventarioController.ts` expone CRUD completo sobre `Producto`.
- Consulta inventario con campos normalizados para frontend.
- Inserta, actualiza y elimina productos con validación básica de existencia.

### 2.5. Alertas
- `backend/src/controllers/AlertController.ts` intenta generar alertas de stock bajo y de mantenimiento.
- La consulta de stock bajo utiliza una tabla `Stock` unida a `Producto`.
- También busca mantenimientos próximos dentro de los siguientes 7 días.

### 2.6. Autorización
- `backend/src/middleware/authMiddleware.ts` valida el rol con base en el header `x-user-role`.
- No existe un sistema de login ni JWT.
- La lógica de autorización depende del frontend.

## 3. Estado actual del frontend

### 3.1. Autenticación y roles
- `frontend/src/router/index.ts` protege rutas según `sessionStorage.rolUsuario`.
- Las rutas de admin, cajero, delivery y cliente están definidas.
- No hay un flujo de login seguro basado en token JWT.

### 3.2. Estado y persistencia
- `frontend/src/stores/sistema.ts` gestiona clientes, tickets, gastos, inventario y usuarios.
- Se usa `localStorage` para almacenar usuarios, tickets y configuración.
- Se mantiene una lista de usuarios iniciales con contraseñas en claro.

### 3.3. Uso de backend
- El frontend llama a endpoints backend con `axios` y envía `x-user-role`.
- Hay funciones para fetch de clientes, historial de ventas, inventario y gastos.
- El store actualiza KPIs locales y guarda datos en el navegador.

### 3.4. UX y depuración
- `frontend/src/main.ts` incluye handlers globales de errores que insertan DOM visual en pantalla.
- Existen vistas para ventas, inventario, gastos, reportes, administración y delivery.
- El código tiene `console.log` de debug en varios puntos.

## 4. Observaciones clave

### 4.1. Bien implementado
- Lógica de ventas con validación de stock físico.
- CRUD de inventario y registro de gastos.
- Reporte de volumen y balance parcialmente implementados.
- Roles conceptuales ya definidos en frontend y backend.

### 4.2. Debe mejorarse
- Autenticación insegura: el rol viene del frontend, no hay login seguro.
- Reportes incompletos: varios endpoints retornan `501` y los cálculos usan tablas inconsistentes.
- Dependencia fuerte de `localStorage` para datos sensibles.
- Falta de pruebas automáticas y de calidad.

## 5. Próximos pasos inmediatos

1. Validar y corregir los queries de reportes para usar el esquema real. (En progreso)
2. Implementar un endpoint de autenticación y reemplazar el uso de `x-user-role` por token JWT.
3. Revisar y completar los endpoints de reportes faltantes.
4. Inspeccionar vistas clave del frontend para asegurar que usen los endpoints correctos.
5. Documentar y consolidar el esquema de la base de datos.
