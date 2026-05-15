<!-- VISTA: Gestión de Inventario | Propósito: Control de stock físico (botellones) e insumos (agua). Permite registrar nuevas compras a proveedores. -->
<template>
  <div class="app-layout">
    <Sidebar />

    <main class="main-content">
      <header class="page-header header-admin-left fade-in">
        <div class="title-container-left">
          <h2 class="title-admin-left">{{ esAdmin ? 'Control de Inventario' : 'Consulta de Stock' }}</h2>
          <p class="subtitle-admin-left">{{ esAdmin ? 'Gestione el stock de botellones, filtros y consumibles.' : 'Consulta la disponibilidad y precios de los productos.' }}</p>
        </div>
        
        <div class="header-actions">
          <button v-if="esAdmin" class="btn-nuevo" @click="abrirModalCompra">
            + Registrar Compra
          </button>
          <button v-if="esAdmin" class="btn-nuevo btn-alt" @click="abrirModalNuevoProducto" style="background: #10b981;">
            + Nuevo Producto
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

      <!-- VISTA PARA AMBOS (Pero con acciones limitadas para cajero) -->
      <div class="vista-admin-dashboard fade-in">
        
        <!-- KPIs Premium de Inventario (SOLO ADMIN) -->
        <div v-if="esAdmin" class="premium-kpi-grid">
          <div class="premium-kpi-card card-blue">
            <div class="kpi-icon-wrapper"><span class="kpi-icon">📦</span></div>
            <div class="kpi-info">
              <span class="kpi-label">Productos en Venta</span>
              <h3 class="kpi-value">{{ totalProductosVenta }}</h3>
              <div class="kpi-trend neutral">
                <span class="trend-icon">→</span>
                <span>Catálogo activo</span>
              </div>
            </div>
          </div>
          
          <div class="premium-kpi-card card-orange">
            <div class="kpi-icon-wrapper"><span class="kpi-icon">⚠️</span></div>
            <div class="kpi-info">
              <span class="kpi-label">Stock Crítico</span>
              <h3 class="kpi-value">{{ stockCriticoCount }}</h3>
              <div class="kpi-trend negative" v-if="stockCriticoCount > 0">
                <span class="trend-icon">↓</span>
                <span>Reponer pronto</span>
              </div>
              <div class="kpi-trend positive" v-else>
                <span class="trend-icon">✓</span>
                <span>Todo al día</span>
              </div>
            </div>
          </div>

          <div class="premium-kpi-card card-green">
            <div class="kpi-icon-wrapper"><span class="kpi-icon">💧</span></div>
            <div class="kpi-info">
              <span class="kpi-label">Botellones Disponibles</span>
              <h3 class="kpi-value">{{ totalBotellonesDisponibles }}</h3>
              <div class="kpi-trend positive" v-if="totalBotellonesDisponibles > 0">
                <span class="trend-icon">↗</span>
                <span>Listo para despachar</span>
              </div>
              <div class="kpi-trend negative" v-else>
                <span class="trend-icon">!</span>
                <span>Sin existencias</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Alerta de Stock Bajo (SOLO ADMIN) -->
        <div class="alert-premium-box" v-if="esAdmin && hayStockBajo">
          <div class="alert-icon">💡</div>
          <div class="alert-content">
            <h4>Sugerencia de Reposición</h4>
            <p>Hay productos con stock por debajo del mínimo. Recomendamos revisar los pedidos.</p>
          </div>
        </div>

        <div class="premium-table-card">
          <div class="card-header-flex">
            <h3 class="card-title-premium">Lista de Productos</h3>
            <div class="search-box">
              <input type="text" v-model="busqueda" placeholder="Buscar por nombre, código o tipo..." />
            </div>
          </div>
          
          <div class="table-responsive">
            <table class="tabla-inventario">
              <thead>
                <tr>
                  <th>PRODUCTO</th>
                  <th>CATEGORÍA</th>
                  <th v-if="esAdmin">PRECIO COMPRA</th>
                  <th>PRECIO VENTA</th>
                  <th>BSS (Ref)</th>
                  <th>STOCK</th>
                  <th v-if="esAdmin">ESTADO</th>
                  <th v-if="esAdmin">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="prod in productosFiltrados" :key="prod.id" :class="{ 'fila-alerta': prod.stock <= prod.minimo }">
                  <td class="td-nombre">
                    <div class="info-prod-main">
                      <span class="nombre-prod">{{ prod.nombre }}</span>
                      <span class="id-prod">{{ prod.id }}</span>
                    </div>
                  </td>
                  <td><span class="badge-tipo">{{ prod.tipo }}</span></td>
                  <td v-if="esAdmin" class="precio-compra">${{ (prod.precioCompra || (prod.precio * 0.5)).toFixed(2) }}</td>
                  <td class="precio-venta">${{ (prod.precioVenta || prod.precio).toFixed(2) }}</td>
                  <td class="precio-bss">Bs. {{ ((prod.precioVenta || prod.precio) * store.tasaBCV).toFixed(2) }}</td>
                  <td>
                    <div class="stock-badge" :class="getStockClass(prod.stock, prod.minimo)">
                      {{ prod.stock }} {{ prod.unidad || 'U' }}
                    </div>
                  </td>
                  <td v-if="esAdmin">
                    <span class="status-indicator" :class="prod.stock > 0 ? 'activo' : 'inactivo'">
                      {{ prod.stock > 0 ? 'En Existencia' : 'Agotado' }}
                    </span>
                  </td>
                  <td v-if="esAdmin" class="acciones-col">
                    <button class="btn-icon" @click="editarProducto(prod)" title="Editar">✏️</button>
                    <button class="btn-icon" @click="eliminarProducto(prod.id)" title="Eliminar">🗑️</button>
                  </td>
                </tr>
                <tr v-if="productosFiltrados.length === 0">
                  <td :colspan="esAdmin ? 8 : 5" class="sin-resultados">No se encontraron productos para "{{ busqueda }}"</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- DIRECTORIO DE PROVEEDORES (SOLO ADMIN) -->
        <div v-if="esAdmin" class="premium-table-card" style="margin-top: 30px;">
          <div class="card-header-flex">
            <h3 class="card-title-premium">Directorio de Proveedores</h3>
          </div>
          <div class="table-responsive">
            <table class="tabla-inventario">
              <thead>
                <tr>
                  <th>RAZÓN SOCIAL / NOMBRE</th>
                  <th>CONTACTO</th>
                  <th>TELÉFONO</th>
                  <th>EMAIL</th>
                  <th>DIRECCIÓN</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="prov in proveedores" :key="prov.id">
                  <td class="nombre-prod">{{ prov.nombre }}</td>
                  <td>{{ prov.contacto || 'N/A' }}</td>
                  <td>{{ prov.telefono || 'N/A' }}</td>
                  <td><span class="badge-tipo" style="background: #eff6ff; color: #3b82f6; text-transform: lowercase;">{{ prov.email || 'N/A' }}</span></td>
                  <td style="max-width: 200px; font-size: 12px; color: #64748b; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ prov.direccion || 'N/A' }}</td>
                  <td class="acciones-col">
                    <button class="btn-icon" @click="editarProveedor(prov)" title="Editar">✏️</button>
                    <button class="btn-icon" @click="eliminarProveedor(prov.id)" title="Eliminar">🗑️</button>
                  </td>
                </tr>
                <tr v-if="proveedores.length === 0">
                  <td colspan="6" class="sin-resultados">No hay proveedores registrados</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- MODAL DE COMPRAS A PROVEEDORES PREMIUM -->
      <div v-if="mostrarModalCompra" class="modal-glassmorphism fade-in">
        <div class="modal-content-premium slide-down">
          <div class="modal-header-gradient">
            <div class="header-icon-circle">🚚</div>
            <h3>Registrar Ingreso de Inventario</h3>
            <button class="btn-close-premium" @click="mostrarModalCompra = false">✕</button>
          </div>
          
          <div class="modal-body-premium">
            <!-- Formulario Crear Proveedor (Toggle) -->
            <div v-if="creandoProveedor" class="form-proveedor-nuevo highlight-box">
              <h4 style="margin-top: 0; color: #1e293b; font-size: 14px; margin-bottom: 15px;">✨ Alta de Nuevo Proveedor</h4>
              
              <div class="form-group-premium">
                <label>Razón Social / Nombre <span class="req">*</span></label>
                <div class="input-modern-wrapper">
                  <span class="input-icon">🏢</span>
                  <input type="text" v-model="formProveedor.nombre" required placeholder="Ej. Distribuidora Agua Viva">
                </div>
              </div>
              
              <div class="form-row-premium">
                <div class="form-group-premium half">
                  <label>Contacto Asignado</label>
                  <div class="input-modern-wrapper">
                    <span class="input-icon">👤</span>
                    <input type="text" v-model="formProveedor.contacto" placeholder="Nombre de quien atiende">
                  </div>
                </div>
                <div class="form-group-premium half">
                  <label>Teléfono</label>
                  <div class="input-modern-wrapper">
                    <span class="input-icon">📱</span>
                    <input type="text" v-model="formProveedor.telefono" placeholder="Ej. 0414-1234567">
                  </div>
                </div>
              </div>

              <div class="form-row-premium">
                <div class="form-group-premium half">
                  <label>Email</label>
                  <div class="input-modern-wrapper">
                    <span class="input-icon">📧</span>
                    <input type="email" v-model="formProveedor.email" placeholder="email@proveedor.com">
                  </div>
                </div>
                <div class="form-group-premium half">
                  <label>Dirección Física</label>
                  <div class="input-modern-wrapper">
                    <span class="input-icon">📍</span>
                    <input type="text" v-model="formProveedor.direccion" placeholder="Calle, Edificio, Oficina...">
                  </div>
                </div>
              </div>
              
              <div class="modal-footer-premium" style="margin-top: 15px; padding-top: 15px;">
                <button type="button" class="btn-cancel-glass btn-mini-cancel" @click="creandoProveedor = false">Cancelar</button>
                <button type="button" class="btn-save-gradient btn-mini-save" @click="guardarProveedor">💾 Guardar Proveedor</button>
              </div>
            </div>

            <!-- Formulario Compra -->
            <form v-else @submit.prevent="guardarCompra">
              <div class="form-group-premium">
                <label>Proveedor <span class="req">*</span></label>
                <div class="select-with-btn">
                  <div class="input-modern-wrapper" style="flex: 1;">
                    <span class="input-icon">🚚</span>
                    <select v-model="formCompra.proveedor_id" required class="premium-select">
                      <option value="" disabled>Seleccione el proveedor logístico...</option>
                      <option v-for="prov in proveedores" :key="prov.id" :value="prov.id">{{ prov.nombre }}</option>
                    </select>
                  </div>
                  <button type="button" class="btn-add-prov-premium" @click="creandoProveedor = true" title="Registrar nuevo proveedor">+ Nuevo</button>
                </div>
              </div>

              <div class="form-group-premium">
                <label>Producto / Insumo <span class="req">*</span></label>
                <div class="input-modern-wrapper">
                  <span class="input-icon">📦</span>
                  <select v-model="formCompra.producto_id" required class="premium-select">
                    <option value="" disabled>¿Qué está ingresando al inventario?</option>
                    <option v-for="prod in listaProductos" :key="prod.id" :value="prod.id">{{ prod.nombre }} (Stock: {{ prod.stock }})</option>
                  </select>
                </div>
              </div>

              <div class="form-row-premium">
                <div class="form-group-premium half">
                  <label>Cantidad Adquirida <span class="req">*</span></label>
                  <div class="input-modern-wrapper">
                    <span class="input-icon">🔢</span>
                    <input type="number" v-model.number="formCompra.cantidad" min="1" required placeholder="0">
                  </div>
                </div>
                <div class="form-group-premium half">
                  <label>Costo Unitario ($) <span class="req">*</span></label>
                  <div class="input-modern-wrapper">
                    <span class="input-icon">💵</span>
                    <input type="number" v-model.number="formCompra.precio_unitario" step="0.01" min="0.01" required placeholder="0.00">
                  </div>
                </div>
              </div>

              <div class="total-compra-premium">
                <span class="lbl-tot">Inversión Total a Pagar:</span>
                <strong class="val-tot">${{ totalCalculado.toFixed(2) }}</strong>
              </div>

              <div class="modal-footer-premium">
                <button type="button" class="btn-cancel-glass" @click="mostrarModalCompra = false">Cancelar Operación</button>
                <button type="submit" class="btn-save-gradient" :disabled="guardandoCompra">
                  <span v-if="!guardandoCompra">Confirmar e Ingresar Stock</span>
                  <span v-else class="loading-spinner"></span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- MODAL CREAR/EDITAR PRODUCTO -->
      <div v-if="mostrarModalEdit" class="modal-glassmorphism fade-in">
        <div class="modal-content-premium slide-down" style="max-width: 450px;">
          <div class="modal-header-gradient">
            <div class="header-icon-circle">{{ modoEdicionProducto ? '✏️' : '✨' }}</div>
            <h3>{{ modoEdicionProducto ? 'Editar Producto' : 'Crear Nuevo Producto' }}</h3>
            <button class="btn-close-premium" @click="mostrarModalEdit = false">✕</button>
          </div>
          <div class="modal-body-premium">
            <form @submit.prevent="guardarProducto">
              <div class="form-group-premium" v-if="!modoEdicionProducto">
                <label>Código / ID Único <span class="req">*</span></label>
                <div class="input-modern-wrapper">
                  <input type="text" v-model="formEdit.id" required placeholder="Ej. B02">
                </div>
              </div>
              <div class="form-group-premium">
                <label>Nombre del Producto <span class="req">*</span></label>
                <div class="input-modern-wrapper">
                  <input type="text" v-model="formEdit.nombre" required>
                </div>
              </div>
              <div class="form-row-premium">
                <div class="form-group-premium half">
                  <label>Categoría/Tipo</label>
                  <div class="input-modern-wrapper">
                    <select v-model="formEdit.tipo" class="premium-select">
                      <option value="" disabled>Seleccione...</option>
                      <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
                    </select>
                  </div>
                </div>
                <div class="form-group-premium half">
                  <label>Precio Compra ($) <span class="req">*</span></label>
                  <div class="input-modern-wrapper">
                    <input type="number" v-model.number="formEdit.precioCompra" step="0.01" min="0" required>
                  </div>
                </div>
                <div class="form-group-premium half">
                  <label>Precio Venta ($) <span class="req">*</span></label>
                  <div class="input-modern-wrapper">
                    <input type="number" v-model.number="formEdit.precio" step="0.01" min="0" required>
                  </div>
                </div>
              </div>
              <div class="form-row-premium">
                <div class="form-group-premium half">
                  <label>Stock Mínimo</label>
                  <div class="input-modern-wrapper">
                    <input type="number" v-model.number="formEdit.minimo" min="0">
                  </div>
                </div>
                <div class="form-group-premium half">
                  <label>Stock Actual</label>
                  <div class="input-modern-wrapper">
                    <input type="number" v-model.number="formEdit.stock" min="0">
                  </div>
                </div>
              </div>
              <div class="form-group-premium" style="flex-direction: row; align-items: center; gap: 10px; margin-top: 10px;">
                <input type="checkbox" v-model="formEdit.paraVenta" :true-value="1" :false-value="0" id="chkParaVenta">
                <label for="chkParaVenta" style="margin-bottom: 0; cursor: pointer;">Disponible para la Venta (Aparece en Caja)</label>
              </div>
              <div class="modal-footer-premium">
                <button type="button" class="btn-cancel-glass" @click="mostrarModalEdit = false">Cancelar</button>
                <button type="submit" class="btn-save-gradient">{{ modoEdicionProducto ? 'Guardar Cambios' : 'Crear Producto' }}</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- MODAL EDITAR PROVEEDOR -->
      <div v-if="mostrarModalEditProv" class="modal-glassmorphism fade-in">
        <div class="modal-content-premium slide-down" style="max-width: 450px;">
          <div class="modal-header-gradient" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
            <div class="header-icon-circle">🏢</div>
            <h3>Editar Proveedor</h3>
            <button class="btn-close-premium" @click="mostrarModalEditProv = false">✕</button>
          </div>
          <div class="modal-body-premium">
            <form @submit.prevent="guardarEdicionProveedor">
              <div class="form-group-premium">
                <label>Razón Social / Nombre <span class="req">*</span></label>
                <div class="input-modern-wrapper">
                  <span class="input-icon">🏢</span>
                  <input type="text" v-model="formEditProv.nombre" required>
                </div>
              </div>
              <div class="form-row-premium">
                <div class="form-group-premium half">
                  <label>Contacto</label>
                  <div class="input-modern-wrapper">
                    <span class="input-icon">👤</span>
                    <input type="text" v-model="formEditProv.contacto">
                  </div>
                </div>
                <div class="form-group-premium half">
                  <label>Teléfono</label>
                  <div class="input-modern-wrapper">
                    <span class="input-icon">📱</span>
                    <input type="text" v-model="formEditProv.telefono">
                  </div>
                </div>
              </div>
              <div class="form-group-premium">
                <label>Email (Opcional)</label>
                <div class="input-modern-wrapper">
                  <span class="input-icon">📧</span>
                  <input type="email" v-model="formEditProv.email" placeholder="proveedor@email.com">
                </div>
              </div>
              <div class="form-group-premium">
                <label>Dirección (Opcional)</label>
                <div class="input-modern-wrapper">
                  <span class="input-icon">📍</span>
                  <input type="text" v-model="formEditProv.direccion" placeholder="Calle, Ciudad, Estado">
                </div>
              </div>
              <div class="modal-footer-premium">
                <button type="button" class="btn-cancel-glass" @click="mostrarModalEditProv = false">Cancelar</button>
                <button type="submit" class="btn-save-gradient" style="background: linear-gradient(135deg, #f59e0b, #d97706); box-shadow: 0 8px 15px rgba(245, 158, 11, 0.2);">Actualizar Proveedor</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
    </main>
  </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSistemaStore } from '../stores/sistema';
