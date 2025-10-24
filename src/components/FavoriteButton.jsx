function FavoriteButton({ active, onClick, size = "md", className = "" }) {
  const icon = active ? "fa-solid fa-heart" : "fa-regular fa-heart";
  const sizeCls = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-xl";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center ${sizeCls} text-[#f5c518] hover:opacity-90 ${className}`}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      title={active ? "Remove from favorites" : "Add to favorites"}
    >
      <i className={icon}></i>
    </button>
  );
}
export default FavoriteButton;
