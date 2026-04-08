from fastapi import Request, HTTPException, status
import os
from jose import JWTError, jwt

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "my_super_secret_jwt_key_12345")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

def verify_token(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid token"
        )
    
    token = auth_header.split(" ")[1]
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
