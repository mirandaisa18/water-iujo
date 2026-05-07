<!-- VISTA: Configuración del Sistema | Propósito: Ajustes globales de negocio (precios, costos de delivery, umbrales de alerta de inventario). -->
<template>
  <div class="app-layout">
    
    <Sidebar />

    <main class="main-content">
      
      <header class="page-header header-admin-left">
        <div class="title-container-left">
          <h2 class="title-admin-left">{{ esAdmin ? 'Configuración del Sistema' : 'Mis Ajustes de Cuenta' }}</h2>
          <p class="subtitle-admin-left">{{ esAdmin ? 'Ajustes generales, preferencias y seguridad de WATER IUJO.' : 'Gestiona tu perfil, seguridad y sesión de usuario.' }}</p>
        </div>
        
        <div class="header-actions">
          <div class="perfil-usuario-top" @click="router.push('/configuracion')">
            <div class="info-texto-top">
              <span class="nombre-top">{{ nombreRol }}</span>
              <span class="email-top">{{ emailUsuario }}</span>
            </div>
            <div class="avatar-top">⚙️</div>
          </div>
        </div>
      </header>

      <!-- VISTA ADMINISTRADOR -->
      <div v-if="esAdmin" class="vista-admin-dashboard">
        <div class="grid-configuracion">
          <div class="columna-ajustes">
            <!-- Perfil del Negocio -->
            <div class="premium-table-card">
              <div class="tarjeta-header">
                <div class="header-con-icono">
                  <span class="icono-seccion azul">🏢</span>
                  <h3>Perfil del Negocio</h3>
                </div>
              </div>
              <div class="form-grid">
                <div class="input-group">
                  <label>Nombre de la Empresa</label>
                  <input type="text" v-model="store.configuracionNegocio.nombre" />
                </div>
                <div class="input-group">
                  <label>RIF / Documento Fiscal</label>
                  <input type="text" v-model="store.configuracionNegocio.rif" />
                </div>
                <div class="input-group full-width">
                  <label>Dirección Principal</label>
                  <input type="text" v-model="store.configuracionNegocio.direccion" />
                </div>
                <div class="input-group">
                  <label>Teléfono de Contacto</label>
                  <input type="text" v-model="store.configuracionNegocio.telefono" />
                </div>
                <div class="input-group">
                  <label>Moneda Principal</label>
                  <select v-model="store.configuracionNegocio.moneda">
                    <option value="USD">Dólar (USD - $)</option>
                    <option value="VES">Bolívar (VES - Bs)</option>
                  </select>
                </div>
              </div>
              <div class="form-actions-right">
                <button class="btn-guardar" @click="guardarCambios">Guardar Cambios</button>
              </div>
            </div>

            <!-- Preferencias POS -->
            <div class="premium-table-card">
              <div class="tarjeta-header">
                <div class="header-con-icono">
                  <span class="icono-seccion verde">🛒</span>
                  <h3>Preferencias de Punto de Venta</h3>
                </div>
              </div>
              <div class="lista-opciones">
                <div class="opcion-toggle">
                  <div class="opcion-texto">
                    <strong>Impresión Automática</strong>
                    <p>Imprimir ticket al procesar un pago en caja.</p>
                  </div>
                  <label class="switch"><input type="checkbox" v-model="store.preferenciasPOS.impresionAutomatica"><span class="slider round"></span></label>
                </div>
                <div class="opcion-toggle">
                  <div class="opcion-texto">
                    <strong>Aplicar Impuesto (IVA)</strong>
                    <p>Sumar automáticamente el 16% a las ventas facturadas.</p>
                  </div>
                  <label class="switch"><input type="checkbox" v-model="store.preferenciasPOS.aplicarIVA"><span class="slider round"></span></label>
                </div>
                <div class="opcion-toggle">
                  <div class="opcion-texto">
                    <strong>Alerta de Stock Bajo</strong>
                    <p>Avisar a los cajeros si un producto está por agotarse.</p>
                  </div>
                  <label class="switch"><input type="checkbox" v-model="store.preferenciasPOS.alertaStockBajo"><span class="slider round"></span></label>
                </div>
              </div>
              <div class="form-actions-right">
                <button class="btn-guardar" @click="guardarCambios">Guardar Cambios</button>
              </div>
            </div>

            <!-- Cierre de Sesión Admin -->
            <div class="premium-table-card">
              <div class="tarjeta-header">
                <div class="header-con-icono">
                  <span class="icono-seccion rojo">🚪</span>
                  <h3>Cerrar Sesión</h3>
                </div>
              </div>
              <p class="subtitle-admin-left">Finalizar tu sesión administrativa de forma segura.</p>
              <div class="form-actions-right" style="justify-content: stretch;">
                <button class="btn-peligro" style="width: 100%;" @click="cerrarSesion">Cerrar Sesión (Admin)</button>
              </div>
            </div>
          </div>

          <div class="columna-ajustes">
            <!-- Seguridad Admin -->
            <div class="premium-table-card">
              <div class="tarjeta-header">
                <div class="header-con-icono">
                  <span class="icono-seccion naranja">🔒</span>
                  <h3>Seguridad de la Cuenta</h3>
                </div>
              </div>
              <div class="form-grid">
                <div class="input-group full-width">
                  <label>Nombre de Usuario</label>
                  <input type="text" v-model="store.perfilUsuario.nombre" />
                </div>
                <div class="input-group full-width">
                  <label>Correo Electrónico (Admin)</label>
                  <input type="email" v-model="store.perfilUsuario.email" disabled class="input-disabled" />
                </div>
                <div class="input-group full-width">
                  <label>Contraseña Actual</label>
                  <input type="password" v-model="passwords.actual" placeholder="••••••••" />
                </div>
                <div class="input-group">
                  <label>Nueva Contraseña</label>
                  <input type="password" v-model="passwords.nueva" placeholder="Mínimo 8 caracteres" />
                </div>
                <div class="input-group">
                  <label>Confirmar Nueva Contraseña</label>
                  <input type="password" v-model="passwords.confirmacion" placeholder="••••••••" />
                </div>
              </div>
              <div class="form-actions-right">
                <button class="btn-guardar" @click="guardarCambios">Guardar Cambios</button>
              </div>
            </div>

            <!-- Sistema y Zona Peligrosa -->
            <div class="premium-table-card danger-card">
              <div class="tarjeta-header">
                <div class="header-con-icono">
                  <span class="icono-seccion morado">💾</span>
                  <h3>Sistema y Respaldos</h3>
                </div>
              </div>
              <div class="info-sistema">
                <div class="dato-sistema"><span>Versión del Sistema:</span><strong>v2.1.0 Stable</strong></div>
                <div class="dato-sistema"><span>Último Respaldo:</span><strong>Hoy, 06:00 AM</strong></div>
              </div>
              <div class="peligro-acciones">
                <button class="btn-respaldo" @click="descargarRespaldo">📥 Descargar Respaldo Total</button>
                <div class="separator-dash"></div>
                <div class="header-con-icono" style="margin-bottom: 15px;">
                  <span class="icono-seccion rojo">⚠️</span>
                  <h3 style="color:#ef4444">Zona Peligrosa</h3>
                </div>
                <button class="btn-peligro" @click="formatearSistema">☢️ Formatear Sistema (Dejar como Nuevo)</button>
                <button class="btn-peligro" @click="reiniciarCatalogo">Reiniciar Catálogo de Productos</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- VISTA CAJERO / DELIVERY -->
      <div v-if="esCajero || esDelivery" class="vista-admin-dashboard">
        <div class="grid-configuracion">
          <div class="columna-ajustes">
            <!-- Perfil del Usuario -->
            <div class="premium-table-card">
              <div class="tarjeta-header">
                <div class="header-con-icono">
                  <span class="icono-seccion azul">👤</span>
                  <h3>Mi Perfil de Usuario</h3>
                </div>
              </div>
              <div class="form-grid">
                <div class="input-group full-width">
                  <label>Nombre Completo</label>
                  <input type="text" v-model="store.perfilUsuario.nombre" />
                </div>
                <div class="input-group full-width">
                  <label>Correo Electrónico</label>
                  <input type="email" v-model="store.perfilUsuario.email" />
                </div>
                <div class="input-group">
                  <label>Estación / Rol</label>
                  <input type="text" v-model="store.perfilUsuario.estacion" disabled class="input-disabled" />
                </div>
                <div class="input-group">
                  <label>Estatus</label>
                  <input type="text" v-model="store.perfilUsuario.horario" disabled class="input-disabled" />
                </div>
              </div>
              <div class="form-actions-right">
                <button class="btn-guardar" @click="guardarCambios">Guardar Cambios</button>
              </div>
            </div>

          </div>

          <div class="columna-ajustes">
            <!-- Seguridad Usuario -->
            <div class="premium-table-card">
              <div class="tarjeta-header">
                <div class="header-con-icono">
                  <span class="icono-seccion naranja">🔒</span>
                  <h3>Seguridad y Contraseña</h3>
                </div>
              </div>
              <div class="form-grid">
                <div class="input-group full-width">
                  <label>Contraseña Actual</label>
                  <input type="password" v-model="passwords.actual" placeholder="••••••••" />
                </div>
                <div class="input-group">
                  <label>Nueva Contraseña</label>
                  <input type="password" v-model="passwords.nueva" placeholder="Mínimo 8 caracteres" />
                </div>
                <div class="input-group">
                  <label>Confirmar Nueva Contraseña</label>
                  <input type="password" v-model="passwords.confirmacion" placeholder="••••••••" />
                </div>
              </div>
              <div class="form-actions-right">
                <button class="btn-guardar" @click="guardarCambios">Actualizar Contraseña</button>
              </div>
            </div>

            <!-- Sesión -->
            <div class="premium-table-card">
              <div class="tarjeta-header">
                <div class="header-con-icono">
                  <span class="icono-seccion rojo">🚪</span>
                  <h3>Gestión de Sesión</h3>
                </div>
              </div>
              <p class="subtitle-admin-left">Asegúrate de haber guardado todo antes de salir.</p>
              <div class="form-actions-right" style="justify-content: stretch;">
                <button class="btn-peligro" style="width: 100%;" @click="cerrarSesion">Cerrar Sesión Segura</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
