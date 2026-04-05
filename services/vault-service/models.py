from sqlalchemy import Column, Integer, String, DateTime, Float
from datetime import datetime
from database import Base

class VaultFile(Base):
    __tablename__ = "vault_files"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String(100), index=True)
    filename = Column(String(255))
    file_type = Column(String(50))  # video, image, doc
    file_size = Column(Float)       # in MB
    storage_path = Column(String(500))
    upload_time = Column(DateTime, default=datetime.utcnow)
