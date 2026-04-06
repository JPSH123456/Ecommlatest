from sqlalchemy import Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = "auth_users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=True) # Added for user identification
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="user") # e.g. user, admin
