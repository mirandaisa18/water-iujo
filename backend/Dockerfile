# Etapa 1: Construcción
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copiar configuración de dependencias
COPY package*.json ./
COPY tsconfig.json ./

# Instalar TODAS las dependencias (incluidas devDependencies para compilar TS)
RUN npm install

# Copiar el código fuente
COPY src/ ./src/

# Compilar TypeScript a JavaScript
# Nota: Instalamos typescript globalmente solo para este paso si ts-node no compila la carpeta
RUN npx tsc

# Etapa 2: Producción
FROM node:18-alpine

WORKDIR /usr/src/app

# Copiar solo el package.json
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm install --only=production

# Copiar el código compilado desde la etapa anterior
COPY --from=builder /usr/src/app/dist ./dist

# Asegurar que el directorio de la base de datos exista
RUN mkdir -p /usr/src/app/data

# Definir variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=4000
ENV DB_STORAGE=/usr/src/app/data/database.sqlite

# Exponer el puerto
EXPOSE 4000

# Comando para iniciar la aplicación compilada
CMD ["node", "dist/index.js"]