import { listaProductosInventario } from '../data/mockData';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const router = useRouter();
const store = useSistemaStore();

// --- LÓGICA DE ROLES ---
const esAdmin = computed(() => store.rolUsuario === 'admin');
const esCajero = computed(() => store.rolUsuario === 'cajero');

const nombreRol = computed(() => store.perfilUsuario?.nombre || (esAdmin.value ? 'Administrador' : 'Cajero'));
const emailUsuario = computed(() => store.perfilUsuario?.email || (esAdmin.value ? 'admin@wateriujo.com' : 'caja@wateriujo.com'));

// --- ESTADO INVENTARIO ---
const busqueda = ref('');
const listaProductos = ref([]);
const mostrarModalEdit = ref(false);
const modoEdicionProducto = ref(true);
const formEdit = ref({});
const categorias = ['Botellón', 'Servicio', 'Combo', 'Filtro', 'Insumo', 'Repuesto', 'Otro'];

// --- ESTADO COMPRAS / PROVEEDORES ---
const mostrarModalCompra = ref(false);
const creandoProveedor = ref(false);
const guardandoCompra = ref(false);
const proveedores = ref([]);
const mostrarModalEditProv = ref(false);
const formEditProv = ref({});

const formProveedor = ref({ nombre: '', contacto: '', telefono: '', email: '', direccion: '' });
const formCompra = ref({ proveedor_id: '', producto_id: '', cantidad: 1, precio_unitario: 0 });

