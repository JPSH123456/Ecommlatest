from pydantic import BaseModel
from typing import Optional

class ReviewCreate(BaseModel):
    product_id: int
    rating: int
    comment: Optional[str] = None

class ReviewResponse(ReviewCreate):
    id: int
    user_id: int

    class Config:
        from_attributes = True
