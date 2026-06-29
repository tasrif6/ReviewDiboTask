from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr

class UserOut(BaseModel):
    id: int
    name: str
    class Config:
        from_attributes = True

class ReviewCreate(BaseModel):
    product_id: int
    user_id: int
    rating: int  # 1-5
    comment: Optional[str] = None

class ReviewUpdate(BaseModel):
    rating: Optional[int] = None
    comment: Optional[str] = None

class ReviewOut(BaseModel):
    id: int
    user: UserOut
    rating: int
    comment: Optional[str]
    created_at: datetime
    class Config:
        from_attributes = True

class ProductOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    image_url: Optional[str]
    average_rating: Optional[float]
    review_count: int
    class Config:
        from_attributes = True

class ProductDetail(BaseModel):
    id: int
    title: str
    description: Optional[str]
    image_url: Optional[str]
    average_rating: Optional[float]
    reviews: List[ReviewOut]
    class Config:
        from_attributes = True