const totalCalculado = computed(() => (formCompra.value.cantidad || 0) * (formCompra.value.precio_unitario || 0));

onMounted(async () => {
  if (!esAdmin.value && !esCajero.value) {
    router.push('/login');
    return;
  }
  await cargarInventario();
  if (esAdmin.value) {
    await cargarProveedores();
  }
});

const getAxiosConfig = () => ({ headers: { 'x-user-role': store.rolUsuario } });

const cargarInventario = async () => {
  await store.fetchInventario();
  listaProductos.value = store.inventario;
};

const eliminarProducto = async (id) => {
  if (!confirm('¿Estás seguro de eliminar este producto?')) return;
  try {
    const res = await axios.delete(`${API_URL}/inventario/${id}`, getAxiosConfig());
    if (res.data.success) {
      await cargarInventario();
    }
  } catch (error) {
    alert('Error al eliminar el producto');
  }
};

const abrirModalNuevoProducto = () => {
  modoEdicionProducto.value = false;
  formEdit.value = { id: '', nombre: '', tipo: '', precio: 0, precioCompra: 0, stock: 0, minimo: 0, paraVenta: 1 };
  mostrarModalEdit.value = true;
};

const editarProducto = (prod) => {
  modoEdicionProducto.value = true;
  formEdit.value = { ...prod, precio: prod.precio || prod.precioVenta || 0 };
  mostrarModalEdit.value = true;
};

