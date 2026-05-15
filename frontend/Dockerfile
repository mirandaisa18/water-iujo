# Etapa 1: Construcción del Frontend con Vite
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código del frontend
COPY . .

# Inyectar variable de entorno para que apunte a la API de producción
# (En Docker Compose Nginx servirá todo bajo el mismo host, así que la ruta relativa funciona)
ENV VITE_API_URL=/api

# Compilar para producción
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine

# Limpiar carpeta de html por defecto
RUN rm -rf /usr/share/nginx/html/*

# Copiar los estáticos compilados
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
