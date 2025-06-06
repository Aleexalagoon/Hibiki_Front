# Etapa de construcción
FROM node:20-alpine as build-stage

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY Hibiki/package*.json ./

# Instalar dependencias
RUN npm install

# Copiar archivos del proyecto
COPY Hibiki/ .

# Construir solo con Vite, sin verificación de tipos
RUN npx vite build

# Etapa de producción
FROM nginx:stable-alpine as production-stage

# Copiar archivos construidos
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]