import { Router } from 'express';
import { getClients, createClient, registrarCliente, buscarClientes } from '../controllers/ClientController';
import { getTasa } from '../controllers/TasaController';
import { registrarVenta, getHistorialVentas } from '../controllers/VentasController';
import { getAlertas } from '../controllers/AlertController';
import { getGastos, registrarGasto } from '../controllers/GastosController';
import { getProveedores, crearProveedor, updateProveedor, deleteProveedor, getCompras, registrarCompra } from '../controllers/ComprasController';
import { getMantenimientos, registrarMantenimiento } from '../controllers/MantenimientoController';
import { getBalanceReport, getVolumeReport, getProductsReport, getPaymentsReport, getUsersActivityReport } from '../controllers/ReportController';
import { getInventario, updateInventarioItem, deleteInventarioItem, createInventarioItem } from '../controllers/InventarioController';
import { descargarRespaldo, formatearSistema, reiniciarCatalogo } from '../controllers/SystemController';
import { checkRole } from '../middleware/authMiddleware';

const router = Router();

// Endpoint Clientes
router.get('/clients', checkRole(['admin', 'cajero']), getClients);
router.post('/clients', checkRole(['admin', 'cajero']), createClient);
router.get('/clientes/buscar', checkRole(['admin', 'cajero']), buscarClientes);
router.post('/clientes/registrar', checkRole(['admin', 'cajero']), registrarCliente);

// Endpoint Integraciones API
router.get('/tasa', getTasa);

// Endpoint Ventas
router.post('/ventas/registrar', checkRole(['cajero']), registrarVenta);
router.get('/ventas/historial', checkRole(['admin']), getHistorialVentas);

// Endpoint Alertas
router.get('/alertas', getAlertas);

// Endpoint Gastos
router.get('/gastos', checkRole(['admin']), getGastos);
router.post('/gastos', checkRole(['admin']), registrarGasto);

// Endpoint Compras y Proveedores
router.get('/proveedores', checkRole(['admin']), getProveedores);
router.post('/proveedores', checkRole(['admin']), crearProveedor);
router.put('/proveedores/:id', checkRole(['admin']), updateProveedor);
router.delete('/proveedores/:id', checkRole(['admin']), deleteProveedor);
router.get('/compras', checkRole(['admin']), getCompras);
router.post('/compras/registrar', checkRole(['admin']), registrarCompra);

// Endpoint Mantenimientos
router.get('/mantenimientos', checkRole(['admin']), getMantenimientos);
router.post('/mantenimientos/registrar', checkRole(['admin']), registrarMantenimiento);

// --- RUTAS DE SISTEMA (BACKUP / RESET) ---
router.get('/system/backup', checkRole(['admin']), descargarRespaldo);
router.post('/system/reset', checkRole(['admin']), formatearSistema);
router.post('/system/reset-catalog', checkRole(['admin']), reiniciarCatalogo);

// Endpoint Reportes (Nuevos 5 módulos de reportes)
router.get('/reports/balance', checkRole(['admin']), getBalanceReport);
router.get('/reports/volume', checkRole(['admin']), getVolumeReport);
router.get('/reports/products', checkRole(['admin']), getProductsReport);
router.get('/reports/payments', checkRole(['admin']), getPaymentsReport);
router.get('/reports/activity', checkRole(['admin']), getUsersActivityReport);

// Endpoint Inventario
router.get('/inventario', checkRole(['admin', 'cajero']), getInventario);
router.post('/inventario', checkRole(['admin']), createInventarioItem);
router.put('/inventario/:id', checkRole(['admin']), updateInventarioItem);
router.delete('/inventario/:id', checkRole(['admin']), deleteInventarioItem);

export default router;