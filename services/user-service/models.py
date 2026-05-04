from sqlalchemy import Column, Integer, String, Boolean
from database import Base

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, unique=True, index=True, nullable=False) # Maps to auth_users.id
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)
    address = Column(String(500), nullable=True)

class StreamingProfile(Base):
    __tablename__ = "streaming_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False) # Maps to auth_users.id
    name = Column(String(100), nullable=False)
    img = Column(String(500), nullable=True)
    isKids = Column(Boolean, default=False)
