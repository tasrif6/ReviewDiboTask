from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, CheckConstraint, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    reviews = relationship("Review", back_populates="user", cascade="all, delete")


class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    image_url = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    reviews = relationship("Review", back_populates="product", cascade="all, delete")


class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    __table_args__ = (
        CheckConstraint("rating >= 1 AND rating <= 5", name="rating_check"),
    )

    product = relationship("Product", back_populates="reviews")
    user = relationship("User", back_populates="reviews")