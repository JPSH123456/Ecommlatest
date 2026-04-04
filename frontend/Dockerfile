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

# Expose port (default 80 inside the container)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
