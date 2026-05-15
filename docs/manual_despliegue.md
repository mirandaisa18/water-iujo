# 🚀 Manual de Implementación y Despliegue (Producción)

Este documento describe los métodos para desplegar la aplicación **Water IUJO** en un entorno de producción (servidor VPS, AWS, etc.).

Te ofrecemos dos métodos de despliegue: **Vía Docker (Recomendado)** y **Vía Manual (PM2 + Nginx)**.

---

## 🐳 Método 1: Despliegue con Docker (Recomendado)

Docker es la forma más rápida, segura y limpia de instalar el sistema. Se encarga de instalar Node, Nginx, compilar el código y enlazar el frontend con el backend automáticamente.

### Requisitos
*   Tener [Docker](https://docs.docker.com/get-docker/) y [Docker Compose](https://docs.docker.com/compose/install/) instalados en tu servidor.

### Pasos de Instalación

1. **Clonar el proyecto en tu servidor:**
   ```bash
   git clone <URL_DEL_REPOSITORIO> water-iujo
   cd water-iujo
   ```

2. **Levantar los contenedores:**
   Ejecuta el siguiente comando para que Docker construya las imágenes e inicie la app en segundo plano (`-d`):
   ```bash
   docker-compose up -d --build
   ```

3. **¡Listo!**
   * El sistema estará disponible en tu IP o dominio en el puerto `80`.
   * El backend corre de forma aislada en el puerto `4000` internamente. Nginx se encarga de redirigir el tráfico `/api` automáticamente.
   * La base de datos SQLite se guarda en un **volumen persistente** llamado `water_iujo_db_volume`. Si destruyes los contenedores, ¡tu data está a salvo!

### Comandos útiles de Docker
*   Ver logs del sistema: `docker-compose logs -f`
*   Detener la aplicación: `docker-compose down`
*   Actualizar la app con nuevos cambios:
    ```bash
    git pull
    docker-compose up -d --build
    ```

---

## 🛠️ Método 2: Despliegue Manual (PM2 + Nginx)

Si no puedes o no deseas usar Docker, sigue estos pasos nativos.

### 📋 2.1 Requisitos Previos en el Servidor

Asegúrate de que tu servidor de producción tenga instalados los siguientes componentes:

1. **Node.js** (Versión 18.x o superior) y **npm**.
2. **Nginx** (Para servir el Frontend y configurar el Reverse Proxy del Backend).
3. **PM2** (Gestor de procesos de Node.js para mantener el backend activo 24/7).
   - Se instala globalmente con: `npm install -g pm2`
4. **Git** (Para traer el código al servidor).

---

## ⚙️ 2. Despliegue del Backend (API REST)

El backend maneja la lógica de negocio y la base de datos (SQLite). Debe correr de forma persistente.

### Paso 2.1: Preparar el Entorno
```bash
cd /var/www/water-iujo/backend
npm install --production
```

### Paso 2.2: Variables de Entorno
Crea un archivo `.env` en la carpeta `backend`:
```env
PORT=4000
JWT_SECRET=una_clave_secreta_muy_larga_y_segura_para_produccion
DB_STORAGE=./database.sqlite
```

### Paso 2.3: Compilar y Ejecutar con PM2
Debido a que el backend usa TypeScript, puedes ejecutarlo usando `ts-node` o compilarlo a JavaScript y correrlo puro (Recomendado para producción).

Usando PM2 con `ts-node` directamente:
```bash
# Iniciar el proceso y darle el nombre "water-backend"
pm2 start src/index.ts --interpreter ./node_modules/.bin/ts-node --name "water-backend"

# Guardar la lista de procesos para que arranquen si el servidor se reinicia
pm2 save
pm2 startup
```

---

## 🌐 3. Despliegue del Frontend (Vue 3 + Vite)

El frontend se compila en archivos estáticos (HTML, CSS, JS) puros. Estos archivos serán servidos por Nginx de manera ultra-rápida.

### Paso 3.1: Configurar la URL de la API
En la carpeta `frontend`, crea o modifica un archivo `.env.production` para indicarle al frontend a dónde debe hacer las peticiones:
```env
# Ejemplo: si tu dominio es tudominio.com y la API la ruteas bajo /api
VITE_API_URL=https://tudominio.com/api
```

### Paso 3.2: Compilar el Frontend
```bash
cd /var/www/water-iujo/frontend
npm install
npm run build
```
Esto generará una carpeta llamada `dist/`.

---

## 🛡️ 4. Configuración de Nginx (Reverse Proxy)

Nginx actuará como el punto de entrada a tu aplicación. Servirá los archivos estáticos de la carpeta `dist/` en la ruta principal (`/`), y enviará cualquier petición dirigida a `/api` hacia tu Backend gestionado por PM2.

Crea o edita el archivo de configuración en `/etc/nginx/sites-available/water-iujo`:

```nginx
server {
    listen 80;
    server_name tudominio.com www.tudominio.com; # Cambia por tu dominio o IP pública

    # 1. Servir el Frontend Vue.js
    location / {
        root /var/www/water-iujo/frontend/dist;
        index index.html;
        # Esto es crucial para Vue Router (modo history)
        try_files $uri $uri/ /index.html;
    }

    # 2. Reverse Proxy para el Backend (Node.js)
    location /api/ {
        proxy_pass http://localhost:4000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Permitir CORS (opcional si ambos están bajo el mismo dominio exacto)
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE';
        add_header 'Access-Control-Allow-Headers' 'X-Requested-With,Accept,Content-Type, Origin, Authorization, x-user-role';
    }
}
```

Habilita el sitio y reinicia Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/water-iujo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🗄️ 5. Mantenimiento y Base de Datos (Muy Importante)

### Backups de SQLite
Debido a que estamos usando **SQLite**, toda tu base de datos reside en un único archivo físico ubicado en `/var/www/water-iujo/backend/database.sqlite`.

**¡ADVERTENCIA CRÍTICA!**
Debes establecer una tarea programada (Cron Job) en tu servidor que copie este archivo diariamente a un almacenamiento seguro externo (AWS S3, Google Drive, DropBox, o incluso enviarlo por email) para evitar la pérdida total de datos en caso de falla del servidor.

Ejemplo de Cron Job para copiar el archivo de DB cada noche a medianoche:
```bash
0 0 * * * cp /var/www/water-iujo/backend/database.sqlite /ruta/de/backups/db_$(date +\%F).sqlite
```

### Actualizaciones futuras
Para actualizar la aplicación cuando subas nuevos cambios a git:
```bash
# 1. Traer cambios
git pull origin main

# 2. Actualizar Backend
cd backend
npm install
pm2 restart water-backend

# 3. Actualizar Frontend
cd ../frontend
npm install
npm run build
```