const guardarProducto = async () => {
  try {
    // Validaciones básicas
    if (!formEdit.value.nombre) return alert('El nombre es obligatorio');
    if (!formEdit.value.id) return alert('El Código/ID es obligatorio');

    const config = getAxiosConfig();
    const payload = { ...formEdit.value };
    
    if (modoEdicionProducto.value) {
      const res = await axios.put(`${API_URL}/inventario/${formEdit.value.id}`, payload, config);
      if (res.data.success) {
        alert('✅ Producto actualizado correctamente');
        mostrarModalEdit.value = false;
        await cargarInventario();
      }
    } else {
      const res = await axios.post(`${API_URL}/inventario`, payload, config);
      if (res.data.success) {
        alert('✅ Producto registrado exitosamente');
        mostrarModalEdit.value = false;
        await cargarInventario();
      }
    }
  } catch (error) {
    console.error('Error al guardar producto:', error);
    alert(error.response?.data?.error || 'Error de conexión con el servidor');
  }
};

const cargarProveedores = async () => {
  try {
    const res = await axios.get(`${API_URL}/proveedores`, getAxiosConfig());
    proveedores.value = res.data;
  } catch (error) {
    console.error('Error cargando proveedores:', error);
  }
};

const editarProveedor = (prov) => {
  formEditProv.value = { ...prov };
  mostrarModalEditProv.value = true;
};

