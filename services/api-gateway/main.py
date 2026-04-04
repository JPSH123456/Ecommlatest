import os
from fastapi import FastAPI, Request, Response, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import httpx

from database import engine, Base, SessionLocal
from models import AuditLog

# Create DB tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="API Gateway")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Getting service URLs from env or using defaults
AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://auth-service:8001")
USER_SERVICE_URL = os.getenv("USER_SERVICE_URL", "http://user-service:8002")
PRODUCT_SERVICE_URL = os.getenv("PRODUCT_SERVICE_URL", "http://product-service:8003")
CART_SERVICE_URL = os.getenv("CART_SERVICE_URL", "http://cart-service:8004")
ORDER_SERVICE_URL = os.getenv("ORDER_SERVICE_URL", "http://order-service:8005")
PAYMENT_SERVICE_URL = os.getenv("PAYMENT_SERVICE_URL", "http://payment-service:8006")
REVIEW_SERVICE_URL = os.getenv("REVIEW_SERVICE_URL", "http://review-service:8007")
WISHLIST_SERVICE_URL = os.getenv("WISHLIST_SERVICE_URL", "http://wishlist-service:8008")

SERVICES = {
    "auth": AUTH_SERVICE_URL,
    "user": USER_SERVICE_URL,
    "product": PRODUCT_SERVICE_URL,
    "cart": CART_SERVICE_URL,
    "order": ORDER_SERVICE_URL,
    "payment": PAYMENT_SERVICE_URL,
    "review": REVIEW_SERVICE_URL,
    "wishlist": WISHLIST_SERVICE_URL,
}

def save_audit_log(ip_address: str, method: str, service_name: str, path: str, status_code: int):
    """Background task to safely save request logs without blocking the proxy"""
    db = SessionLocal()
    try:
        log_entry = AuditLog(
            ip_address=ip_address,
            method=method,
            service_name=service_name,
            path=path,
            status_code=status_code
        )
        db.add(log_entry)
        db.commit()
    except Exception as e:
        print(f"Failed to save audit log: {e}")
    finally:
        db.close()

@app.get("/health")
def health_check():
    return {"status": "gateway is live"}

# Example simple proxy logic
@app.api_route("/{service_name}/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
async def route_request(service_name: str, path: str, request: Request, background_tasks: BackgroundTasks):
    if service_name not in SERVICES:
        return Response(status_code=404, content="Service not found")
        
    url = f"{SERVICES[service_name]}/{path}"
    if not path:
        url = SERVICES[service_name]
    
    # Exclude specific headers that can cause issues when proxying
    excluded_headers = ["host", "content-length"]
    headers = {k: v for k, v in request.headers.items() if k.lower() not in excluded_headers}
    
    body = await request.body()
    client_ip = request.client.host if request.client else "unknown"
    
    async with httpx.AsyncClient() as client:
        try:
            proxy_response = await client.request(
                method=request.method,
                url=url,
                headers=headers,
                content=body,
                params=request.query_params
            )
            
            # Queue the background task to log the audit record
            background_tasks.add_task(
                save_audit_log,
                ip_address=client_ip,
                method=request.method,
                service_name=service_name,
                path=path,
                status_code=proxy_response.status_code
            )
            
            return Response(
                content=proxy_response.content,
                status_code=proxy_response.status_code,
                headers={k: v for k, v in proxy_response.headers.items() if k.lower() not in excluded_headers}
            )
        except httpx.RequestError as e:
            # Log the failure
            background_tasks.add_task(
                save_audit_log,
                ip_address=client_ip,
                method=request.method,
                service_name=service_name,
                path=path,
                status_code=503
            )
            return Response(status_code=503, content=f"Service unavailable: {str(e)}")
