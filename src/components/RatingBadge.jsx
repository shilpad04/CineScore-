function RatingBadge({ value = 0 }) {
  if (!value) {
    return (
      <div className="text-neutral-400 text-sm flex items-center gap-1">
        <i className="fa-regular fa-star"></i>
        <span>Unrated</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1 text-sm">
      <i className="fa-solid fa-star text-[#f5c518]"></i>
      <span>{value.toFixed(1)}</span>
    </div>
  );
}
export default RatingBadge;
