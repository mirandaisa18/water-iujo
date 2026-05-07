export const listaProductosInventario = [
  { id: '#001', nombre: 'Botellón 19L (Nuevo)', tipo: 'Botellón', stock: 48, minimo: 10, precioCompra: 5.00, precioVenta: 8.00, colorTipo: 'azul', esServicio: false },
  { id: '#002', nombre: 'Recarga 19L', tipo: 'Servicio', stock: 999, minimo: 0, precioCompra: 0.20, precioVenta: 1.50, colorTipo: 'verde', esServicio: true },
  { id: '#003', nombre: 'Botellón Nuevo 12L', tipo: 'Botellón', stock: 20, minimo: 15, precioCompra: 3.50, precioVenta: 7.00, colorTipo: 'azul', esServicio: false },
  { id: '#004', nombre: 'Recarga 10L', tipo: 'Servicio', stock: 999, minimo: 0, precioCompra: 0.10, precioVenta: 0.80, colorTipo: 'verde', esServicio: true },
  { id: '#012', nombre: 'Filtro de Carbón Activado', tipo: 'Filtro', stock: 12, minimo: 5, precioCompra: 18.50, precioVenta: 30.00, colorTipo: 'morado', esServicio: false },
  { id: '#044', nombre: 'Tapas Plásticas Azules (100u)', tipo: 'Insumo', stock: 3, minimo: 50, precioCompra: 2.50, precioVenta: 5.00, colorTipo: 'rojo', esServicio: false },
  { id: '#100', nombre: 'Combo Familiar', tipo: 'Combo', stock: 15, minimo: 5, precioCompra: 10.40, precioVenta: 18.00, colorTipo: 'naranja', esServicio: false }
];

export const listaClientesData = [
  { nombre: 'Juan Pérez', rif: 'V-15888222', telefono: '04141234567', direccion: 'Calle 10' },
  { nombre: 'Empresa Agua Clara', rif: 'J-30555666', telefono: '02125554433', direccion: 'Av. Libertador' },
  { nombre: 'María Rodríguez', rif: 'V-12345678', telefono: '0412-1112233', direccion: 'Oeste' },
  { nombre: 'Carlos Ruiz', rif: 'V-87654321', telefono: '0424-4445566', direccion: 'Este' }
];

export const historicoTickets = [
  { 
    id: '001', 
    hora: '12:05 PM', 
    timestamp: '2026-03-12T12:05:00',
    descripcion: '1x Combo Full', 
    metodo: 'Zelle', 
    monto: 18.50, 
    colorMetodo: 'azul', 
    cliente: 'Juan Pérez', 
    items: [{nombre: 'Combo Full', cant: 1, precio: 18.50}] 
  },
  { 
    id: '002', 
    hora: '11:30 AM', 
    timestamp: '2026-03-12T11:30:00',
    descripcion: '5x Tapas, 1x Sello', 
    metodo: 'Efectivo', 
    monto: 1.50, 
    colorMetodo: 'verde', 
    cliente: 'María Rodríguez', 
    items: [{nombre: 'Tapas', cant: 5, precio: 0.20}, {nombre: 'Sello', cant: 1, precio: 0.50}] 
  },
  { 
    id: '003', 
    hora: '11:12 AM', 
    timestamp: '2026-03-12T11:12:00',
    descripcion: '1x Botellón Nuevo', 
    metodo: 'Pago Móvil', 
    monto: 15.00, 
    colorMetodo: 'naranja', 
    cliente: 'Carlos Ruiz', 
    items: [{nombre: 'Botellón Nuevo', cant: 1, precio: 15.00}] 
  },
  { 
    id: '004', 
    hora: '10:45 AM', 
    timestamp: '2026-03-12T10:45:00',
    descripcion: '2x Recarga 20L', 
    metodo: 'Biopago', 
    monto: 3.00, 
    colorMetodo: 'azul', 
    cliente: 'Anónimo', 
    items: [{nombre: 'Recarga 20L', cant: 2, precio: 1.50}] 
  },
  { 
    id: '005', 
    hora: '09:15 AM', 
    timestamp: '2026-03-12T09:15:00', 
    descripcion: '10x Recarga 20L', 
    metodo: 'Transferencia', 
    monto: 15.00, 
    colorMetodo: 'morado', 
    cliente: 'Empresa Agua Clara', 
    items: [{nombre: 'Recarga 20L', cant: 10, precio: 1.50}] 
  },
  { 
    id: '006', 
    hora: '10:00 AM', 
    timestamp: '2026-03-20T10:00:00', 
    descripcion: '2x Recarga 19L', 
    metodo: 'Efectivo', 
    monto: 3.00, 
    colorMetodo: 'verde', 
    cliente: 'Juan Pérez', 
    items: [{nombre: 'Recarga 19L', cant: 2, precio: 1.50}] 
  },
  { 
    id: '007', 
    hora: '02:30 PM', 
    timestamp: '2026-03-21T14:30:00', 
    descripcion: '1x Botellón 19L', 
    metodo: 'Zelle', 
    monto: 8.00, 
    colorMetodo: 'azul', 
    cliente: 'Carlos Ruiz', 
    items: [{nombre: 'Botellón 19L (Nuevo)', cant: 1, precio: 8.00}] 
  },
  { 
    id: '008', 
    hora: '11:15 AM', 
    timestamp: '2026-03-22T11:15:00', 
    descripcion: '1x Recarga 19L', 
    metodo: 'Pago Móvil', 
    monto: 1.50, 
    colorMetodo: 'naranja', 
    cliente: 'María Rodríguez', 
    items: [{nombre: 'Recarga 19L', cant: 1, precio: 1.50}] 
  }
];

export const metodosDisponibles = [
  { id: 1, nombre: 'Pago Móvil', icon: '📱' },
  { id: 2, nombre: 'Efectivo', icon: '💵' },
  { id: 3, nombre: 'Zelle', icon: '🇺🇸' },
  { id: 4, nombre: 'Transferencia', icon: '🏦' }
];

