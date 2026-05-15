<!-- VISTA: Autenticación | Propósito: Puerta de acceso al sistema con validación de credenciales y roles. -->
<template>
  <div class="login-pantalla-completa">
    <div class="tarjeta-login">
      
      <div class="header-login">
        <h2>WATER IUJO</h2>
        <h3>Sistema de Gestión</h3>
        <p>Purificadora de Agua</p>
      </div>

      <form @submit.prevent="iniciarSesion" class="formulario-login">
        <div class="grupo-input">
          <label>Usuario (email)</label>
          <div class="input-con-icono">
            <span class="icono">✉️</span>
            <input 
              type="text" 
              v-model="usuario" 
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
            <span class="icono-ojo">👁️</span>
          </div>
        </div>

        <div class="opciones-extra">
          <label class="checkbox-container">
            <input type="checkbox" /> Recordar sesión
          </label>
        </div>

        <button type="submit" class="btn-iniciar">Iniciar Sesión ➔</button>

        <p v-if="mensajeError" class="mensaje-error">{{ mensajeError }}</p>
      </form>

      <div class="footer-login">
        <router-link to="/register" class="enlace-secundario">Registrarse</router-link>
        <span class="punto">·</span>
        <router-link to="/forgot-password" class="enlace-secundario">¿Olvidaste tu contraseña?</router-link>
      </div>


    </div>
  </div>
</template>

<script setup>
// [LÓGICA DEL COMPONENTE] Inicialización de estado reactivo, store global y manejo de eventos de la vista.

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSistemaStore } from '../stores/sistema';

const router = useRouter();
const store = useSistemaStore();

const usuario = ref('');
const password = ref('');
const mensajeError = ref('');



const iniciarSesion = async () => {
  mensajeError.value = '';

  const result = await store.login(usuario.value, password.value);

  if (result.success) {
    // Redirigir según el rol
    if (store.rolUsuario === 'admin') router.push('/admin');
    else if (store.rolUsuario === 'cajero') router.push('/ventas');
    else if (store.rolUsuario === 'delivery') router.push('/delivery');
    else if (store.rolUsuario === 'cliente') router.push('/cliente');
    else router.push('/');
  } else {
    mensajeError.value = result.error;
  }
};
</script>

<style scoped>
/* [ESTILOS] Reglas CSS exclusivas de esta vista (scoped) para evitar colisiones globales. */

/* Reset básico */
* { box-sizing: border-box; margin: 0; padding: 0; }

/* FONDO PANTALLA COMPLETA */
.login-pantalla-completa {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: linear-gradient(135deg, #10315a 0%, #1e5799 50%, #207cca 100%);
  display: flex; justify-content: center; align-items: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px; /* Clave para que en celulares no pegue a los bordes */
  z-index: 9999;
}

/* TARJETA BLANCA CENTRAL */
.tarjeta-login {
  background: white;
  width: 100%;
  max-width: 420px; /* Tamaño máximo en PC */
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  text-align: center;
}

/* TEXTOS DEL HEADER */
.header-login h2 { font-size: 26px; font-weight: 800; color: #111; letter-spacing: 1px; margin-bottom: 5px; }
.header-login h3 { font-size: 16px; font-weight: 600; color: #444; margin-bottom: 5px; }
.header-login p { font-size: 13px; color: #888; margin-bottom: 30px; }

/* FORMULARIO Y CAMPOS */
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
.icono-ojo { padding: 0 15px; cursor: pointer; color: #888; }
.input-con-icono input {
  flex: 1; border: none; padding: 12px 0; background: transparent;
  font-size: 14px; color: #333; outline: none;
}

/* CHECKBOX */
.opciones-extra { display: flex; align-items: center; margin-bottom: 25px; font-size: 13px; color: #666; }
.checkbox-container { display: flex; align-items: center; cursor: pointer; gap: 8px; }

/* BOTÓN INICIAR SESIÓN */
.btn-iniciar {
  width: 100%; padding: 14px; background-color: #1a4a84;
  color: white; border: none; border-radius: 8px;
  font-size: 16px; font-weight: 600; cursor: pointer;
  transition: background 0.3s;
}
.btn-iniciar:hover { background-color: #12355e; }
.mensaje-error { color: #e74c3c; font-size: 13px; text-align: center; margin-top: 15px; font-weight: 600; }

/* FOOTER LOGIN (ENLACES) */
.footer-login {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.enlace-secundario {
  font-size: 13px;
  color: #1a4a84;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}
.enlace-secundario:hover {
  color: #2196F3;
  text-decoration: underline;
}
.punto {
  color: #ccc;
  font-size: 14px;
}



/* =========================================
   DISEÑO RESPONSIVE (MÓVILES)
   ========================================= */
@media (max-width: 480px) {
  .tarjeta-login {
    padding: 30px 20px; /* Reducimos el relleno interno para ganar espacio */
  }
  
  .header-login h2 { font-size: 22px; }
  .header-login h3 { font-size: 15px; }
  
  .input-con-icono input { font-size: 16px; /* 16px evita el zoom automático en Safari/iOS */ }
  
  .footer-login {
    flex-direction: column;
    gap: 15px;
  }
}
</style>