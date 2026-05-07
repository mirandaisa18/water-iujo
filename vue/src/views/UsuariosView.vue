<!-- VISTA: Gestión de Personal | Propósito: ABM (Alta, Baja, Modificación) de empleados y asignación de roles (Administrador, Despachador/Cajero). -->
<template>
  <div class="app-layout">
    
    <Sidebar />

    <main class="main-content">
      
      <header class="page-header header-admin-left">
        <div class="title-container-left">
          <h2 class="title-admin-left">{{ esAdmin ? 'Gestión de Usuarios' : 'Directorio de Clientes' }}</h2>
          <p class="subtitle-admin-left">{{ esAdmin ? 'Administra los accesos y roles del sistema.' : 'Registra y busca clientes para la facturación.' }}</p>
        </div>
        
        <div class="header-actions">
          <button class="btn-nuevo" @click="mostrarFormulario = !mostrarFormulario">
            {{ mostrarFormulario ? '✖ Cancelar' : (esAdmin ? '+ Nuevo Usuario' : '+ Nuevo Cliente') }}
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

      <div v-if="esAdmin" class="vista-admin-dashboard">
        
        <!-- KPIs Premium de Usuarios -->
        <div class="premium-kpi-grid">
          <div class="premium-kpi-card card-blue">
            <div class="kpi-icon-wrapper"><span class="kpi-icon">👥</span></div>
            <div class="kpi-info">
              <span class="kpi-label">Plantilla Total</span>
              <h3 class="kpi-value">{{ kpiTotal }}</h3>
              <div class="kpi-trend neutral"><span>Activos en el sistema</span></div>
            </div>
          </div>
          
          <div class="premium-kpi-card card-purple">
            <div class="kpi-icon-wrapper"><span class="kpi-icon">🛡️</span></div>
            <div class="kpi-info">
              <span class="kpi-label">Administradores</span>
              <h3 class="kpi-value">{{ kpiAdmins }}</h3>
              <div class="kpi-trend positive"><span>Control total</span></div>
            </div>
          </div>

          <div class="premium-kpi-card card-orange">
            <div class="kpi-icon-wrapper"><span class="kpi-icon">🏬</span></div>
            <div class="kpi-info">
              <span class="kpi-label">Cajeros</span>
              <h3 class="kpi-value">{{ kpiCajeros }}</h3>
              <div class="kpi-trend neutral"><span>Staff operativo</span></div>
            </div>
          </div>
          
          <div class="premium-kpi-card" style="border-left: 6px solid #f43f5e; box-shadow: 0 10px 30px -5px rgba(0,0,0,0.05);">
            <div class="kpi-icon-wrapper" style="background: rgba(244, 63, 94, 0.1); color: #f43f5e;"><span class="kpi-icon">🛵</span></div>
            <div class="kpi-info">
              <span class="kpi-label">Delivery</span>
              <h3 class="kpi-value">{{ kpiDelivery }}</h3>
              <div class="kpi-trend neutral" style="color:#f43f5e;"><span>Repartidores</span></div>
            </div>
          </div>

          <div class="premium-kpi-card card-green">
            <div class="kpi-icon-wrapper"><span class="kpi-icon">👤</span></div>
            <div class="kpi-info">
              <span class="kpi-label">Clientes</span>
              <h3 class="kpi-value">{{ kpiClientes }}</h3>
              <div class="kpi-trend positive"><span>Cartera asignada</span></div>
            </div>
          </div>
        </div>

        <div v-if="mostrarFormulario" class="tarjeta-formulario">
          <h3>{{ esEdicion ? 'Editar Usuario/Cliente' : 'Registrar Nuevo Perfil' }}</h3>
          <p>Completa los datos correspondientes en el sistema.</p>
          <form @submit.prevent="guardarDataUsuario" class="form-grid">
            <div class="input-group">
              <label>Nombre Completo</label>
              <input type="text" v-model="formUser.nombre" placeholder="Ej. Carlos Mendoza" required />
            </div>
            <div class="input-group">
              <label>Correo Electrónico (Login)</label>
              <input type="email" v-model="formUser.email" placeholder="ejemplo@wateriujo.com" required />
            </div>
            <div class="input-group">
              <label>Contraseña Acceso</label>
              <input type="password" v-model="formUser.password" placeholder="••••••" required />
            </div>
            <div class="input-group">
              <label>Cédula / Documento</label>
              <input type="text" v-model="formUser.cedula" placeholder="Ej. V-12345678" required />
            </div>
            <div class="input-group">
              <label>Teléfono</label>
              <input type="text" v-model="formUser.telefono" placeholder="Ej. 0414-0000000" required />
            </div>
            <div class="input-group">
              <label>Dirección</label>
              <input type="text" v-model="formUser.direccion" placeholder="Ej. Av. Principal..." required />
            </div>
            <div class="input-group">
              <label>Rol en el Sistema</label>
              <select v-model="formUser.rol" required>
                <option value="" disabled selected>Seleccione un rol...</option>
                <option value="admin">Administrador (Acceso Total)</option>
                <option value="cajero">Cajero (Solo Ventas)</option>
                <option value="delivery">Delivery (Repartidor Motorizado)</option>
                <option value="cliente">Cliente Frecuente (Cartera)</option>
              </select>
            </div>
            <div class="input-group">
              <label>Estatus</label>
              <select v-model="formUser.status" required>
                <option value="Activo">Activo (Habilitado)</option>
                <option value="Inactivo">Inactivo (Deshabilitado)</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-guardar">{{ esEdicion ? 'Actualizar Perfil' : 'Guardar Perfil' }}</button>
            </div>
          </form>
        </div>

        <div class="premium-table-card">
          <div class="card-header-flex">
            <h3 class="card-title-premium">Directorio del Sistema</h3>
            <div class="search-box">
              <input type="text" v-model="busquedaAdmin" placeholder="Buscar usuario, correo o rol..." />
            </div>
          </div>
          
          <div class="table-responsive">
            <table class="tabla-usuarios">
              <thead>
                <tr>
                  <th>USUARIO</th>
                  <th>CORREO ELECTRÓNICO</th>
                  <th>ROL</th>
                  <th>FECHA REGISTRO</th>
                  <th>ESTATUS</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in usuariosFiltrados" :key="user.id" :class="{'fila-inactiva': user.status === 'Inactivo'}">
                  <td class="td-usuario">
                    <div class="mini-avatar" :class="colorBgBadge(user.rol)">{{ user.nombre.charAt(0).toUpperCase() }}</div>
                    <span class="negrita">{{ user.nombre }}</span>
                  </td>
                  <td>{{ user.email }}</td>
                  <td><span class="badge" :class="colorBadge(user.rol)">{{ (user.rol || 'USER').toUpperCase() }}</span></td>
                  <td>{{ user.fechaRegistro }}</td>
                  <td><span class="badge-status" :class="(user.status || '').toLowerCase()">{{ user.status }}</span></td>
                  <td class="acciones-col">
                    <span @click="abrirEdicion(user)">✏️ Editar</span>
                    <span style="margin-left:8px; color:#ef4444;" v-if="user.email !== 'admin@wateriujo.com'" @click="borrarUsuario(user.id)">🗑️ Borrar</span>
                  </td>
                </tr>
                <tr v-if="usuariosFiltrados.length === 0">
                  <td colspan="6" class="sin-resultados">No se encontraron perfiles para "{{ busquedaAdmin }}"</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-if="esCajero" class="vista-admin-dashboard">
        
        <div v-if="mostrarFormulario" class="tarjeta-formulario slide-down">
          <h3>Registrar Nuevo Cliente</h3>
          <p>Añade los datos del cliente para asociarle sus facturas.</p>
          <form @submit.prevent="guardarCliente" class="form-grid">
            <div class="input-group">
              <label>Nombre y Apellido</label>
              <input type="text" v-model="formCliente.nombre" placeholder="Ej. Ana López" required />
            </div>
            <div class="input-group">
              <label>Cédula / Documento</label>
              <input type="text" v-model="formCliente.cedula" placeholder="V-12345678" required />
            </div>
            <div class="input-group">
              <label>Teléfono (Opcional)</label>
              <input type="text" v-model="formCliente.telefono" placeholder="0414-0000000" />
            </div>
            <div class="input-group">
              <label>Correo Electrónico (Opcional)</label>
              <input type="email" v-model="formCliente.email" placeholder="cliente@correo.com" />
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-guardar">Registrar Cliente</button>
            </div>
          </form>
        </div>

        <div class="premium-table-card">
          <div class="card-header-flex">
            <h3 class="card-title-premium">Lista de Clientes</h3>
            <div class="search-box">
              <input type="text" v-model="busquedaCajero" placeholder="Buscar por nombre o cédula..." />
            </div>
          </div>
          
          <div class="table-responsive">
            <table class="tabla-usuarios">
              <thead>
                <tr>
                  <th>CLIENTE</th>
                  <th>CÉDULA / DOC</th>
                  <th>TELÉFONO</th>
                  <th>FECHA REGISTRO</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cliente in clientesFiltrados" :key="cliente.cedula">
                  <td class="td-usuario">
                    <div class="mini-avatar verde-bg">{{ cliente.nombre.charAt(0).toUpperCase() }}</div>
                    <span class="negrita">{{ cliente.nombre }}</span>
                  </td>
                  <td>{{ cliente.cedula }}</td>
                  <td>{{ cliente.telefono }}</td>
                  <td>{{ cliente.fechaRegistro }}</td>
                  <td><button class="btn-seleccionar">Seleccionar para Venta</button></td>
                </tr>
                <tr v-if="clientesFiltrados.length === 0">
                  <td colspan="5" class="sin-resultados">
                    No existe un cliente con "<strong>{{ busquedaCajero }}</strong>". <br>
                    <a href="#" @click.prevent="mostrarFormulario = true" class="link-azul">¡Regístralo ahora!</a>
                  </td>
                </tr>
              </tbody>
            </table>
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

