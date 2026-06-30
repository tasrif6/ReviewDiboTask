"use client";
import { useState } from "react";
import { createReview } from "@/lib/api";

export default function ReviewForm({ productId, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createReview({
        product_id: Number(productId),
        rating: Number(rating),
        comment: comment.trim() || null,
      });
      setComment("");
      setRating(5);
      onSuccess(); // refresh reviews
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 bg-white border rounded-xl p-5 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-black">Write a Review</h3>

      <div className="flex gap-1">
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border rounded-lg px-3 py-2 text-sm bg-white text-black"
        >
          {[5, 4, 3, 2, 1].map((r) => {
            <option key={r} value={r}>
              {r} {"⭐"}
            </option>;
          })}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Comment</label>
        <textarea
          placeholder="What did you like or dislike about this product?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="border rounded-lg px-3 py-2 text-sm resize-none bg-white text-black"
        />
      </div>

      {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white py-2 rounded-lg hover:bg-emerald-800 transition text-sm font-semibold disabled:opacity-50 cursor-pointer"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
