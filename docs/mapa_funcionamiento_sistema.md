# Mapa de Funcionamiento del Sistema: Water IUJO

Este documento describe la arquitectura integral y el flujo de datos del sistema, detallando la interacción entre sus distintos componentes desde la interfaz de usuario hasta la persistencia en disco.

---

## 1. Arquitectura de Referencia: Modelo de Tres Capas
El sistema opera bajo una analogía de servicios estructurados:

1.  **Frontend (Vue.js):** El punto de interacción directa con el usuario. Recolecta peticiones y presenta información.
2.  **Backend (Express):** El núcleo de procesamiento y seguridad. Valida la lógica de negocio y autoriza transacciones.
3.  **Base de Datos (SQLite):** El repositorio persistente de información operativa y financiera.

---

## 2. Frontend: Interfaz y Experiencia de Usuario (Vue.js & Vite)
Representa la capa de presentación, optimizada para un alto rendimiento y reactividad.

### Organización de Código
*   **Vistas (Views):** Componentes de alto nivel que representan pantallas completas (ej. `VentasView.vue`).
*   **Componentes:** Piezas de interfaz reutilizables (ej. `Sidebar.vue`).
*   **Enrutador (Vue Router):** Implementa seguridad a nivel de cliente mediante **Guards** de navegación, restringiendo accesos según el rol del usuario (`RBAC`).
*   **Gestión de Estado (Pinia):** Actúa como la memoria volátil del sistema, manteniendo la persistencia de datos de sesión (como el carrito de compras) durante la navegación.

```javascript
// Implementación de Guardia de Navegación
router.beforeEach((to, from) => {
  const rol = sessionStorage.getItem('rolUsuario');
  if (to.path === '/admin' && rol !== 'admin') {
    return '/'; // Redirección por falta de privilegios
  }
  return true;
});
```

---

## 3. Backend: Procesamiento y Seguridad (Node.js & Express)
Actúa como intermediario obligatorio para garantizar la integridad de los datos.

### Interfaz de Programación de Aplicaciones (API)
El Backend expone **Endpoints** (Rutas URL) que el Frontend consume. Ninguna operación de escritura en la base de datos se realiza directamente desde el cliente.

*   **Validación Estricta:** El controlador (`Controller`) desconfía de la información recibida, aplicando validaciones de tipo y rango antes de procesar cualquier solicitud.

```typescript
// Lógica de Validación en Controlador
export const registrarVenta = async (req: Request, res: Response) => {
    const orden = req.body; 
    if (orden.total < 0) {
        return res.status(400).json({ error: "Integridad de datos fallida: Total negativo" });
    }
    // Continuar con persistencia...
};
```

---

## 4. Base de Datos: Persistencia (SQLite)
Se utiliza un motor de base de datos relacional ligero, donde toda la información reside en un único archivo binario: `database.sqlite`.

*   **Seguridad:** El acceso está restringido exclusivamente al proceso del Backend, el cual se comunica mediante sentencias SQL estandarizadas para realizar consultas y actualizaciones de stock.

---

## 5. Ciclo de Vida de una Transacción: El Flujo de Datos
El siguiente es el recorrido de la información durante una venta estándar:

1.  **Captura (Frontend):** El cajero gestiona el carrito en `VentasView.vue`. Vue.js calcula subtotales en tiempo real.
2.  **Transmisión (Axios):** Al procesar, el Frontend empaqueta la orden y la envía mediante una petición HTTP POST al Backend.
3.  **Procesamiento (Backend):** `VentasController.ts` intercepta el paquete, verifica la disponibilidad de stock físico y aplica las reglas de negocio.
4.  **Persistencia (SQLite):** Se ejecutan transacciones SQL para descontar inventario e insertar el registro de venta.
5.  **Confirmación:** El Backend responde con un código `200 OK`. El Frontend recibe la confirmación y reinicia el estado de la interfaz para la siguiente operación.

---

## 6. Integraciones de Terceros
El sistema implementa capacidades de comunicación con servicios externos para enriquecer la toma de decisiones:

*   **Dashboard Administrativo:** Conexión asíncrona con APIs de divisas (`ve.dolarapi.com`) para la actualización automática de tasas cambiarias (BCV/Paralelo), eliminando la carga manual de datos.

---

## Resumen Ejecutivo
*   **Vue.js:** Recolección y presentación de datos (Frontend).
*   **Express:** Lógica, seguridad y orquestación (Backend).
*   **SQLite:** Persistencia y almacenamiento estructurado (Database).
*   **Axios/Fetch:** Canales de comunicación entre capas.

Esta arquitectura **Cliente-Servidor** garantiza un sistema escalable, seguro y profesional, alineado con los estándares modernos de desarrollo web.
