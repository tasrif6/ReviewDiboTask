from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Product, Review
from schema import ProductOut, ProductDetail, ReviewOut

router = APIRouter(prefix="/api/products", tags=["Products"])


@router.get("", response_model=list[ProductOut])
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    result = []
    for p in products:
        avg = db.query(func.avg(Review.rating)).filter(Review.product_id == p.id).scalar()
        count = db.query(func.count(Review.id)).filter(Review.product_id == p.id).scalar()
        result.append(ProductOut(
            id=p.id,
            title=p.title,
            description=p.description,
            image_url=p.image_url,
            average_rating=round(avg, 1) if avg else None,
            review_count=count or 0
        ))
    return result


@router.get("/{product_id}", response_model=ProductDetail)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    avg = db.query(func.avg(Review.rating)).filter(Review.product_id == product_id).scalar()
    return ProductDetail(
        id=product.id,
        title=product.title,
        description=product.description,
        image_url=product.image_url,
        average_rating=round(avg, 1) if avg else None,
        reviews=product.reviews
    )