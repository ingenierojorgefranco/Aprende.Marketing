FROM node:18

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# 1. Instalar dependencias del frontend (raíz)
COPY package*.json ./
RUN npm install

# 2. Instalar dependencias del backend
COPY backend/package*.json backend/
RUN cd backend && npm install --production

# 3. Copiar todo el código del proyecto
COPY . .

# 4. Construir el frontend con Vite (genera /dist)
RUN npm run build

# 5. Configurar puerto para Cloud Run
ENV PORT=8080
EXPOSE 8080

# 6. Arrancar el servidor de Express
CMD ["node", "backend/server.js"]
