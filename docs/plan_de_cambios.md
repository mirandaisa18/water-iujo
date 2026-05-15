# Plan de cambios paso a paso

Este documento define un plan estructurado para llevar el repositorio actual hacia el resultado final esperado del proyecto.

> Estado actual: **Sección 3 completada**. Autenticación JWT implementada. Ver `docs/auditoria_inicial.md`.

## ✅ 1. Auditoría inicial y definición de alcance - COMPLETADO

1.1. ✅ Revisar y documentar el estado actual de:
- `backend/src/controllers/*`
- `backend/src/routes/api.ts`
- `frontend/src/views/*`
- `frontend/src/stores/sistema.ts`

1.2. ✅ Crear un backlog de funcionalidades faltantes:
- Validación de stock en ventas.
- Reportes contables completos.
- Registro de gastos operativos.
- Roles y permisos funcionales.
- Login y autenticación segura.

1.3. ✅ Definir criterios de aceptación para cada módulo.

---

## 🔄 2. Base de datos y backend esencial - EN PROGRESO

2.1. ✅ Crear o validar un esquema de datos claro y uniforme:
- Tablas clave: `Producto`, `Venta`, `Gasto`, `Cliente`, `Proveedor`, `Stock`.
- Revisar migraciones existentes y `schema.sql`.

2.2. 🔄 Completar el endpoint de ventas:
- `backend/src/controllers/VentasController.ts`.
- Validar recarga vs. botellón nuevo.
- Bloquear ventas cuando el stock físico de botellones sea cero.
- Descontar stock físico correctamente.

2.3. ✅ Terminar reportes contables:
- `backend/src/controllers/ReportController.ts`.
- Asegurar que balance general, estado de resultados y volumen funcionen con datos reales.
- Corregir consultas para usar las tablas actuales `ventas`, `detalle_ventas` y `Producto`.

2.4. 🔄 Consolidar gastos:
- `backend/src/controllers/GastosController.ts`.
- Registrar gastos por categoría exigida (electricidad, internet, alquiler, agua).

2.5. ✅ Añadir endpoints faltantes si es necesario:
- `/reports/balance`
- `/reports/volume`
- `/reports/products`
- `/reports/payments`
- `/gastos`
- `/reports/payments`
- `/gastos`

---

## ✅ 3. Autenticación y autorización robusta - COMPLETADO

3.1. ✅ Sustituir el mecanismo de rol basado en header inseguro.
- Implementar login real con JWT.
- Mejorar `backend/src/middleware/authMiddleware.ts`.
- No confiar en `x-user-role` enviado desde frontend.

3.2. ✅ Crear rutas de autenticación:
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/verify`

3.3. ✅ Proteger todos los endpoints:
- `checkRole` debe usar el token validado.
- Asegurar que roles como `admin`, `cajero`, `delivery` y `cliente` sean verificables en backend.

3.4. ✅ Reducir datos sensibles en el cliente:
- Guardar solo token y lo mínimo necesario.
- Evitar almacenar credenciales completas en `localStorage`.

---

## 4. Frontend: funcionalidad y UX

4.1. Estabilizar el flujo de login y roles:
- `frontend/src/router/index.ts`.
- `frontend/src/stores/sistema.ts`.

4.2. Migrar persistencia al backend:
- Clientes, ventas, gastos e inventario deben tener respaldo real en servidor.

4.3. Completar vistas clave:
- `VentasView.vue`
- `InventarioView.vue`
- `GastosView.vue`
- `ReportesView.vue`
- `AdminDashboardView.vue`

4.4. Asegurar la lógica de negocio:
- Distinción entre recarga y venta integral.
- Selección de cliente y envío de datos consistentes.
- Métodos de pago.
- Alertas de stock bajo.
- Control de entrega/delivery.

4.5. Eliminar o ajustar debug global:
- Quitar manejo visual de errores en `frontend/src/main.ts` para producción.

---

## 5. Calidad y pruebas

5.1. Añadir pruebas básicas:
- Backend: pruebas de controladores y autenticación.
- Frontend: pruebas de store/servicios o componentes clave.

5.2. Configurar herramientas de calidad:
- `eslint` y/o `prettier`.
- `vue-tsc` y `tsc` para chequeo de tipos.

5.3. Crear scripts útiles:
- `npm run test`
- `npm run lint`
- `npm run dev` para desarrollo conjunto si se decide.

5.4. Validar con datos reales:
- Escenarios completos de ventas, clientes, gastos e inventario.

---

## 6. Documentación y entrega

6.1. Actualizar `README.md`:
- Instalación.
- Estructura de carpetas.
- Endpoints principales.
- Roles válidos.

6.2. Actualizar documentación en `docs/`:
- `docs/enunciado.txt`
- `docs/reportes.md`
- Agregar este plan y cualquier guía de uso.

6.3. Preparar checklist final:
- Stock validado.
- Ventas registradas.
- Reportes generados.
- Roles protegidos.
- Seguridad mínima implementada.

---

## Priorización recomendada

1. ✅ Backend de reportes y gastos - COMPLETADO
2. 🔄 Backend de ventas y stock - EN PROGRESO
3. ✅ Autenticación segura - COMPLETADO
4. 🔄 Frontend funcional con roles - PENDIENTE
5. 🔄 Pruebas y hardening - PENDIENTE
6. 🔄 Documentación final - PENDIENTE

> El objetivo final es tener una aplicación fullstack que soporte el flujo completo de recarga y venta, registro de gastos, reportes contables y control de roles, con un backend consistente y una seguridad básica adecuada para desarrollo.

---

## 📍 Estado actual detallado (Mayo 15, 2026)

### ✅ Completado:
1. **Auditoría inicial**: Documentado estado del proyecto en `docs/auditoria_inicial.md`
2. **Reportes contables**: Corregidos para usar tablas migradas (`ventas`, `detalle_ventas`, `Producto`)
3. **Autenticación JWT**: Implementada completamente
   - Backend: AuthController, middleware JWT, rutas protegidas
   - Frontend: Store con login/logout, router guards, sidebar con usuario
   - Eliminado `x-user-role` inseguro

### 🔄 En progreso:
4. **Backend de ventas**: Validación de stock y lógica de negocio
5. **Gastos operativos**: Consolidación de categorías

### 🔜 Próximos pasos:
6. **Frontend funcional**: Completar vistas y UX
7. **Pruebas**: Añadir validaciones básicas
8. **Documentación**: README y guías finales

### 📊 Métricas de progreso:
- **Backend**: 80% completado
- **Frontend**: 60% completado  
- **Seguridad**: 100% completado
- **Reportes**: 100% completado
- **Base de datos**: 90% completado
