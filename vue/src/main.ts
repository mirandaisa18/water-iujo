import { createApp } from 'vue'
import { createPinia } from 'pinia' // <-- 1. IMPORTAMOS PINIA
import App from './App.vue'
import router from './router'

const app = createApp(App)

// DEBUG: Catch global errors and show them on screen
window.onerror = function(msg, url, line, col, error) {
  const div = document.createElement('div');
  div.style.cssText = 'position:fixed;top:0;left:0;background:red;color:white;z-index:99999;padding:20px;width:100%;';
  div.innerHTML = `<h3>GLOBAL ERROR</h3><p>${msg}</p><p>${url}:${line}:${col}</p><pre>${error?.stack}</pre>`;
  document.body.appendChild(div);
  return false;
};

app.config.errorHandler = (err: any) => {
  console.error('VUE ERROR', err);
  const div = document.createElement('div');
  div.style.cssText = 'position:fixed;bottom:0;left:0;background:orange;color:black;z-index:99999;padding:20px;width:100%;';
  div.innerHTML = `<h3>VUE ERROR</h3><p>${err.message}</p><pre>${err.stack}</pre>`;
  document.body.appendChild(div);
}

app.use(createPinia()) // <-- 2. ACTIVAMOS PINIA
app.use(router)

app.mount('#app')