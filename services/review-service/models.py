from sqlalchemy import Column, Integer, String, Text
from database import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, index=True, nullable=False)
    user_id = Column(Integer, index=True, nullable=False)
    rating = Column(Integer, nullable=False) # 1-5
    comment = Column(Text, nullable=True)
