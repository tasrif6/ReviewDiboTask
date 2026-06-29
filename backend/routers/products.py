from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Product, Review
from schema import ProductOut, ProductDetail, ProductCreate
from auth_utils import get_current_admin

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


@router.post("", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(data: ProductCreate, db: Session = Depends(get_db), current_admin=Depends(get_current_admin)):
    new_product = Product(
        title=data.title,
        description=data.description,
        image_url=data.image_url
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return ProductOut(
        id=new_product.id,
        title=new_product.title,
        description=new_product.description,
        image_url=new_product.image_url,
        average_rating=None,
        review_count=0
    )


@router.delete("/{product_id}", status_code=status.HTTP_200_OK)
def delete_product(product_id: int, db: Session = Depends(get_db), current_admin=Depends(get_current_admin)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}