const guardarEdicionProveedor = async () => {
  try {
    const res = await axios.put(`${API_URL}/proveedores/${formEditProv.value.id}`, formEditProv.value, getAxiosConfig());
    if (res.data.success) {
      mostrarModalEditProv.value = false;
      await cargarProveedores();
    }
  } catch (error) {
    alert('Error al actualizar el proveedor');
  }
};

const eliminarProveedor = async (id) => {
  if (!confirm('¿Estás seguro de eliminar este proveedor?')) return;
  try {
    const res = await axios.delete(`${API_URL}/proveedores/${id}`, getAxiosConfig());
    if (res.data.success) {
      await cargarProveedores();
    }
  } catch (error) {
    alert(error.response?.data?.error || 'Error al eliminar el proveedor');
  }
};

const guardarProveedor = async () => {
  if (!formProveedor.value.nombre) return alert('El nombre es obligatorio');
  try {
    const config = { headers: { 'x-user-role': store.rolUsuario } };
    const res = await axios.post(`${API_URL}/proveedores`, formProveedor.value, config);
    if (res.data.success) {
      await cargarProveedores();
      formCompra.value.proveedor_id = res.data.id;
      creandoProveedor.value = false;
      formProveedor.value = { nombre: '', contacto: '', telefono: '', email: '', direccion: '' };
    }
  } catch (error) {
    alert('Error al crear proveedor');
  }
};

