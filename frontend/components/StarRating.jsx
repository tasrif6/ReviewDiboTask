export default function StarRating({ rating }) {
  const rounded = Math.round(rating);
  return (
    <div className="flex text-amber-400 text-sm">
      {"★".repeat(rounded)}
      {"☆".repeat(5 - rounded)}
    </div>
  );
}
