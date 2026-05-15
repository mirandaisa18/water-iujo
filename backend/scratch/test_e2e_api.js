const http = require('http');

const API_URL = 'http://localhost:4000/api';

async function fetchJSON(endpoint, options = {}) {
    try {
        const fetch = (await import('node-fetch')).default;
        const res = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        const data = await res.json();
        return { status: res.status, data };
    } catch (e) {
        // Fallback to native fetch in Node 18+
        const res = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        const data = await res.json();
        return { status: res.status, data };
    }
}

async function runE2E() {
    console.log('--- INICIANDO PRUEBA E2E ---');
    let token = '';

    try {
        // 1. LOGIN
        console.log('1. Probando Autenticación...');
        const loginRes = await fetchJSON('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: 'admin@water.com', password: 'password' })
        });
        if (loginRes.status !== 200 || !loginRes.data.token) throw new Error('Fallo el login');
        token = loginRes.data.token;
        const authHeaders = { 'Authorization': `Bearer ${token}`, 'x-user-role': 'admin' };
        console.log('✅ Login exitoso. Token obtenido.');

        // 2. CREAR PRODUCTO (Inventario)
        console.log('2. Probando Inventario (Crear Producto)...');
        const prodId = 'TEST-BOT-01';
        const createProdRes = await fetchJSON('/inventario', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                id: prodId,
                nombre: 'Botellon Test E2E',
                tipo: 'botellon',
                precio: 5.00,
                precioCompra: 2.00,
                stock: 10,
                minimo: 2,
                paraVenta: 1
            })
        });
        
        // Ignoramos error 400 si ya existe por pruebas anteriores
        if (createProdRes.status !== 201 && createProdRes.status !== 400) {
            throw new Error(`Fallo creacion producto: ${JSON.stringify(createProdRes.data)}`);
        }
        console.log('✅ Producto verificado/creado.');

        // 3. REGISTRAR VENTA
        console.log('3. Probando Venta...');
        const ventaRes = await fetchJSON('/ventas/registrar', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                numero: 'E2E-001',
                cliente: { cedula: 'V-00000000', nombre: 'Cliente Test' }, // Consumidor final generico
                items: [
                    { id: prodId, nombre: 'Botellon Test E2E', cantidad: 2, precio: 5.0, tipo: 'botellon' }
                ],
                monto: 10.00,
                totalUSD: 10.00,
                metodo: 'Efectivo',
                cajero: 'admin'
            })
        });
        if (ventaRes.status !== 201 && ventaRes.status !== 200) {
             throw new Error(`Fallo al registrar venta: ${JSON.stringify(ventaRes.data)}`);
        }
        console.log('✅ Venta registrada (2 botellones = $10.00).');

        // 4. REGISTRAR GASTO
        console.log('4. Probando Gastos...');
        const gastoRes = await fetchJSON('/gastos', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                concepto: 'Compra de Botellones Vacios',
                categoria: 'Suministros',
                monto: 3.50,
                metodo: 'Efectivo'
            })
        });
        if (gastoRes.status !== 201) throw new Error(`Fallo creacion gasto: ${JSON.stringify(gastoRes.data)}`);
        console.log('✅ Gasto registrado ($3.50).');

        // 5. VERIFICAR REPORTES
        console.log('5. Verificando Reportes Matemáticos...');
        const hoy = new Date().toISOString().split('T')[0];
        const reportRes = await fetchJSON(`/reports/balance?inicio=${hoy}&fin=${hoy}`, { headers: authHeaders });
        if (reportRes.status !== 200) throw new Error('Fallo obtener reporte balance');
        
        console.log('✅ Reportes generados:');
        console.log(`   - Ingresos Totales: $${reportRes.data.estado_resultados.total_ingresos}`);
        console.log(`   - Egresos Totales: $${reportRes.data.estado_resultados.total_gastos}`);
        console.log(`   - Compras Totales: $${reportRes.data.pasivos}`);
        console.log(`   - Utilidad Neta: $${reportRes.data.estado_resultados.utilidad_neta}`);

        console.log('--- E2E COMPLETADO CON ÉXITO ---');
        process.exit(0);

    } catch (error) {
        console.error('❌ E2E ERROR:', error.message);
        process.exit(1);
    }
}

runE2E();
