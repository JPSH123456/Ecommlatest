# E-Comm Cluster Troubleshooting Guide

This document captures the key troubleshooting steps and resolutions for the E-Comm microservices architecture. Use this as a reference for production-level maintenance.

---

## 1. Mixed Content & HTTPS (Frontend ↔ Backend)

> [!WARNING]
> **Issue**: Browser blocks "insecure" HTTP requests from a "secure" HTTPS frontend.
> **Fix**: 
> 1. Force HTTPS in the API Gateway middleware (`X-Forwarded-Proto`).
> 2. Redirect `http` to `https` in the Ingress controller.
> 3. Update React frontend to use `https://api.puneetdevops.online` for all fetch calls.

---

## 2. API Gateway Routing (No Service Found)

> [!CAUTION]
> **Issue**: Requests to `/auth/login` returning 404 because Gateway didn't know which service to call.
> **Fix**:
> 1. Implement a dynamic `/{service_name}/{path:path}` route in FastAPI.
> 2. Ensure `AUTH_SERVICE_URL` and other env variables are correctly set in the Kubernetes deployment.
> 3. Verify internal DNS (`http://auth-service:8001`) is resolving within the cluster.

---

## 3. Database Connectivity (Azure SQL)

> [!IMPORTANT]
> **Issue**: Microservices failing to connect to Azure SQL Server.
> **Fix**:
> 1. Whitelist the Kubernetes cluster's **Outbound IP Address** in the Azure portal firewall settings.
> 2. Use `pyodbc` with a persistent connection string.
> 3. Ensure the `DB_PASSWORD` is injected via Kubernetes Secrets.

---

## 4. Monitoring (Prometheus/Grafana)

> [!NOTE]
> **Issue**: Difficulty in tracking system health and API latency.
> **Fix**:
> 1. Instrument all FastAPI services with `prometheus-fastapi-instrumentator`.
> 2. Expose `/metrics` endpoint.
> 3. Add `scrape_configs` to Prometheus for internal Kubernetes services.

---

## 5. Persistent Storage & PVC (Azure File Share)

> [!IMPORTANT]
> **Issue**: Storing user files (videos/images) without losing them after pod restarts.
> **Fix**:
> 1. Use **Azure File Share (SMB)** for shared storage across multiple microservices.
> 2. Define a `StorageClass` with `azurefile-csi` driver.
> 3. Mount the PVC to the `vault-service` at a consistent mount point.

---
*Created by Puneet Kumar - Production Engineering*