const router = useRouter();
const store = useSistemaStore();

// --- LÓGICA DE ROLES Y SEGURIDAD ---
const esAdmin = computed(() => store.rolUsuario === 'admin');
const esCajero = computed(() => store.rolUsuario === 'cajero');

onMounted(() => {
  if (!esAdmin.value && !esCajero.value) {
    alert('Acceso restringido: Esta sección es solo para el personal autorizado.');
    router.push('/');
  }
});

const nombreRol = computed(() => store.perfilUsuario?.nombre || (esAdmin.value ? 'Administrador' : 'Cajero'));
const emailUsuario = computed(() => store.perfilUsuario?.email || 'usuario@wateriujo.com');

// KPIs
const kpiTotal = computed(() => store.usuarios.length);
const kpiAdmins = computed(() => store.usuarios.filter(u=>u.rol==='admin').length);
const kpiCajeros = computed(() => store.usuarios.filter(u=>u.rol==='cajero').length);
const kpiDelivery = computed(() => store.usuarios.filter(u=>u.rol==='delivery').length);
const kpiClientes = computed(() => store.usuarios.filter(u=>u.rol==='cliente').length);

const mostrarFormulario = ref(false);
const esEdicion = ref(false);

const formUser = ref({ id: null, nombre: '', email: '', password: '', cedula: '', telefono: '', direccion: '', rol: '', status: 'Activo' });
const formCliente = ref({ nombre: '', cedula: '', telefono: '', email: '', direccion: '' });

