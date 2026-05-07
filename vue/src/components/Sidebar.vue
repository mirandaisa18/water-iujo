<template>
  <aside class="sidebar-dark">
    <div class="logo-container">
      <div class="icono-gota-bg">
        <span class="icono-gota">💧</span>
      </div>
      <h1>WATER IUJO</h1>
    </div>
    
    <nav class="menu-lateral">
      <!-- VISTA ADMIN: Dashboard, Inventario, Gastos, Usuarios -->
      <template v-if="esAdmin">
        <RouterLink to="/admin" class="item-menu" active-class="activo">
          <span class="icono-menu">🎛️</span>
          <span class="texto-menu">Dashboard</span>
        </RouterLink>
        <RouterLink to="/inventario" class="item-menu" active-class="activo">
          <span class="icono-menu">📦</span>
          <span class="texto-menu">Inventario</span>
        </RouterLink>
        <RouterLink to="/gastos" class="item-menu" active-class="activo">
          <span class="icono-menu">💳</span>
          <span class="texto-menu">Gastos</span>
        </RouterLink>
        <RouterLink to="/usuarios" class="item-menu" active-class="activo">
          <span class="icono-menu">👥</span>
          <span class="texto-menu">Usuarios</span>
        </RouterLink>
        <RouterLink to="/reportes" class="item-menu" active-class="activo">
          <span class="icono-menu">📊</span>
          <span class="texto-menu">Reportes</span>
        </RouterLink>
        <RouterLink to="/mantenimientos" class="item-menu" active-class="activo">
          <span class="icono-menu">🔧</span>
          <span class="texto-menu">Mantenimientos</span>
        </RouterLink>
      </template>

      <!-- VISTA CAJERO: Ventas, Pedidos Web -->
      <template v-if="esCajero">
        <RouterLink to="/ventas" class="item-menu" active-class="activo">
          <span class="icono-menu">🛒</span>
          <span class="texto-menu">Ventas POS</span>
        </RouterLink>
        <RouterLink to="/mis-ventas" class="item-menu" active-class="activo">
          <span class="icono-menu">🧾</span>
          <span class="texto-menu">VENTAS</span>
        </RouterLink>
        <RouterLink to="/ventas-web" class="item-menu" active-class="activo" style="position: relative;">
          <span class="icono-menu">🌐</span>
          <span class="texto-menu" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            Pedidos Web
            <span v-if="store.pedidosPendientes.length > 0" class="badge-sidebar-web">{{ store.pedidosPendientes.length }}</span>
          </span>
        </RouterLink>
      </template>

      <!-- VISTA DELIVERY -->
      <template v-if="esDelivery">
        <RouterLink to="/delivery" class="item-menu" active-class="activo">
          <span class="icono-menu">🛵</span>
          <span class="texto-menu">Delivery</span>
        </RouterLink>
        <RouterLink to="/reportes" class="item-menu" active-class="activo">
          <span class="icono-menu">📊</span>
          <span class="texto-menu">Registro</span>
        </RouterLink>
      </template>

      <!-- VISTA CLIENTE -->
      <template v-if="store.rolUsuario === 'cliente'">
        <RouterLink to="/cliente" class="item-menu" active-class="activo">
          <span class="icono-menu">👤</span>
          <span class="texto-menu">Mi Perfil</span>
        </RouterLink>
      </template>

      <!-- COMÚN: Configuración -->
      <RouterLink to="/configuracion" class="item-menu" active-class="activo">
        <span class="icono-menu">⚙️</span>
        <span class="texto-menu">Configuración</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useSistemaStore } from '../stores/sistema';

const store = useSistemaStore();
const router = useRouter();

// Roles reactivos desde el store
const esAdmin = computed(() => store.rolUsuario === 'admin');
const esCajero = computed(() => store.rolUsuario === 'cajero');
const esDelivery = computed(() => store.rolUsuario === 'delivery');

</script>

<style scoped>
.sidebar-dark { 
  width: 260px; 
  flex-shrink: 0;
  background-color: #1a2235; 
  color: #8a98ac; 
  display: flex; 
  flex-direction: column; 
  z-index: 100; 
  height: 100vh; 
  position: sticky; 
  top: 0; 
  box-shadow: 4px 0 15px rgba(0,0,0,0.1);
}

.logo-container { 
  display: flex; 
  align-items: center; 
  padding: 30px 20px; 
  gap: 12px; 
  margin-bottom: 20px; 
}
.icono-gota-bg { 
  background: linear-gradient(135deg, #3b82f6, #2563eb); 
  width: 38px; 
  height: 38px; 
  border-radius: 10px; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  box-shadow: 0 4px 10px rgba(33, 150, 243, 0.4); 
}
.icono-gota { font-size: 20px; color: white; }
.logo-container h1 { 
  font-size: 18px; 
  font-weight: 800; 
  color: white; 
  margin: 0; 
  letter-spacing: 1px; 
  font-family: 'Inter', sans-serif;
}

.menu-lateral { display: flex; flex-direction: column; gap: 5px; }

.item-menu { 
  display: flex; 
  align-items: center; 
  gap: 15px; 
  padding: 15px 25px; 
  color: #8a98ac; 
  text-decoration: none; 
  font-size: 14px; 
  font-weight: 500; 
  border-left: 4px solid transparent; 
  transition: all 0.2s ease; 
  cursor: pointer;
}

.item-menu:hover { 
  color: white; 
  background-color: rgba(255,255,255,0.05); 
  padding-left: 30px;
}

.item-menu.activo { 
  background: linear-gradient(to right, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05));
  color: white; 
  border-left: 4px solid #3b82f6; 
  font-weight: 700; 
}

.icono-menu { font-size: 18px; width: 24px; display: flex; justify-content: center; }

@media (max-width: 768px) {
  .sidebar-dark { width: 100%; height: auto; position: fixed; bottom: 0; top: auto; flex-direction: row; box-shadow: 0 -4px 15px rgba(0,0,0,0.1); }
  .logo-container { display: none; }
  .menu-lateral { flex-direction: row; justify-content: space-around; width: 100%; gap: 0; }
  .item-menu { flex-direction: column; gap: 5px; padding: 10px 5px; font-size: 10px; border-left: none; border-top: 3px solid transparent; }
  .item-menu.activo { border-left: none; border-top: 3px solid #3b82f6; }
  .texto-menu { display: none; }
}

.badge-sidebar-web { background: #ef4444; color: white; padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: bold; animation: pulseRed 2s infinite; }
@keyframes pulseRed { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); } 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
</style>