const guardarCompra = async () => {
  if (!formCompra.value.proveedor_id || !formCompra.value.producto_id || formCompra.value.cantidad <= 0 || formCompra.value.precio_unitario <= 0) {
    return alert('Complete todos los campos correctamente');
  }
  guardandoCompra.value = true;
  try {
    const config = { headers: { 'x-user-role': store.rolUsuario } };
    const res = await axios.post(`${API_URL}/compras/registrar`, formCompra.value, config);
    if (res.data.success) {
      alert('Compra registrada exitosamente. El stock ha sido actualizado.');
      mostrarModalCompra.value = false;
      
      // Actualizar el stock consultando nuevamente
      await cargarInventario();
      
      formCompra.value = { proveedor_id: '', producto_id: '', cantidad: 1, precio_unitario: 0 };
    }
  } catch (error) {
    alert(error.response?.data?.error || 'Error al registrar la compra');
  } finally {
    guardandoCompra.value = false;
  }
};

const hayStockBajo = computed(() => listaProductos.value.some(p => p.stock <= p.minimo));

const productosFiltrados = computed(() => {
  const t = busqueda.value.toLowerCase().trim();
  if (!t) return listaProductos.value;
  return listaProductos.value.filter(p => 
    (p.nombre && p.nombre.toLowerCase().includes(t)) || 
    (p.id && p.id.toLowerCase().includes(t)) || 
    (p.tipo && p.tipo.toLowerCase().includes(t))
  );
});

const totalProductosVenta = computed(() => listaProductos.value.filter(p => p.paraVenta === 1).length);
const stockCriticoCount = computed(() => listaProductos.value.filter(p => p.paraVenta === 1 && p.stock <= p.minimo).length);
const totalBotellonesDisponibles = computed(() => {
  return listaProductos.value
    .filter(p => p.paraVenta === 1 && (p.tipo.toLowerCase().includes('botellon') || p.tipo.toLowerCase().includes('botellón') || p.tipo.toLowerCase().includes('combo')))
    .reduce((sum, p) => sum + p.stock, 0);
});

const getStockClass = (actual, min) => {
  if (actual === 0) return 'stock-out';
  if (actual <= min) return 'stock-low';
  return 'stock-ok';
};

const abrirModalCompra = () => {
  mostrarModalCompra.value = true;
  creandoProveedor.value = false;
};
</script>

<style scoped>
/* [ESTILOS] Reglas CSS exclusivas de esta vista (scoped) para evitar colisiones globales. */

.main-content { 
  flex: 1; 
  display: flex; 
  flex-direction: column; 
  overflow-x: hidden; 
  padding: 20px 45px;
}

