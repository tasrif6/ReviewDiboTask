import StarRating from "./StarRating";

export default function ReviewList({ reviews, currentUser, onDeleteReview }) {
  if (reviews.length === 0) {
    return <p className="text-gray-500 text-sm">No reviews yet. Be the first to write one!</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {reviews.map((r) => {
        // Can delete if logged-in user is admin OR if logged-in user is the author
        const canDelete = currentUser && (currentUser.is_admin || currentUser.id === r.user.id);

        return (
          <div key={r.id} className="border rounded-xl p-4 bg-white shadow-sm flex flex-col gap-1 relative">
            <div className="flex items-center justify-between pr-24">
              <span className="font-semibold text-sm text-gray-800">{r.user.name}</span>
              <span className="text-xs text-gray-400">
                {new Date(r.created_at).toLocaleDateString()}
              </span>
            </div>
            
            <div className="mt-0.5">
              <StarRating rating={r.rating} />
            </div>

            {r.comment && <p className="text-gray-700 text-sm mt-1">{r.comment}</p>}

            {canDelete && (
              <button
                onClick={() => onDeleteReview(r.id)}
                className="absolute top-4 right-4 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 text-xs font-semibold px-2.5 py-1 rounded cursor-pointer transition border border-red-200"
              >
                Delete
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
