from pydantic import BaseModel

class WishlistItemBase(BaseModel):
    product_id: int

class WishlistItemCreate(WishlistItemBase):
    pass

class WishlistItemResponse(WishlistItemBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
