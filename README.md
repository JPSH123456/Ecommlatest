# E-Commerce Microservices Platform

Welcome to our fully featured E-Commerce platform! This application provides a rich user interface and a powerful backend. It's built using modern microservices, meaning the system is split into small, manageable pieces for better performance and organization.

## What's Inside?

- **Frontend**: A beautiful, responsive user interface built with React and Vite. It is optimized for production and served lightning-fast via Nginx.
- **Backend Services**: 9 separate Python applications that handle everything from user accounts to processing orders. Each service has its own dedicated job.
- **Database**: A reliable Microsoft SQL Server database to safely store all your data.

## How to Run the Application

You can easily run the entire application on your computer using Docker. Docker packages everything up so you don't have to install any messy software on your own computer!

### Easiest Way (Docker Compose)

1. Make sure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
2. Open your terminal, navigate to this project folder, and run:
   ```bash
   docker-compose up --build
   ```
3. That's it! Wait a few minutes for all the services and the database to finish starting up.
4. **Access the Website**: Open your browser and go to `http://localhost:80` (or simply `http://localhost`). *Note: The port has been updated from 5173 to 80 for production readiness.*
5. **Access the Backend API**: The main entry point for the backend data is available at `http://localhost:8000`.

> 💡 **Tip**: The SQL Server database image requires about 2GB of RAM to run properly. Ensure your Docker settings allow for enough memory!

### Running with Kubernetes

If you want to run this in a more advanced, cloud-like environment using Kubernetes (for example, with Minikube):

1. **Build the Docker Images**:
   Point your terminal to Minikube's Docker environment and build the images:
   ```bash
   eval $(minikube docker-env)
   docker build -t frontend:latest ./frontend
   docker build -t api-gateway:latest ./services/api-gateway
   docker build -t auth-service:latest ./services/auth-service
   # ... (repeat this for all the remaining services in the services folder)
   ```

2. **Deploy Everything**:
   Apply the Kubernetes configuration files to start the cluster:
   ```bash
   kubectl apply -f k8s/deployments.yaml
   ```

## Recent Improvements

- **Global Audit Logging**: The API Gateway now features an integrated robust background logger that records every user request (IP, method, target service, timestamp, success status) directly to the Azure MSSQL database `audit_logs` table without adding any API latency.
- **Faster, Smaller Containers**: All services now use "multi-stage" Dockerfiles. This creates highly optimized, lightweight packages that start faster and take up less disk space.
- **Production-Ready UI**: The frontend is now packaged correctly for real-world usage, using Nginx instead of a slower development server.

Enjoy building and exploring your new e-commerce platform!
docker buildx build --no-cache --platform linux/amd64 -t aksacr.azurecr.io/wishlist-service:v2 --push .