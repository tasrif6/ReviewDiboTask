import Link from "next/link";
import StarRating from "./StarRating";

export default function ProductCard({ product, isAdmin, onDelete }) {
  return (
    <div className="border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white flex flex-col gap-2 relative">
      {isAdmin && (
        <button
          onClick={() => onDelete(product.id)}
          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-2.5 py-1 rounded cursor-pointer transition shadow"
        >
          Delete
        </button>
      )}

      {product.image_url ? (
        <img
          src={product.image_url}
          alt={product.title}
          className="w-full h-40 object-cover rounded-lg mb-2 text-gray-800"
        />
      ) : (
        <div className="w-full h-40 bg-black flex items-center justify-center text-black font-semibold rounded-lg mb-2">
          No Image
        </div>
      )}

      <h2 className="text-lg font-semibold pr-16 truncate text-gray-800">
        {product.title}
      </h2>

      <div className="flex items-center gap-2">
        <StarRating rating={product.average_rating || 0} />
        <span className="text-sm text-black">
          {product.average_rating ? product.average_rating : "No"} ·{" "}
          {product.review_count} reviews
        </span>
      </div>

      {product.description && (
        <p className="text-sm text-gray-800 line-clamp-2 mt-1 mb-2">
          {product.description}
        </p>
      )}

      <Link
        href={`/products/${product.id}`}
        className="mt-auto text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
      >
        View Details
      </Link>
    </div>
  );
}