/* HEADER STYLE PREMIUM */
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 35px; }
.title-container-left h2 { font-size: 28px; color: #1e293b; font-weight: 800; margin: 0; letter-spacing: -0.5px; }
.subtitle-admin-left { color: #64748b; font-size: 14px; margin-top: 5px; font-weight: 500; }

.header-actions { display: flex; align-items: center; gap: 20px; }
.btn-nuevo { background: #3b82f6; color: white; border: none; padding: 12px 25px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2); }
.btn-nuevo:hover { transform: translateY(-2px); background: #2563eb; }

.perfil-usuario-top { display: flex; align-items: center; gap: 12px; background: white; padding: 10px 18px; border-radius: 18px; border: 1px solid #e2e8f0; cursor: pointer; transition: 0.2s; }
.perfil-usuario-top:hover { border-color: #3b82f6; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
.info-texto-top { display: flex; flex-direction: column; align-items: flex-end; }
.nombre-top { font-size: 14px; font-weight: 700; color: #1e293b; }
.email-top { font-size: 11px; color: #64748b; }
.avatar-top { width: 38px; height: 38px; background: #eff6ff; color: #3b82f6; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 18px; border: 1px solid #dbeafe; }

/* KPIs GRID */
.premium-kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; margin-bottom: 30px; }
.premium-kpi-card { background: white; padding: 25px; border-radius: 20px; display: flex; align-items: center; gap: 20px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
.kpi-icon-wrapper { width: 50px; height: 50px; border-radius: 14px; display: flex; justify-content: center; align-items: center; font-size: 22px; }
.card-blue .kpi-icon-wrapper { background: #eff6ff; color: #3b82f6; }
.card-orange .kpi-icon-wrapper { background: #fff7ed; color: #f59e0b; }
.card-green .kpi-icon-wrapper { background: #f0fdf4; color: #10b981; }

.kpi-info { display: flex; flex-direction: column; }
.kpi-label { font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px; }
.kpi-value { font-size: 24px; font-weight: 800; color: #1e293b; margin: 0; }
.kpi-trend { font-size: 12px; font-weight: 600; margin-top: 4px; }
.kpi-trend.positive { color: #10b981; }
.kpi-trend.negative { color: #f43f5e; }
.kpi-trend.neutral { color: #64748b; }

/* ALERT BOX */
.alert-premium-box { background: #fefce8; border: 1px solid #fef08a; padding: 15px 20px; border-radius: 16px; display: flex; align-items: center; gap: 15px; margin-bottom: 30px; }
.alert-icon { font-size: 24px; }
.alert-content h4 { margin: 0; font-size: 14px; font-weight: 800; color: #854d0e; }
.alert-content p { margin: 2px 0 0; font-size: 13px; color: #a16207; }

/* TABLE CARD */
.premium-table-card { background: white; border-radius: 20px; padding: 25px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
.card-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
.card-title-premium { font-size: 18px; font-weight: 800; color: #1e293b; margin: 0; }

.search-box input { background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px 18px; border-radius: 10px; width: 280px; outline: none; transition: 0.2s; font-size: 14px; }
.search-box input:focus { border-color: #3b82f6; background: white; }

.tabla-inventario { width: 100%; border-collapse: collapse; }
.tabla-inventario th { text-align: left; padding: 15px 12px; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; border-bottom: 1px solid #f1f5f9; }
.tabla-inventario td { padding: 18px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }

.nombre-prod { display: block; font-weight: 700; color: #1e293b; }
.id-prod { font-size: 11px; color: #94a3b8; font-weight: 600; }
.badge-tipo { background: #f1f5f9; color: #475569; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
.precio-compra { color: #94a3b8; font-style: italic; }
.precio-venta { font-weight: 800; color: #1e293b; }
.precio-bss { color: #64748b; font-size: 12px; font-weight: 600; }

.stock-badge { display: inline-block; padding: 4px 12px; border-radius: 8px; font-weight: 800; font-size: 13px; }
.stock-ok { background: #dcfce7; color: #166534; }
.stock-low { background: #fef9c3; color: #854d0e; }
.stock-out { background: #fee2e2; color: #991b1b; }

.status-indicator { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; }
.status-indicator::before { content: ""; width: 8px; height: 8px; border-radius: 50%; }
.status-indicator.activo { color: #10b981; }
.status-indicator.activo::before { background: #10b981; box-shadow: 0 0 8px #10b981; }
.status-indicator.inactivo { color: #94a3b8; }
.status-indicator.inactivo::before { background: #94a3b8; }

.btn-icon { background: transparent; border: none; font-size: 16px; cursor: pointer; margin-right: 10px; transition: 0.2s; }
.btn-icon:hover { transform: scale(1.2); }

.sin-resultados { text-align: center; color: #94a3b8; padding: 40px !important; font-weight: 600; }

@media (max-width: 768px) {
  .main-content { padding: 20px; }
  .page-header { flex-direction: column; align-items: flex-start; gap: 20px; }
  .header-actions { width: 100%; justify-content: space-between; }
  .search-box input { width: 100%; }
}

/* --- MODAL PREMIUM (COMPRAS Y PROVEEDORES) --- */
.modal-glassmorphism { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-content-premium { background: white; width: 100%; max-width: 600px; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }

.modal-header-gradient { background: linear-gradient(135deg, #1e293b, #0f172a); padding: 25px 30px; display: flex; align-items: center; gap: 15px; position: relative; }
.header-icon-circle { width: 45px; height: 45px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 22px; }
.modal-header-gradient h3 { margin: 0; color: white; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; }
.btn-close-premium { position: absolute; right: 25px; top: 35px; background: rgba(255,255,255,0.1); border: none; width: 30px; height: 30px; border-radius: 50%; color: white; display: flex; justify-content: center; align-items: center; cursor: pointer; transition: 0.3s; }
.btn-close-premium:hover { background: rgba(255,255,255,0.25); transform: rotate(90deg); }

.modal-body-premium { padding: 30px; }
.form-row-premium { display: flex; gap: 20px; }
.form-group-premium { margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px; }
.form-group-premium.half { flex: 1; }
.form-group-premium label { font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }
.req { color: #ef4444; }

.input-modern-wrapper { display: flex; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; transition: 0.3s; }
.input-modern-wrapper:focus-within { border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); background: white; }
.input-icon { padding: 12px 0 12px 15px; color: #94a3b8; font-size: 16px; }
.input-modern-wrapper input, .input-modern-wrapper select { border: none; background: transparent; padding: 12px 15px; flex: 1; outline: none; font-size: 14px; color: #1e293b; font-weight: 500; width: 100%; cursor: pointer; }

.select-with-btn { display: flex; gap: 10px; align-items: stretch; }
.btn-add-prov-premium { background: #e0e7ff; color: #4f46e5; border: 1px solid #c7d2fe; padding: 0 15px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.3s; white-space: nowrap; display: flex; align-items: center; }
.btn-add-prov-premium:hover { background: #c7d2fe; }

.highlight-box { background: rgba(241, 245, 249, 0.8); border: 1px dashed #cbd5e1; padding: 20px; border-radius: 16px; margin-bottom: 25px; }

.total-compra-premium { display: flex; justify-content: space-between; align-items: center; background: #f0fdf4; padding: 20px; border-radius: 16px; border: 1px solid #bbf7d0; margin-top: 10px; }
.lbl-tot { color: #166534; font-weight: 700; font-size: 14px; text-transform: uppercase; }
.val-tot { color: #15803d; font-size: 28px; font-weight: 900; }

.modal-footer-premium { display: flex; justify-content: flex-end; gap: 15px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #f1f5f9; }
.btn-cancel-glass { background: #f1f5f9; color: #475569; border: none; padding: 12px 25px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.3s; }
.btn-cancel-glass:hover { background: #e2e8f0; }

.btn-save-gradient { background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; padding: 12px 30px; border-radius: 12px; font-weight: 700; cursor: pointer; box-shadow: 0 8px 15px rgba(16, 185, 129, 0.2); transition: 0.3s; min-width: 150px; display: flex; justify-content: center; align-items: center; }
.btn-save-gradient:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 20px rgba(16, 185, 129, 0.3); }
.btn-save-gradient:disabled { opacity: 0.7; cursor: not-allowed; }

.btn-mini-cancel { padding: 8px 15px; font-size: 12px; }
.btn-mini-save { padding: 8px 15px; font-size: 12px; min-width: auto; }

.loading-spinner { width: 18px; height: 18px; border: 3px solid rgba(255,255,255,0.3); border-top: 3px solid white; border-radius: 50%; animation: spin 1s linear infinite; }

/* ANIMACIONES */
.fade-in { animation: fadeIn 0.4s ease forwards; }
.slide-down { animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideDown { from { opacity: 0; transform: translateY(-20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .form-row-premium { flex-direction: column; gap: 0; }
  .modal-content-premium { width: 95%; }
  .select-with-btn { flex-direction: column; }
}
</style>