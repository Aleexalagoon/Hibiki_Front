# Build stage
FROM node:20-alpine as build-stage

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY Hibiki/package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY Hibiki/ .

# Build the app
RUN npm run build

# Production stage
FROM nginx:stable-alpine as production-stage

# Copy built files from build stage to nginx serve directory
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy custom nginx config if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]