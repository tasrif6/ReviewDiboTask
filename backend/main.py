from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import products, review, auth

Base.metadata.create_all(bind=engine)  # auto-creates tables

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def root_function():
    return {"status": "Backend is successfully running"}
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(review.router)