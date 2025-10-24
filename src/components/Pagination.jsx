import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

function Pagination({ total, current }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [visibleCount, setVisibleCount] = useState(10); 

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) {
        setVisibleCount(4); 
      } else {
        setVisibleCount(10); 
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!total || total <= 1) return null;

  function go(p) {
    const pageClamped = Math.max(1, Math.min(total, p));
    const q = new URLSearchParams(params);
    q.set("page", String(pageClamped));
    navigate({ pathname: location.pathname, search: `?${q.toString()}` });
  }

  function getVisiblePages() {
    if (total <= visibleCount) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const half = Math.floor(visibleCount / 2);
    let start = current - half;
    let end = start + visibleCount - 1;

    if (start < 1) {
      start = 1;
      end = start + visibleCount - 1;
    }

    if (end > total) {
      end = total;
      start = end - visibleCount + 1;
      if (start < 1) start = 1;
    }

    const pages = [];
    for (let p = start; p <= end; p++) {
      pages.push(p);
    }
    return pages;
  }

  const pagesToShow = getVisiblePages();

  return (
    <div className="flex flex-wrap items-center gap-2 justify-center mt-6">
      {/* Prev */}
      <button
        className="px-2 py-1 rounded border border-neutral-700 hover:border-[#f5c518] text-xs sm:text-sm disabled:opacity-40 disabled:hover:border-neutral-700"
        onClick={() => go(current - 1)}
        disabled={current === 1}
      >
        «
      </button>

      {/* Page numbers */}
      {pagesToShow.map((p) => (
        <button
          key={p}
          onClick={() => go(p)}
          className={`px-2 py-1 rounded border text-xs sm:text-sm ${
            p === current
              ? "bg-[#f5c518] text-black border-[#f5c518]"
              : "border-neutral-700 hover:border-[#f5c518] text-white"
          }`}
        >
          {p}
        </button>
      ))}

      {/* Next */}
      <button
        className="px-2 py-1 rounded border border-neutral-700 hover:border-[#f5c518] text-xs sm:text-sm disabled:opacity-40 disabled:hover:border-neutral-700"
        onClick={() => go(current + 1)}
        disabled={current === total}
      >
        »
      </button>
    </div>
  );
}

export default Pagination;
