from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Review
from schema import ReviewCreate, ReviewUpdate

router = APIRouter(prefix="/api/reviews", tags=["Reviews"])


@router.post("", status_code=201)
def create_review(data: ReviewCreate, db: Session = Depends(get_db)):
    if not 1 <= data.rating <= 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    review = Review(**data.model_dump())
    db.add(review)
    db.commit()
    db.refresh(review)
    return {"id": review.id, "message": "Review created"}


@router.put("/{review_id}")
def update_review(review_id: int, data: ReviewUpdate, db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if data.rating is not None:
        if not 1 <= data.rating <= 5:
            raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
        review.rating = data.rating
    if data.comment is not None:
        review.comment = data.comment
    db.commit()
    return {"message": "Review updated"}


@router.delete("/{review_id}")
def delete_review(review_id: int, db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    db.delete(review)
    db.commit()
    return {"message": "Review deleted"}