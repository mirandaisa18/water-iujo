<!-- VISTA: Recuperación de Contraseña | Propósito: Formulario para solicitar el reseteo de claves olvidadas mediante correo electrónico. -->
<template>
  <div class="login-pantalla-completa">
    <div class="tarjeta-login">
      
      <div class="header-login">
        <h2>WATER IUJO</h2>
        <h3>Recuperar Contraseña</h3>
        <p>Ingresa tu email para recibir instrucciones</p>
      </div>

      <form v-if="!enviado" @submit.prevent="enviarRecuperacion" class="formulario-login">
        <div class="grupo-input">
          <label>Email de recuperación</label>
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

        <button type="submit" class="btn-iniciar">Enviar Instrucciones ➔</button>
      </form>

      <div v-else class="mensaje-exito">
        <div class="icono-exito">✅</div>
        <p>Se ha enviado un correo a <strong>{{ email }}</strong> con los pasos para restablecer tu contraseña.</p>
        <button @click="router.push('/login')" class="btn-iniciar">Volver al Login</button>
      </div>

      <div class="footer-login">
        <router-link to="/login" class="enlace-secundario">← Volver al inicio</router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
// [LÓGICA DEL COMPONENTE] Inicialización de estado reactivo, store global y manejo de eventos de la vista.

import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const enviado = ref(false);

const enviarRecuperacion = () => {
  // Simulación de envío de correo
  enviado.value = true;
};
</script>

<style scoped>
/* [ESTILOS] Reglas CSS exclusivas de esta vista (scoped) para evitar colisiones globales. */

/* Reutilizamos los mismos estilos para consistencia */
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
  margin-top: 10px;
}
.btn-iniciar:hover { background-color: #12355e; }

.mensaje-exito {
  padding: 20px 0;
}
.icono-exito {
  font-size: 40px;
  margin-bottom: 15px;
}
.mensaje-exito p {
  font-size: 14px;
  color: #555;
  margin-bottom: 25px;
  line-height: 1.5;
}

.footer-login {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  font-size: 13px;
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
}
</style>
