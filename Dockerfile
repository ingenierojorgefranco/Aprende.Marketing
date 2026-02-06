FROM node:18

WORKDIR /app

# Instalar dependencias del root
COPY package*.json ./
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Recibir la API KEY desde Cloud Build
ARG VITE_API_KEY
ENV VITE_API_KEY=$VITE_API_KEY

# Build del frontend (Vite)
RUN npm run build

# Config
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "backend/server.js"]
