function StarRating({ value = 0, onChange, size = "lg" }) {
  const stars = [1, 2, 3, 4, 5];
  const sizeCls = size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-base";

  return (
    <div className={`inline-flex items-center gap-1 ${sizeCls}`}>
      {stars.map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`Rate ${n} star`}
          onClick={() => onChange?.(n)}
          className="text-[#f5c518]"
        >
          <i
            className={
              n <= value ? "fa-solid fa-star" : "fa-regular fa-star"
            }
          ></i>
        </button>
      ))}
    </div>
  );
}
export default StarRating;
