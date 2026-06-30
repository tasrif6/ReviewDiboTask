"use client";
import { useState } from "react";
import StarRating from "./StarRating";

export default function ReviewList({
  reviews,
  currentUser,
  onDeleteReview,
  onUpdateReview,
}) {
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  const startEdit = (review) => {
    setEditingReviewId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment || "");
  };

  const cancelEdit = () => {
    setEditingReviewId(null);
    setEditRating(5);
    setEditComment("");
  };

  const saveEdit = async (reviewId) => {
    try {
      await onUpdateReview(reviewId, {
        rating: Number(editRating),
        comment: editComment.trim() || null,
      });
      cancelEdit();
    } catch (error) {
      alert(error.message || "Failed to update review");
    }
  };

  if (reviews.length === 0) {
    return (
      <p className="text-gray-500 text-sm">
        No reviews yet. Be the first to write one!
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {reviews.map((r) => {
        const canManage =
          currentUser && (currentUser.is_admin || currentUser.id === r.user.id);
        const isEditing = editingReviewId === r.id;

        return (
          <div
            key={r.id}
            className="border rounded-xl p-4 bg-white shadow-sm flex flex-col gap-1 relative"
          >
            <div className="flex items-center justify-between pr-24">
              <span className="font-semibold text-sm text-gray-800">
                {r.user.name}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(r.created_at).toLocaleDateString()}
              </span>
            </div>

            {isEditing ? (
              <div className="mt-2 flex flex-col gap-2">
                <div className="flex">
                  <select
                    value={editRating}
                    onChange={(e) => setEditRating(Number(e.target.value))}
                    className="border rounded-lg px-2 py-2 text-sm bg-white text-black"
                  >
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating} ⭐
                      </option>
                    ))}
                  </select>
                </div>

                <textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  rows={3}
                  className="border rounded-lg px-3 py-2 text-sm resize-none bg-white text-black"
                  placeholder="Update your review comment"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(r.id)}
                    className="bg-emerald-700 text-white text-xs font-semibold px-2.5 py-1 rounded cursor-pointer transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded cursor-pointer transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mt-0.5">
                  <StarRating rating={r.rating} />
                </div>

                {r.comment && (
                  <p className="text-gray-700 text-sm mt-1">{r.comment}</p>
                )}
              </>
            )}

            {canManage && !isEditing && (
              <div className="top-4 right-4 flex gap-2">
                <button
                  onClick={() => startEdit(r)}
                  className="bg-emerald-700 text-white text-xs font-semibold px-2.5 py-1 rounded cursor-pointer transition"
                >
                  Update
                </button>
                <button
                  onClick={() => onDeleteReview(r.id)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 text-xs font-semibold px-2.5 py-1 rounded cursor-pointer transition border border-red-200"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
