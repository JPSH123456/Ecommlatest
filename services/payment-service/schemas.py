from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PaymentCreate(BaseModel):
    order_id: int
    amount: float

class PaymentResponse(BaseModel):
    id: int
    order_id: int
    user_id: int
    amount: float
    status: str
    transaction_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class WalletDeposit(BaseModel):
    amount: float

class WalletResponse(BaseModel):
    id: int
    user_id: int
    balance: float
    updated_at: datetime
    
    class Config:
        from_attributes = True
