from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    full_name: str | None = None
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    full_name: str | None = None
    email: EmailStr
    hashed_password: str | None = None # Exposed for admin view as requested
    role: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None
