# 💧 Water IUJO - Sistema de Gestión y POS

**Water IUJO** es un sistema integral de Punto de Venta (POS) y gestión administrativa diseñado específicamente para negocios de distribución y venta de agua potable (recargas y venta de botellones).

El proyecto abarca el ciclo completo de la empresa: desde la atención al cliente en caja y gestión de entregas (delivery), hasta el control estricto de inventario físico, registro de gastos operativos y generación de reportes contables automáticos (Balance General).

---

## 🚀 Características Principales

*   **Punto de Venta (POS):** Interfaz ágil para cajeros, soporta múltiples métodos de pago, cálculo de vuelto y validación estricta de stock físico en tiempo real.
*   **Gestión de Inventario:** Control CRUD de productos e insumos. Emite alertas automáticas cuando un producto alcanza su stock mínimo.
*   **Control de Gastos:** Registro de egresos categorizados (Electricidad, Alquiler, Mantenimiento, Suministros, etc.) para mantener la contabilidad exacta.
*   **Reportes Financieros:** Cálculo automático de Estado de Resultados (Ingresos vs Egresos = Utilidad Neta), Balance General, y gráficas de volumen de litros despachados.
*   **Seguridad y Roles:** Autenticación basada en JWT. Interfaces adaptadas según el rol del usuario (Administrador, Cajero, Delivery).
*   **Módulo Delivery:** Pantalla especializada para que los repartidores visualicen sus despachos y totalicen sus cobranzas en ruta.

---

## 🛠️ Stack Tecnológico

El proyecto está dividido en dos aplicaciones principales conectadas mediante una API REST:

**Frontend (Cliente):**
*   Vue 3 (Composition API & `<script setup>`)
*   Vite (Bundler rápido)
*   Pinia (Manejo de estado global)
*   Vue Router (Navegación protegida)

**Backend (Servidor):**
*   Node.js con TypeScript
*   Express.js (Framework de API REST)
*   Sequelize (ORM para consultas SQL)
*   SQLite3 (Base de datos relacional ligera, archivo local `database.sqlite`)
*   JWT & Bcrypt (Seguridad y encriptación)

---

## ⚙️ Instalación Local (Desarrollo)

Sigue estos pasos para levantar el entorno completo en tu máquina local.

### 1. Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd water-iujo
```

### 2. Configurar el Backend
```bash
cd backend

# Instalar dependencias
npm install

# Iniciar el servidor en modo desarrollo (Puerto 4000 por defecto)
npm run dev
```
> **Nota:** La base de datos SQLite se creará y consolidará automáticamente. El usuario por defecto para pruebas es `admin@water.com` (Contraseña: `password`).

### 3. Configurar el Frontend
Abre una nueva terminal y dirígete a la raíz del proyecto:
```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar Vite en modo desarrollo
npm run dev
```
> **Acceso:** Abre tu navegador en `http://localhost:5173`. 

---

## 📚 Documentación Adicional

Para llevar este proyecto a un entorno en vivo o servidor (VPS), por favor consulta el manual detallado de despliegue:

👉 [**Ver Manual de Implementación y Despliegue**](./docs/manual_despliegue.md)

---
*Proyecto desarrollado con enfoque en UX/UI moderna, rendimiento rápido y consistencia de datos contables.*
