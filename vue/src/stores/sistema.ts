import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import axios from 'axios'
import { historicoTickets } from '../data/mockData'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Helper para persistencia segura
const guardar = (llave: string, valor: any) => localStorage.setItem(llave, JSON.stringify(valor));
const leer = (llave: string, backup: any) => {
  const data = localStorage.getItem(llave);
  try {
    const parsed = data ? JSON.parse(data) : null;
    return parsed !== null ? parsed : backup;
  } catch (e) {
    return backup;
  }
};

export const useSistemaStore = defineStore('sistema', () => {
  // --- 1. ESTADO ---
  const listaClientes = ref<any[]>([]);
  const initialTickets = leer('tickets_reales', []);
  const tickets = ref(initialTickets);
  const historialVentas = ref<any[]>([]);

  const initialGastos = leer('gastos_reales', []);
  const gastos = ref(initialGastos);
  const compras = ref<any[]>([]);
  const inventario = ref<any[]>([]);

  // Default Users according to user specs
  const usuariosDbInicial = [
    { id: '1', nombre: 'Admin Master', email: 'admin@wateriujo.com', password: '123', rol: 'admin', fechaRegistro: '01/03/2026', status: 'Activo', cedula: 'V-00000000', telefono: '0000-0000000', direccion: 'Sede Principal' },
    { id: '2', nombre: 'Cajero Principal', email: 'caja@wateriujo.com', password: '1234', rol: 'cajero', fechaRegistro: '10/03/2026', status: 'Activo', cedula: 'V-11111111', telefono: '0414-1111111', direccion: 'Sede Principal' },
    { id: '3', nombre: 'Repartidor 1', email: 'delivery@wateriujo.com', password: '123456', rol: 'delivery', fechaRegistro: '15/03/2026', status: 'Activo', cedula: 'V-22222222', telefono: '0424-2222222', direccion: 'Zona Este' },
    { id: '4', nombre: 'Cliente General', email: 'cliente@wateriujo.com', password: '12345', rol: 'cliente', fechaRegistro: '18/03/2026', status: 'Activo', cedula: 'V-33333333', telefono: '0412-3333333', direccion: 'Zona Centro' }
  ];
  let initialUsuarios = leer('usuarios_reales', usuariosDbInicial);
  
  // MIGRACIÓN: Garantizar contraseña en usuarios antiguos si quedó atrapada en LocalStorage
  initialUsuarios = initialUsuarios.map((u: any) => {
    if (!u.password) {
       if (u.rol === 'admin') u.password = '123';
       else if (u.rol === 'cajero') u.password = '1234';
       else if (u.rol === 'delivery') u.password = '123456';
       else if (u.rol === 'cliente') u.password = '12345';
       else u.password = '123456';
       
       u.cedula = u.cedula || 'V-00000000';
       u.telefono = u.telefono || '0400-0000000';
       u.direccion = u.direccion || 'Sin dirección';
    }
    return u;
  });
  
  const usuarios = ref(initialUsuarios);
  guardar('usuarios_reales', usuarios.value);

  // El próximo número debe persistir de forma independiente
  const proximoNumeroFactura = ref(0);

  // Intentamos recuperar el contador del navegador
  const numPersistido = localStorage.getItem('numeroFacturaActual');
  if (numPersistido !== null) {
    proximoNumeroFactura.value = parseInt(numPersistido) || 0;
  } else {
    proximoNumeroFactura.value = 0;
  }

  const ingresosDelDia = ref(tickets.value.reduce((sum: any, t: any) => sum + (t.monto || 0), 0));
  const ventasDelDia = ref(tickets.value.length);
  const rolUsuario = ref(sessionStorage.getItem('rolUsuario') || '');
  const usuario = ref(leer('usuario_logueado', { id: sessionStorage.getItem('idUsuario') || '', nombre: '', rol: '' }));
  const listaEntregas = ref(leer('lista_entregas_v1', []));
  const tasaBCV = ref(leer('tasaBCV', 66.00));
  const metodosPagoConfig = ref(leer('metodosPagoConfig', ['Efectivo', 'Pago Móvil', 'Zelle', 'Tarjeta', 'Biopago', 'Transferencia']));

  // --- MÉTODOS DE BASE DE DATOS (BACKEND) ---
  const fetchClientes = async () => {
    try {
      const config = { headers: { 'x-user-role': rolUsuario.value } };
      const res = await axios.get(`${API_URL}/clients`, config);
      // Normalizamos la data para que el frontend no falle si el backend cambia
      listaClientes.value = (res.data || []).map((c: any) => ({
        id: c.id || c.Cedúla_Cliente,
        nombre: c.nombre || c.Nombre,
        rif: c.rif || c.cedulaRif || c.Cedúla_Cliente,
        cedulaRif: c.cedulaRif || c.rif || c.Cedúla_Cliente,
        telefono: c.telefono || 'N/A',
        direccion: c.direccion || c.Direcccion || ''
      }));
      console.log('DEBUG: Clientes normalizados en store:', listaClientes.value.length);
    } catch (err) {
      console.error('Error fetching clients from DB', err);
    }
  };

  const buscarClientesDB = async (query: string) => {
    try {
      const config = { headers: { 'x-user-role': rolUsuario.value } };
      const res = await axios.get(`${API_URL}/clientes/buscar?q=${query}`, config);
      return res.data;
    } catch (err) {
      console.error('Error searching clients in DB', err);
      return [];
    }
  };

  const guardarClienteDB = async (cli: any) => {
    try {
      const config = { headers: { 'x-user-role': rolUsuario.value } };
      const payload = {
        nombre: cli.nombre,
        cedula: cli.cedula || cli.rif || cli.cedulaRif,
        telefono: cli.telefono || '',
        direccion: cli.direccion || '',
        email: cli.email || '',
        origen: cli.origen || 'POS'
      };
      const res = await axios.post(`${API_URL}/clientes/registrar`, payload, config);
      await fetchClientes(); // Refresh list
      return res.data; // Retornar el cliente creado
    } catch (err: any) {
      console.error('Error saving client to DB', err);
      return { 
        success: false, 
        error: err.response?.data?.error || 'Error de conexión con el servidor' 
      };
    }
  };

  const fetchHistorialVentas = async () => {
    try {
      const config = { 
        headers: { 
          'x-user-role': rolUsuario.value,
          'x-user-id': usuario.value?.cedula || usuario.value?.id 
        } 
      };
      const res = await axios.get(`${API_URL}/ventas/historial`, config);
      const data = res.data || [];
      historialVentas.value = data;
      
      // Mapear a formato 'tickets' para compatibilidad con Reportes y Dashboard
      tickets.value = data.map((v: any) => ({
        id: v.id,
        timestamp: v.fecha,
        fecha: v.fecha,
        monto: v.total_usd,
        totalUSD: v.total_usd,
        totalBS: v.total_bs,
        metodo: v.metodo_pago,
        cliente: v.cliente_nombre || 'Consumidor Final',
        items: v.items || [], 
        vendedor_id: v.vendedor_id
      }));
      
      // Actualizar KPIs locales
      ventasDelDia.value = tickets.value.length;
      ingresosDelDia.value = tickets.value.reduce((sum: any, t: any) => sum + (t.monto || 0), 0);
      
      console.log('DEBUG: Historial de ventas fetched and mapped:', tickets.value.length);
    } catch (err) {
      console.error('Error fetching sales history from DB', err);
    }
  };

  const fetchGeneralData = async () => {
    // Esta función centraliza las peticiones periódicas para "Tiempo Real"
    await Promise.all([
      fetchHistorialVentas(),
      fetchInventario(),
      actualizarTasa(),
      fetchGastos()
    ]);
  };

  fetchClientes(); // Carga inicial de base de datos profesional


  // --- NUEVO: ESTADO DE CONFIGURACIÓN ---
  const perfilUsuario = ref(leer('perfilUsuario', {
    nombre: 'Usuario',
    email: 'email@wateriujo.com',
    estacion: 'Estación 1',
    horario: 'Turno'
  }));

  // Sincronización de seguridad: si hay un rol pero el perfil no concuerda (ej. tras un refresh parcial)
  if (rolUsuario.value === 'admin' && (!perfilUsuario.value.nombre || perfilUsuario.value.nombre.includes('María'))) {
    perfilUsuario.value = {
      nombre: 'Administrador (Admin)',
      email: 'admin@wateriujo.com',
      estacion: 'Estación Central',
      horario: 'Soporte 24/7'
    };
  } else if (rolUsuario.value === 'cajero' && (!perfilUsuario.value.nombre || perfilUsuario.value.nombre.includes('Administrador'))) {
    perfilUsuario.value = {
      nombre: 'María Pérez (Cajero)',
      email: 'caja@wateriujo.com',
      estacion: 'Caja Principal (1)',
      horario: 'Turno Mañana'
    };
  }

  const configuracionNegocio = ref(leer('configuracionNegocio', {
    nombre: 'WATER IUJO',
    rif: 'J-12345678-9',
    direccion: 'Av. Principal, Local 4, Zona Centro.',
    telefono: '+58 412-0000000',
    moneda: 'USD'
  }));

  const preferenciasPOS = ref(leer('preferenciasPOS', {
    impresionAutomatica: true,
    aplicarIVA: false,
    alertaStockBajo: true
  }));

  // --- 2. ACCIONES ---
  const registrarVentaGlobal = async (ticket: any) => {
    try {
      const config = { headers: { 'x-user-role': rolUsuario.value } };
      // 1. Intentar registrar en el Backend (Base de Datos Real y Descuento de Stock)
      const res = await axios.post(`${API_URL}/ventas/registrar`, ticket, config);
      
      if (res.data.success) {
        // 2. Si el backend confirma, actualizamos el estado local
        tickets.value.push({ ...ticket, id: res.data.idVenta || ticket.id });
        ventasDelDia.value = tickets.value.length;
        ingresosDelDia.value = tickets.value.reduce((sum: any, t: any) => sum + (t.monto || 0), 0);
        guardar('tickets_reales', tickets.value);

        // Si el ticket trae info de delivery, crear entrega automáticamente
        if (ticket.delivery) {
          asignarEntrega({
            id: res.data.idVenta || ticket.id,
            cliente: ticket.cliente?.nombre || ticket.cliente || 'Consumidor Final',
            origen: ticket.origen || 'caja',
            direccion: ticket.delivery.direccion || 'Sin dirección',
            telefono: ticket.cliente?.telefono || ticket.telefono || 'N/A',
            detalle: ticket.items.map((i: any) => `${i.cantidad || i.cant}x ${i.nombre}`).join(', '),
            totalUSD: ticket.monto || ticket.totalUSD,
            metodo: ticket.metodo || ticket.metodoPago,
            estatus: 'Pendiente',
            ubicaciones: ticket.delivery.destinos || [],
            mensajes: []
          });
        }
        return { success: true };
      }
    } catch (err: any) {
      console.error('Error al registrar venta en backend:', err);
      const errorMsg = err.response?.data?.error || 'Error de conexión con el servidor';
      return { success: false, error: errorMsg };
    }
  };

  const asignarEntrega = (entrega: any) => {
    // Evitar duplicados por ID de ticket
    if (listaEntregas.value.some((e: any) => e.id === entrega.id)) return;
    listaEntregas.value.push(entrega);
    guardar('lista_entregas_v1', listaEntregas.value);
  };

  const actualizarEstatusEntrega = (id: number | string, nuevoEstatus: string, extraData?: any) => {
    const idx = listaEntregas.value.findIndex((e: any) => e.id === id);
    if (idx !== -1) {
      listaEntregas.value[idx].estatus = nuevoEstatus;
      if (extraData) {
        Object.assign(listaEntregas.value[idx], extraData);
      }
      guardar('lista_entregas_v1', listaEntregas.value);
      
      const tIdx = tickets.value.findIndex((t: any) => t.id === id);
      if (tIdx !== -1) {
        tickets.value[tIdx].deliveryInfo = { ...listaEntregas.value[idx] };
        guardar('tickets_reales', tickets.value);
      }
    }
  };

  const agregarMensajeChat = (idEntrega: number | string, mensaje: any) => {
    const idx = listaEntregas.value.findIndex((e: any) => e.id === idEntrega);
    if (idx !== -1) {
       if (!listaEntregas.value[idx].mensajes) listaEntregas.value[idx].mensajes = [];
       listaEntregas.value[idx].mensajes.push(mensaje);
       guardar('lista_entregas_v1', listaEntregas.value);
    }
  };

  const fetchGastos = async () => {
    try {
      const config = { headers: { 'x-user-role': rolUsuario.value } };
      const res = await axios.get(`${API_URL}/gastos`, config);
      gastos.value = res.data;
    } catch (err) {
      console.error('Error fetching gastos from DB', err);
    }
  };

  const registrarGastoGlobal = async (gasto: any) => {
    try {
      const config = { headers: { 'x-user-role': rolUsuario.value } };
      await axios.post(`${API_URL}/gastos`, gasto, config);
      await fetchGastos();
    } catch (err) {
      console.error('Error saving gasto to DB', err);
    }
  };

  const fetchCompras = async () => {
    try {
      const config = { headers: { 'x-user-role': rolUsuario.value } };
      const res = await axios.get(`${API_URL}/compras`, config);
      compras.value = res.data;
    } catch (err) {
      console.error('Error fetching compras from DB', err);
    }
  };

  const fetchInventario = async () => {
    try {
      const config = { headers: { 'x-user-role': rolUsuario.value } };
      const res = await axios.get(`${API_URL}/inventario`, config);
      inventario.value = res.data;
    } catch (err) {
      console.error('Error fetching inventario from DB', err);
    }
  };

  const resetearBaseDeDatos = async () => {
    try {
      const config = { headers: { 'x-user-role': rolUsuario.value } };
      await axios.post(`${API_URL}/system/reset`, {}, config);
      
      // Reset local state for immediate feedback
      proximoNumeroFactura.value = 0;
      tickets.value = [];
      ventasDelDia.value = 0;
      ingresosDelDia.value = 0;
      gastos.value = [];
      listaEntregas.value = [];
      pedidosPendientes.value = [];

      localStorage.setItem('numeroFacturaActual', '0');
      guardar('tickets_reales', []);
      guardar('gastos_reales', []);
      guardar('lista_entregas_v1', []);
      guardar('pedidosPendientes', []);
    } catch (err) {
      console.error('Error resetting system', err);
    }
  };

  const reiniciarCatalogoDB = async () => {
    try {
      const config = { headers: { 'x-user-role': rolUsuario.value } };
      await axios.post(`${API_URL}/system/reset-catalog`, {}, config);
    } catch (err) {
      console.error('Error resetting catalog', err);
    }
  };
  // --- CRUD USUARIOS ---
  const guardarUsuario = (user: any) => {
    if(user.id) {
       const index = usuarios.value.findIndex((u:any) => u.id === user.id);
       if(index !== -1) usuarios.value[index] = {...user};
    } else {
       user.id = Date.now().toString();
       user.fechaRegistro = new Date().toLocaleDateString('en-GB');
       user.status = 'Activo';
       usuarios.value.push(user);
    }
    guardar('usuarios_reales', usuarios.value);
  };

  const eliminarUsuario = (id: string) => {
    const idx = usuarios.value.findIndex((u:any) => u.id === id);
    if(idx !== -1) {
       usuarios.value.splice(idx, 1);
       guardar('usuarios_reales', usuarios.value);
    }
  };

  const incrementarFactura = () => {
    proximoNumeroFactura.value++;
    localStorage.setItem('numeroFacturaActual', proximoNumeroFactura.value.toString());
  };

  const actualizarPerfil = (nuevoPerfil: any) => {
    perfilUsuario.value = { ...perfilUsuario.value, ...nuevoPerfil };
    guardar('perfilUsuario', perfilUsuario.value);
  };

  const actualizarNegocio = (nuevaConfig: any) => {
    configuracionNegocio.value = { ...configuracionNegocio.value, ...nuevaConfig };
    guardar('configuracionNegocio', configuracionNegocio.value);
  };

  const actualizarPreferencias = (nuevasPrefs: any) => {
    preferenciasPOS.value = { ...preferenciasPOS.value, ...nuevasPrefs };
    guardar('preferenciasPOS', preferenciasPOS.value);
  };

  const actualizarTasa = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasa`);
      if (res.data && res.data.tasa) {
        tasaBCV.value = res.data.tasa;
        guardar('tasaBCV', res.data.tasa);
      }
    } catch (error) {
      console.error('Error al actualizar la tasa BCV vía Backend:', error);
    }
  };

  const resetearContador = () => {
    proximoNumeroFactura.value = 0;
    tickets.value = [];
    ventasDelDia.value = 0;
    ingresosDelDia.value = 0;
    localStorage.setItem('numeroFacturaActual', '0');
    guardar('tickets_reales', []);
  };

  const iniciarSesion = (rol: string, usuarioData?: any) => {
    console.log('DEBUG: iniciarSesion', { rol, usuarioData });
    rolUsuario.value = rol;
    sessionStorage.setItem('rolUsuario', rol);
    
    if (usuarioData) {
      usuario.value = { id: usuarioData.id, nombre: usuarioData.nombre, rol: usuarioData.rol };
      sessionStorage.setItem('idUsuario', usuario.value.id);
      perfilUsuario.value = {
        nombre: usuarioData.nombre,
        email: usuarioData.email,
        estacion: usuarioData.rol === 'delivery' ? 'Ruta Externa' : 'Caja Principal',
        horario: 'Activo'
      };
    } else {
      usuario.value = { id: rol === 'admin' ? '1' : '2', nombre: rol === 'admin' ? 'Admin' : 'Cajero', rol: rol };
      sessionStorage.setItem('idUsuario', usuario.value.id);
      if (rol === 'admin') {
        perfilUsuario.value = {
          nombre: 'Administrador (Admin)',
          email: 'admin@wateriujo.com',
          estacion: 'Estación Central',
          horario: 'Soporte 24/7'
        };
      } else {
        perfilUsuario.value = {
          nombre: 'Usuario Genérico',
          email: 'usuario@wateriujo.com',
          estacion: 'Sistema',
          horario: 'Activo'
        };
      }
    }
    guardar('usuario_logueado', usuario.value);
    guardar('perfilUsuario', perfilUsuario.value);
  };

  const pedidosPendientes = ref(leer('pedidosPendientes', []));

  const agregarPedidoPendiente = (pedido: any) => {
    pedidosPendientes.value.unshift(pedido);
    guardar('pedidosPendientes', pedidosPendientes.value);
  };

  const resolverPedido = (id: number, approved: boolean) => {
    const idx = pedidosPendientes.value.findIndex((p: any) => p.id === id);
    if (idx !== -1) {
      if (approved) {
        // Registrar como venta real
        registrarVentaGlobal({
          id: proximoNumeroFactura.value,
          cliente: pedidosPendientes.value[idx].cliente,
          telefono: pedidosPendientes.value[idx].telefono || '',
          monto: pedidosPendientes.value[idx].monto,
          metodo: pedidosPendientes.value[idx].metodo,
          origen: 'cliente',
          items: pedidosPendientes.value[idx].items || [],
          delivery: pedidosPendientes.value[idx].delivery || null,
          imagenPago: pedidosPendientes.value[idx].imagenPago || null,
          timestamp: new Date().toISOString()
        });
        incrementarFactura();
      }
      pedidosPendientes.value.splice(idx, 1);
      guardar('pedidosPendientes', pedidosPendientes.value);
    }
  };

  const persistirTodo = () => {
    guardar('perfilUsuario', perfilUsuario.value);
    guardar('configuracionNegocio', configuracionNegocio.value);
    guardar('preferenciasPOS', preferenciasPOS.value);
    guardar('tasaBCV', tasaBCV.value);
    localStorage.setItem('numeroFacturaActual', proximoNumeroFactura.value.toString());
  };

  const cerrarSesion = () => {
    rolUsuario.value = '';
    usuario.value = { id: '', nombre: '', rol: '' };
    sessionStorage.removeItem('rolUsuario');
    sessionStorage.removeItem('idUsuario');
    localStorage.removeItem('usuario_logueado');
  };

  // --- REAL-TIME MULTI-TAB SYNC ---
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      // El evento 'storage' se dispara en TODAS LAS OTRAS PESTAÑAS (menos la que hace el cambio)
      if (!e.newValue) return;
      try {
        if (e.key === 'pedidosPendientes') {
          pedidosPendientes.value = JSON.parse(e.newValue);
        } else if (e.key === 'tickets_reales') {
          tickets.value = JSON.parse(e.newValue);
          ventasDelDia.value = tickets.value.length;
          ingresosDelDia.value = tickets.value.reduce((sum: any, t: any) => sum + (t.monto || 0), 0);
        } else if (e.key === 'lista_entregas_v1') {
          listaEntregas.value = JSON.parse(e.newValue);
        } else if (e.key === 'gastos_reales') {
          gastos.value = JSON.parse(e.newValue);
        } else if (e.key === 'usuarios_reales') {
          usuarios.value = JSON.parse(e.newValue);
        } else if (e.key === 'tasaBCV') {
          tasaBCV.value = JSON.parse(e.newValue);
        }
      } catch(err) {
        console.error('Error sincronizando pestaña en tiempo real:', err);
      }
    });
  }

  return {
    tickets,
    ventasDelDia,
    ingresosDelDia,
    rolUsuario,
    tasaBCV,
    proximoNumeroFactura,
    perfilUsuario,
    configuracionNegocio,
    preferenciasPOS,
    pedidosPendientes,
    gastos,
    compras,
    inventario,
    listaEntregas,
    listaClientes,
    usuarios,
    fetchClientes,
    buscarClientesDB,
    fetchGastos,
    fetchCompras,
    fetchInventario,
    resetearBaseDeDatos,
    reiniciarCatalogoDB,
    guardarClienteDB,
    registrarVentaGlobal,
    registrarGastoGlobal,
    agregarPedidoPendiente,
    resolverPedido,
    asignarEntrega,
    actualizarEstatusEntrega,
    agregarMensajeChat,
    guardarUsuario,
    eliminarUsuario,
    actualizarPerfil,
    actualizarNegocio,
    actualizarPreferencias,
    actualizarTasa,
    incrementarFactura,
    resetearContador,
    iniciarSesion,
    persistirTodo,
    cerrarSesion,
    usuario,
    historialVentas,
    fetchHistorialVentas,
    fetchGeneralData,
    metodosPagoConfig
  }
} )
