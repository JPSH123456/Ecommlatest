#!/bin/bash

# Build and push all Docker images to ACR with Multi-arch support
ACR="aksacr1.azurecr.io"
VERSION="latest"
PLATFORM="linux/amd64,linux/arm64"

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

for service in "${services[@]}"; do
  echo "================================================"
  echo "Building: $service"
  echo "================================================"
  
  SERVICE_PATH="Ecomm/services/$service"
  IMAGE_NAME="$ACR/$service:$VERSION"
  
  docker buildx build --platform $PLATFORM -t $IMAGE_NAME $SERVICE_PATH --push
  
  echo "✅ $service completed!"
  echo ""
done

echo "============================================"
echo "✅ ALL BUILDS AND PUSHES COMPLETED!"
echo "============================================"