const initForm = () => {
   formUser.value = { id: null, nombre: '', email: '', password: '', cedula: '', telefono: '', direccion: '', rol: '', status: 'Activo' };
   esEdicion.value = false;
};

const abrirEdicion = (u) => {
   formUser.value = { ...u };
   esEdicion.value = true;
   mostrarFormulario.value = true;
   window.scrollTo({ top: 0, behavior: 'smooth' });
};

const borrarUsuario = (id) => {
  if(confirm("¿Estás seguro de que deseas eliminar permanentemente a este usuario?")) {
     store.eliminarUsuario(id);
  }
};

const guardarDataUsuario = () => {
   store.guardarUsuario({...formUser.value});
   alert('Perfil guardado exitosamente');
   mostrarFormulario.value = false;
   initForm();
};

const busquedaAdmin = ref('');
const usuariosFiltrados = computed(() => {
  const lista = store.usuarios || [];
  const termino = busquedaAdmin.value.toLowerCase().trim();
  if (!termino) return lista;
  return lista.filter(u => 
    (u.nombre || '').toLowerCase().includes(termino) || 
    (u.email || '').toLowerCase().includes(termino) ||
    (u.rol || '').toLowerCase().includes(termino)
  );
});

const colorBadge = (r) => {
   const dic = { admin: 'morado', cajero: 'naranja', delivery: 'rojo', cliente: 'verde' };
   return dic[r] || 'azul';
};
const colorBgBadge = (r) => {
   const dic = { admin: 'morado-bg', cajero: 'naranja-bg', delivery: 'rojo-bg', cliente: 'verde-bg' };
   return dic[r] || 'azul-bg';
};

