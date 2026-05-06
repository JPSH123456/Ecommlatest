#!/bin/bash

# Build and push all Docker images to ACR with AMD platform
# ACR Registry: aksacr.azurecr.io
# Version: v1
# Platform: linux/amd64 (AMD/Intel x86_64)

set -e  # Exit on error

ACR="azacr.azurecr.io"
VERSION="v1"
PLATFORM="linux/amd64"

echo "============================================"
echo "Docker Build & Push to ACR"
echo "Platform: $PLATFORM"
echo "Registry: $ACR"
echo "Version: $VERSION"
echo "============================================"
echo ""

# Change to Ecomm directory
cd "$(dirname "$0")"

# Array of services to build
services=(
  "api-gateway"
  "auth-service"
  "cart-service"
  "order-service"
  "payment-service"
  "product-service"
  "review-service"
  "user-service"
  "vault-service"
  "wishlist-service"
)

# Build each service
for service in "${services[@]}"; do
  echo "================================================"
  echo "Building: $service"
  echo "================================================"
  
  SERVICE_PATH="services/$service"
  IMAGE_NAME="$ACR/$service:$VERSION"
  
  if [ ! -d "$SERVICE_PATH" ]; then
    echo "❌ ERROR: $SERVICE_PATH not found"
    continue
  fi
  
  if [ ! -f "$SERVICE_PATH/Dockerfile" ]; then
    echo "❌ ERROR: $SERVICE_PATH/Dockerfile not found"
    continue
  fi
  
  # Build Docker image with AMD platform
  echo "🔨 Building: $IMAGE_NAME (platform: $PLATFORM)"
  docker build --platform $PLATFORM -t $IMAGE_NAME $SERVICE_PATH
  
  # Push to ACR
  echo "📤 Pushing: $IMAGE_NAME"
  docker push $IMAGE_NAME
  
  echo "✅ $service completed!"
  echo ""
done

# Build and push frontend
if [ -f "frontend/Dockerfile" ]; then
  echo "================================================"
  echo "Building: frontend"
  echo "================================================"
  
  FRONTEND_IMAGE="$ACR/frontend:$VERSION"
  echo "🔨 Building: $FRONTEND_IMAGE (platform: $PLATFORM)"
  docker build --platform $PLATFORM -t $FRONTEND_IMAGE frontend/
  
  echo "📤 Pushing: $FRONTEND_IMAGE"
  docker push $FRONTEND_IMAGE
  
  echo "✅ frontend completed!"
else
  echo "⚠️  frontend/Dockerfile not found (skipping)"
fi

echo ""
echo "============================================"
echo "✅ ALL BUILDS AND PUSHES COMPLETED!"
echo "============================================"
echo ""
echo "Pushed images:"
for service in "${services[@]}"; do
  echo "  - $ACR/$service:$VERSION"
done
echo "  - $ACR/frontend:$VERSION (if exists)"
