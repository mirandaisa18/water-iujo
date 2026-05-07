const axios = require('axios');

async function diagnose() {
  const API_URL = 'http://localhost:4000/api';
  const headers = { 'x-user-role': 'admin' };

  console.log('--- DIAGNÓSTICO DE ERRORES ---');

  // 1. Probar Registro de Proveedor
  try {
    console.log('Probando registro de proveedor...');
    const resProv = await axios.post(`${API_URL}/proveedores`, {
      nombre: 'Proveedor de Prueba ' + Date.now(),
      contacto: 'Contacto Test',
      telefono: '123456',
      email: 'test@test.com',
      direccion: 'Calle Test 123'
    }, { headers });
    console.log('✅ Registro de Proveedor: EXITOSO', resProv.data);
  } catch (error) {
    console.error('❌ Error en Proveedor:', error.response ? error.response.data : error.message);
  }

  // 2. Probar Registro de Producto
  try {
    console.log('\nProbando registro de producto...');
    const resProd = await axios.post(`${API_URL}/inventario`, {
      id: 'TEST-' + Date.now(),
      nombre: 'Producto Test',
      tipo: 'Insumo',
      precio: 10,
      precioCompra: 5,
      stock: 100,
      minimo: 10,
      paraVenta: 1
    }, { headers });
    console.log('✅ Registro de Producto: EXITOSO', resProd.data);
  } catch (error) {
    console.error('❌ Error en Producto:', error.response ? error.response.data : error.message);
  }
}

diagnose();
