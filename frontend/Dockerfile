# Stage 1: Build the React application
FROM node:22-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Replace default Nginx config to support SPA fallback routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add entrypoint script for dynamic env injection
COPY entrypoint.sh /usr/share/nginx/html/entrypoint.sh
RUN chmod +x /usr/share/nginx/html/entrypoint.sh

# Expose port (default 80 inside the container)
EXPOSE 80

# Use the entrypoint script to generate env-config.js before starting Nginx
ENTRYPOINT ["/usr/share/nginx/html/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
