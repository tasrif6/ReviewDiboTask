from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import Review
from schema import ReviewCreate, ReviewUpdate
from auth_utils import get_current_user

router = APIRouter(prefix="/api/reviews", tags=["Reviews"])


@router.post("", status_code=201)
def create_review(data: ReviewCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    if not 1 <= data.rating <= 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    
    # Check if user already reviewed this product
    existing_review = db.query(Review).filter(
        Review.product_id == data.product_id,
        Review.user_id == current_user.id
    ).first()
    if existing_review:
        raise HTTPException(status_code=400, detail="You have already reviewed this product. You can delete your existing review to submit a new one.")

    review = Review(
        product_id=data.product_id,
        user_id=current_user.id,
        rating=data.rating,
        comment=data.comment
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return {"id": review.id, "message": "Review created"}


@router.put("/{review_id}")
def update_review(review_id: int, data: ReviewUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if review.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="You do not have permission to modify this review")
        
    if data.rating is not None:
        if not 1 <= data.rating <= 5:
            raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
        review.rating = data.rating
    if data.comment is not None:
        review.comment = data.comment
    db.commit()
    return {"message": "Review updated"}


@router.delete("/{review_id}")
def delete_review(review_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if review.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="You do not have permission to delete this review")
        
    db.delete(review)
    db.commit()
    return {"message": "Review deleted"}