// Logica Cliente CAJERO
const busquedaCajero = ref('');
const clientesFiltrados = computed(() => {
  const termino = busquedaCajero.value.toLowerCase().trim();
  return store.usuarios.filter(u => 
    u.rol === 'cliente' && 
    (u.nombre.toLowerCase().includes(termino) || (u.cedula || '').toLowerCase().includes(termino))
  );
});

const guardarCliente = async () => {
  if (!formCliente.value.nombre || !formCliente.value.cedula) return alert('Nombre y cédula obligatorios');
  
  const res = await store.guardarClienteDB({
    ...formCliente.value,
    origen: 'UsuariosView'
  });
  
  if (res && (res.success || res.id)) {
    alert('Cliente registrado exitosamente en la base de datos profesional.');
    mostrarFormulario.value = false;
    formCliente.value = { nombre: '', cedula: '', telefono: '', email: '', direccion: '' };
    await store.fetchClientes();
  } else {
    alert('Error al registrar cliente: ' + (res.error || 'No se pudo guardar'));
  }
};
</script>

<style scoped>
.main-content {
  flex: 1;
  padding: 20px 45px;
  background: #f8fafc;
  overflow-y: auto;
}

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

.btn-nuevo { background: #3b82f6; color: white; border: none; padding: 10px 25px; border-radius: 10px; font-weight: 700; cursor: pointer; font-size: 14px; transition: 0.3s; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2); }
.btn-nuevo:hover { background: #2563eb; transform: translateY(-2px); box-shadow: 0 6px 15px rgba(59, 130, 246, 0.3); }

.vista-admin-dashboard { display: flex; flex-direction: column; gap: 30px; }
.premium-kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; }
.premium-kpi-card { background: white; padding: 25px; border-radius: 20px; display: flex; align-items: flex-start; gap: 20px; border: 1px solid rgba(226, 232, 240, 0.8); box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05); transition: transform 0.3s ease, box-shadow 0.3s ease; position: relative; overflow: hidden; }
.premium-kpi-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px -5px rgba(0, 0, 0, 0.08); }
.premium-kpi-card::before { content: ''; position: absolute; top: 0; left: 0; width: 6px; height: 100%; border-radius: 20px 0 0 20px; }

