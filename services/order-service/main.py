import os
from azure.monitor.opentelemetry import configure_azure_monitor

# Configure Azure Monitor for Application Insights
connection_string = os.getenv("APPLICATIONINSIGHTS_CONNECTION_STRING")
if connection_string:
    configure_azure_monitor(connection_string=connection_string)

from fastapi import FastAPI, HTTPException, Depends, Request, status
from sqlalchemy import create_engine, Column, Integer, Float, String, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, Session, relationship
from prometheus_fastapi_instrumentator import Instrumentator
from typing import List

# ---------------------------
# Database setup
# ---------------------------
import models, security
from database import engine, SessionLocal, Base, get_db

# ---------------------------
# Schemas
# ---------------------------
from pydantic import BaseModel

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int
    price: float

class OrderCreate(BaseModel):
    total_amount: float
    items: List[OrderItemCreate]

class OrderItemResponse(OrderItemCreate):
    id: int
    class Config:
        orm_mode = True

class OrderResponse(BaseModel):
    id: int
    user_id: int
    total_amount: float
    status: str
    items: List[OrderItemResponse]
    class Config:
        orm_mode = True

# ---------------------------
# Auto-create tables
# ---------------------------
Base.metadata.create_all(bind=engine)

# ---------------------------
# FastAPI App
# ---------------------------
app = FastAPI(title="Order Service")

# Extract user_id from JWT token
def get_user_id(request: Request) -> int:
    try:
        user_payload = security.verify_token(request)
        return user_payload.get("id")
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")

# Health check
@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/")
async def root():
    return {"service": "Order Service", "status": "online"}

# ---------------------------
# CRUD endpoints
# ---------------------------
@app.get("/orders", response_model=List[OrderResponse])
def get_orders(request: Request, db: Session = Depends(get_db)):
    user_id = get_user_id(request)
    orders = db.query(models.Order).filter(models.Order.user_id == user_id).all()
    return orders

@app.get("/orders/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, request: Request, db: Session = Depends(get_db)):
    user_id = get_user_id(request)
    order = db.query(models.Order).filter(models.Order.id == order_id, models.Order.user_id == user_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@app.post("/orders", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(order_in: OrderCreate, request: Request, db: Session = Depends(get_db)):
    user_id = get_user_id(request)
    new_order = models.Order(user_id=user_id, total_amount=order_in.total_amount)
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    for item in order_in.items:
        new_item = models.OrderItem(
            order_id=new_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.price
        )
        db.add(new_item)
    db.commit()
    db.refresh(new_order)
    return new_order

@app.put("/orders/{order_id}/status")
def update_order_status(order_id: int, status_in: str, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = status_in
    db.commit()
    return {"detail": "Order status updated", "new_status": order.status}

@app.get("/admin/orders", response_model=List[OrderResponse])
def get_all_orders(db: Session = Depends(get_db), admin: dict = Depends(security.verify_admin)):
    orders = db.query(models.Order).all()
    return orders

# ---------------------------
# Prometheus metrics
# ---------------------------
Instrumentator().instrument(app).expose(app)