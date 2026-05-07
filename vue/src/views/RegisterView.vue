<!-- VISTA: Registro de Usuarios | Propósito: Formulario público para crear nuevas cuentas de cliente web. -->
<template>
  <div class="login-pantalla-completa">
    <div class="tarjeta-login">
      
      <div class="header-login">
        <h2>WATER IUJO</h2>
        <h3>Crear Cuenta</h3>
        <p>Únete a nuestra Purificadora de Agua</p>
      </div>

      <form @submit.prevent="registrarUsuario" class="formulario-login">
        <div class="grupo-input">
          <label>Nombre Completo</label>
          <div class="input-con-icono">
            <span class="icono">👤</span>
            <input 
              type="text" 
              v-model="nombre" 
              placeholder="Tu nombre" 
              required 
            />
          </div>
        </div>

        <div class="grupo-input">
          <label>Email</label>
          <div class="input-con-icono">
            <span class="icono">✉️</span>
            <input 
              type="email" 
              v-model="email" 
              placeholder="ejemplo@correo.com" 
              required 
            />
          </div>
        </div>

        <div class="grupo-input">
          <label>Contraseña</label>
          <div class="input-con-icono">
            <span class="icono">🔒</span>
            <input 
              type="password" 
              v-model="password" 
              placeholder="••••••••" 
              required 
            />
          </div>
        </div>

        <button type="submit" class="btn-iniciar">Registrarse ➔</button>
      </form>

      <div class="footer-login">
        <span>¿Ya tienes cuenta?</span>
        <router-link to="/login" class="enlace-secundario">Iniciar Sesión</router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
// [LÓGICA DEL COMPONENTE] Inicialización de estado reactivo, store global y manejo de eventos de la vista.

import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const nombre = ref('');
const email = ref('');
const password = ref('');

const registrarUsuario = () => {
  // Aquí iría la lógica de registro por API
  alert('Registro exitoso (Simulado)');
  router.push('/login');
};
</script>

<style scoped>
/* [ESTILOS] Reglas CSS exclusivas de esta vista (scoped) para evitar colisiones globales. */

/* Reutilizamos los mismos estilos que el login para consistencia visual */
.login-pantalla-completa {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: linear-gradient(135deg, #10315a 0%, #1e5799 50%, #207cca 100%);
  display: flex; justify-content: center; align-items: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
  z-index: 9999;
}
.tarjeta-login {
  background: white;
  width: 100%;
  max-width: 420px;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  text-align: center;
}
.header-login h2 { font-size: 26px; font-weight: 800; color: #111; letter-spacing: 1px; margin-bottom: 5px; }
.header-login h3 { font-size: 16px; font-weight: 600; color: #444; margin-bottom: 5px; }
.header-login p { font-size: 13px; color: #888; margin-bottom: 30px; }
.formulario-login { text-align: left; }
.grupo-input { margin-bottom: 20px; }
.grupo-input label { display: block; font-size: 13px; font-weight: 600; color: #555; margin-bottom: 8px; }
.input-con-icono {
  position: relative;
  display: flex; align-items: center;
  border: 1px solid #ccc; border-radius: 8px;
  background-color: #fcfcfc; transition: all 0.3s ease;
}
.input-con-icono:focus-within { border-color: #2196F3; box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1); }
.icono { padding: 0 15px; font-size: 16px; color: #888; }
.input-con-icono input {
  flex: 1; border: none; padding: 12px 0; background: transparent;
  font-size: 14px; color: #333; outline: none;
}
.btn-iniciar {
  width: 100%; padding: 14px; background-color: #1a4a84;
  color: white; border: none; border-radius: 8px;
  font-size: 16px; font-weight: 600; cursor: pointer;
  transition: background 0.3s;
}
.btn-iniciar:hover { background-color: #12355e; }
.footer-login {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #666;
}
.enlace-secundario {
  color: #1a4a84;
  text-decoration: none;
  font-weight: 600;
}
.enlace-secundario:hover {
  color: #2196F3;
  text-decoration: underline;
}

@media (max-width: 480px) {
  .tarjeta-login { padding: 30px 20px; }
  .footer-login { flex-direction: column; gap: 5px; }
}
</style>