.card-blue::before { background: linear-gradient(to bottom, #3b82f6, #60a5fa); }
.card-purple::before { background: linear-gradient(to bottom, #8b5cf6, #a78bfa); }
.card-orange::before { background: linear-gradient(to bottom, #f59e0b, #fbbf24); }
.card-green::before { background: linear-gradient(to bottom, #10b981, #34d399); }

.kpi-icon-wrapper { width: 56px; height: 56px; border-radius: 16px; display: flex; justify-content: center; align-items: center; font-size: 24px; flex-shrink: 0; }
.card-blue .kpi-icon-wrapper { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
.card-purple .kpi-icon-wrapper { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }
.card-orange .kpi-icon-wrapper { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
.card-green .kpi-icon-wrapper { background: rgba(16, 185, 129, 0.1); color: #10b981; }

.kpi-info { display: flex; flex-direction: column; gap: 8px; }
.kpi-label { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
.kpi-value { font-size: 28px; font-weight: 800; color: #0f172a; margin: 0; line-height: 1; letter-spacing: -0.5px; }
.kpi-trend { font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 4px; }
.kpi-trend.positive { color: #10b981; }
.kpi-trend.neutral { color: #8b5cf6; }

.tarjeta-formulario { background: white; border: 1px solid rgba(226, 232, 240, 0.8); border-radius: 16px; padding: 25px 30px; margin-bottom: 20px; box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05); border-top: 4px solid #3b82f6; }
.tarjeta-formulario h3 { font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 5px; }
.tarjeta-formulario p { font-size: 13px; color: #64748b; margin-bottom: 20px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.input-group { display: flex; flex-direction: column; gap: 8px; }
.input-group label { font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }
.input-group input, .input-group select { padding: 12px 15px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; outline: none; transition: 0.2s; background: #f8fafc; color: #1e293b; font-weight: 500; }
.input-group input:focus, .input-group select:focus { border-color: #3b82f6; background: white; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
.form-actions { grid-column: 1 / -1; display: flex; justify-content: flex-end; margin-top: 10px; }
.btn-guardar { background: #3b82f6; color: white; border: none; padding: 12px 30px; border-radius: 8px; font-weight: 700; cursor: pointer; transition: 0.2s; }
.btn-guardar:hover { background: #2563eb; transform: translateY(-1px); }

.premium-table-card { background: white; padding: 30px; border-radius: 20px; border: 1px solid rgba(226, 232, 240, 0.8); box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05); display: flex; flex-direction: column; }
.card-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
.card-title-premium { font-size: 18px; font-weight: 800; color: #0f172a; margin: 0; }

.search-box { display: flex; align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 8px 15px; }
.search-box input { border: none; background: transparent; outline: none; font-size: 14px; color: #1e293b; width: 220px; font-weight: 500; }
.search-box input::placeholder { color: #94a3b8; }

.table-responsive { overflow-x: auto; }
.tabla-usuarios { width: 100%; border-collapse: collapse; }
.tabla-usuarios th { text-align: left; font-size: 11px; font-weight: 700; color: #94a3b8; padding: 12px 0; border-bottom: 2px solid #f1f5f9; text-transform: uppercase; letter-spacing: 1px; }
.tabla-usuarios td { padding: 18px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 600; color: #1e293b; }

.td-usuario { display: flex; align-items: center; gap: 12px; }
.mini-avatar { width: 36px; height: 36px; border-radius: 10px; display: flex; justify-content: center; align-items: center; color: white; font-weight: 800; font-size: 14px; }
.azul-bg { background: linear-gradient(135deg, #3b82f6, #60a5fa); }
.morado-bg { background: linear-gradient(135deg, #8b5cf6, #a78bfa); }
.naranja-bg { background: linear-gradient(135deg, #f59e0b, #fbbf24); }
.verde-bg { background: linear-gradient(135deg, #10b981, #34d399); }
.rojo-bg { background: linear-gradient(135deg, #f43f5e, #fb7185); }

.negrita { font-weight: 700; color: #1e293b; }
.badge { padding: 6px 12px; border-radius: 20px; font-size: 10px; font-weight: 800; letter-spacing: 0.5px; border: 1px solid transparent; text-transform:uppercase;}
.badge.morado { background: #f3e8ff; color: #7e22ce; border-color: rgba(126, 34, 206, 0.1); }
.badge.azul { background: #e0f2fe; color: #0284c7; border-color: rgba(2, 132, 199, 0.1); }
.badge.naranja { background: #ffedd5; color: #ea580c; border-color: rgba(234, 88, 12, 0.1); }
.badge.verde { background: #d1fae5; color: #059669; border-color: rgba(5, 150, 105, 0.1); }
.badge.rojo { background: #ffe4e6; color: #e11d48; border-color: rgba(225, 29, 72, 0.1); }

.badge-status { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; }
.dot { width: 8px; height: 8px; border-radius: 50%; }
.dot.activo { background: #10b981; box-shadow: 0 0 10px rgba(16, 185, 129, 0.4); }
.dot.inactivo { background: #94a3b8; }

.acciones-col { cursor: pointer; color: #3b82f6; font-weight: 700; }
.acciones-col:hover { text-decoration: underline; }
.btn-seleccionar { background: #f1f5f9; color: #3b82f6; border: none; padding: 6px 15px; border-radius: 8px; font-weight: 700; cursor: pointer; transition: 0.2s; }
.btn-seleccionar:hover { background: #3b82f6; color: white; }

.sin-resultados { text-align: center; padding: 40px !important; color: #94a3b8; font-weight: 500; }
.link-azul { color: #3b82f6; font-weight: 700; text-decoration: none; }

@media (max-width: 768px) {
  .app-layout { flex-direction: column; }
  .main-content { padding: 20px; }
  .page-header { flex-direction: column; align-items: flex-start; gap: 20px; }
  .header-actions { width: 100%; justify-content: space-between; flex-direction: row-reverse; align-items: center; }
  .perfil-usuario-top { padding: 10px 15px; margin-top: 0; }
  .info-texto-top { text-align: left; }
  .premium-kpi-grid { grid-template-columns: 1fr; }
  .form-grid { grid-template-columns: 1fr; }
  .premium-table-card { padding: 20px; }
}
</style>