// [LÓGICA DEL COMPONENTE] Inicialización de estado reactivo, store global y manejo de eventos de la vista.

import Sidebar from '../components/Sidebar.vue';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSistemaStore } from '../stores/sistema';

const router = useRouter();
const store = useSistemaStore();

// --- LÓGICA DE ROLES Y SEGURIDAD ---
const esAdmin = computed(() => store.rolUsuario === 'admin');
const esCajero = computed(() => store.rolUsuario === 'cajero');
const esDelivery = computed(() => store.rolUsuario === 'delivery');

onMounted(() => {
  if (!esAdmin.value && !esCajero.value && !esDelivery.value) {
    router.push('/login');
  }
});

const nombreRol = computed(() => {
  return store.perfilUsuario?.nombre || 'Usuario';
});

const emailUsuario = computed(() => {
  return store.perfilUsuario?.email || '';
});

// --- ACCIONES COMUNES ---
const passwords = ref({ actual: '', nueva: '', confirmacion: '' });

const guardarCambios = () => {
  // 1. Validar Contraseña si se intentó cambiar
  if (passwords.value.nueva || passwords.value.actual || passwords.value.confirmacion) {
    if (passwords.value.nueva.length < 8) {
      alert('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (passwords.value.nueva !== passwords.value.confirmacion) {
      alert('Las contraseñas nuevas no coinciden.');
      return;
    }
    if (!passwords.value.actual) {
      alert('Debe ingresar la contraseña actual para realizar cambios de seguridad.');
      return;
    }
  }

  // 2. Persistir en el Store
  store.actualizarPerfil(store.perfilUsuario);
  if (esAdmin.value) {
    store.actualizarNegocio(store.configuracionNegocio);
    store.actualizarPreferencias(store.preferenciasPOS);
  }

  // Limpiar passwords
  passwords.value = { actual: '', nueva: '', confirmacion: '' };

  alert('¡Configuración actualizada y guardada exitosamente!');
};

const descargarRespaldo = () => {
  const url = `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/system/backup?token=${localStorage.getItem('token') || ''}`;
  window.open(url, '_blank');
};

const cerrarSesion = () => {
  if (confirm('¿Deseas cerrar tu sesión?')) {
    store.cerrarSesion();
    router.push('/login');
  }
};

const formatearSistema = async () => {
  const code = prompt('⚠️ ADVERTENCIA CRÍTICA: Estás a punto de borrar absolutamente TODO el historial de ingresos, ventas, entregas y tickets. El sistema quedará en blanco. \n\nEscribe "BORRAR" para confirmar:');
  if (code === 'BORRAR') {
    await store.resetearBaseDeDatos();
    alert('✅ Sistema reseteado exitosamente. Recargando aplicación...');
    window.location.reload();
  } else if (code !== null) {
    alert('Operación cancelada. Código incorrecto.');
  }
};

const reiniciarCatalogo = async () => {
  const code = prompt('⚠️ ADVERTENCIA: Estás a punto de borrar todos los productos del inventario. \n\nEscribe "PRODUCTOS" para confirmar:');
  if (code === 'PRODUCTOS') {
    await store.reiniciarCatalogoDB();
    alert('✅ Catálogo reiniciado exitosamente.');
    window.location.reload();
  } else if (code !== null) {
    alert('Operación cancelada. Código incorrecto.');
  }
};
</script>

<style scoped>
/* [ESTILOS] Reglas CSS exclusivas de esta vista (scoped) para evitar colisiones globales. */

/* --- Estilo Base Content --- */
.main-content {
  flex: 1;
  min-width: 0;
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

/* Estilos Premium Layout */
.vista-admin-dashboard { display: flex; flex-direction: column; gap: 30px; }
.grid-configuracion { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
.columna-ajustes { display: flex; flex-direction: column; gap: 30px; }

.premium-table-card { background: white; padding: 30px; border-radius: 20px; border: 1px solid rgba(226, 232, 240, 0.8); box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05); transition: transform 0.3s ease; }
.premium-table-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px -5px rgba(0, 0, 0, 0.08); }

.tarjeta-header { margin-bottom: 25px; }
.header-con-icono { display: flex; align-items: center; gap: 15px; }
.icono-seccion { width: 44px; height: 44px; border-radius: 12px; display: flex; justify-content: center; align-items: center; font-size: 20px; }
.icono-seccion.azul { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
.icono-seccion.verde { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.icono-seccion.naranja { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
.icono-seccion.rojo { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
.icono-seccion.morado { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }

.tarjeta-header h3 { font-size: 18px; font-weight: 800; color: #0f172a; margin: 0; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.full-width { grid-column: 1 / -1; }

.input-group { display: flex; flex-direction: column; gap: 8px; }
.input-group label { font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }
.input-group input, .input-group select { padding: 12px 15px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 14px; outline: none; background: #f8fafc; font-weight: 600; color: #1e293b; transition: 0.2s; }
.input-group input:focus, .input-group select:focus { border-color: #3b82f6; background: white; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
.input-disabled { background-color: #f1f5f9 !important; color: #94a3b8 !important; cursor: not-allowed; }

.form-actions-right { display: flex; justify-content: flex-end; margin-top: 25px; }
.btn-guardar { background: #3b82f6; color: white; border: none; padding: 12px 30px; border-radius: 10px; font-weight: 700; cursor: pointer; font-size: 14px; transition: 0.2s; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2); }
.btn-guardar:hover { background: #2563eb; transform: translateY(-1px); }

/* TOGGLES */
.lista-opciones { display: flex; flex-direction: column; gap: 10px; }
.opcion-toggle { display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; }
.opcion-texto strong { display: block; font-size: 14px; color: #1e293b; margin-bottom: 2px; }
.opcion-texto p { font-size: 12px; color: #64748b; margin: 0; }

.switch { position: relative; display: inline-block; width: 44px; height: 24px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; transition: .4s; border-radius: 34px; }
.slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
input:checked + .slider { background-color: #3b82f6; }
input:checked + .slider:before { transform: translateX(20px); }

.danger-card { border-top: 4px solid #ef4444; }
.separator-dash { height: 1px; border-top: 1px dashed #e2e8f0; margin: 25px 0; }
.info-sistema { display: flex; flex-direction: column; gap: 15px; margin-bottom: 25px; }
.dato-sistema { display: flex; justify-content: space-between; font-size: 13px; color: #64748b; font-weight: 500; }
.dato-sistema strong { color: #1e293b; font-weight: 800; }

.peligro-acciones { display: flex; flex-direction: column; gap: 12px; }
.btn-respaldo { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 12px; border-radius: 10px; font-weight: 700; cursor: pointer; transition: 0.2s; text-align: center; }
.btn-respaldo:hover { background: #e2e8f0; }
.btn-peligro { background: #fee2e2; color: #ef4444; border: 1px solid #fecaca; padding: 12px 20px; border-radius: 10px; font-weight: 700; cursor: pointer; transition: 0.2s; text-align: center; }
.btn-peligro:hover { background: #ef4444; color: white; }

/* Animaciones removidas */

/* RESPONSIVE */
@media (max-width: 1024px) { .grid-configuracion { grid-template-columns: 1fr; } }
@media (max-width: 768px) {
  .app-layout { flex-direction: column; }
  .main-content { padding: 20px; }
  .page-header { flex-direction: column; align-items: flex-start; gap: 20px; }
  .perfil-usuario-top { width: 100%; justify-content: space-between; }
  .premium-table-card { padding: 20px; }
  .form-grid { grid-template-columns: 1fr; }
}
</style>
