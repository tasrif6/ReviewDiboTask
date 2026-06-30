"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getProduct,
  getCurrentUser,
  deleteReview,
  updateReview,
} from "@/lib/api";
import StarRating from "@/components/StarRating";
import ReviewList from "@/components/ReviewList";
import ReviewForm from "@/components/ReviewForm";
import Link from "next/link";

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProduct(id);
      setProduct(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setUser(getCurrentUser());
    fetchProduct();
  }, [fetchProduct]);

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }
    try {
      await deleteReview(reviewId);
      // Refresh product reviews
      await fetchProduct();
    } catch (err) {
      alert("Failed to delete review: " + err.message);
    }
  };

  const handleUpdateReview = async (reviewId, updatedData) => {
    try {
      await updateReview(reviewId, updatedData);
      await fetchProduct();
    } catch (err) {
      alert("Failed to update review: " + err.message);
    }
  };

  if (loading)
    return (
      <div className="text-center py-20 text-gray-500">Loading product...</div>
    );
  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{error}</p>
        <Link href="/" className="text-blue-600 hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }
  if (!product) return null;

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="text-blue-600 text-sm hover:underline mb-6 inline-block"
      >
        ← Back to Products
      </Link>

      {/* Product Info */}
      <div className="bg-white border rounded-xl p-6 mb-8 shadow-sm">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-64 object-cover rounded-xl mb-4 text-black"
          />
        ) : (
          <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-400 font-semibold rounded-xl mb-4">
            No Image Available
          </div>
        )}
        <h1 className="text-2xl font-bold text-black">{product.title}</h1>
        {product.description && (
          <p className="text-gray-600 mt-2">{product.description}</p>
        )}
        <div className="flex items-center gap-2 mt-3">
          <StarRating rating={product.average_rating || 0} />
          <span className="text-sm text-gray-500">
            {product.average_rating
              ? `${product.average_rating} out of 5`
              : "No rating yet"}{" "}
            · {product.reviews ? product.reviews.length : 0} reviews
          </span>
        </div>
      </div>

      {/* Review Form or Login */}
      <div className="mb-8">
        {user ? (
          <ReviewForm productId={product.id} onSuccess={fetchProduct} />
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center text-sm">
            <p className="text-gray-700 mb-3">
              You must be logged in to write a review for this product.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-white border border-gray-300 text-gray-700 px-4 py-1.5 rounded-lg hover:bg-gray-50 transition font-semibold"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Reviews */}
      <div>
        <h2 className="text-xl font-semibold mb-4">All Reviews</h2>
        <ReviewList
          reviews={product.reviews || []}
          currentUser={user}
          onDeleteReview={handleDeleteReview}
          onUpdateReview={handleUpdateReview}
        />
      </div>
    </main>
  );
}
