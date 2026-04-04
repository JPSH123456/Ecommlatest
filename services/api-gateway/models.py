from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    ip_address = Column(String(50))
    method = Column(String(10))
    service_name = Column(String(50))
    path = Column(String(255))
    status_code = Column(Integer)
