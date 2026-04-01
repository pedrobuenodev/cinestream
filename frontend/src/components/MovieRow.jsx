import { useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import MovieCard from './MovieCard';

export default function MovieRow({ title, movies = [] }) {
  const rowRef = useRef(null);

  if (!movies.length) return null;

  const scroll = (dir) => {
    if (!rowRef.current) return;
    const amount = dir === 'left' ? -600 : 600;
    rowRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <section className="px-4 md:px-10 mb-10 animate-slide-up">
      <h2
        className="text-lg md:text-xl font-semibold text-gray-200 mb-4 tracking-wide"
      >
        {title}
      </h2>

      <div className="relative group/row">
        {/* Left arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-2
                     w-10 h-full bg-black/60 flex items-center justify-center
                     opacity-0 group-hover/row:opacity-100 transition-opacity
                     hover:bg-black/80"
          aria-label="Scroll left"
        >
          <FiChevronLeft size={24} className="text-white" />
        </button>

        {/* Scrollable row */}
        <div
          ref={rowRef}
          className="flex gap-3 overflow-x-auto hide-scrollbar pb-2"
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-2
                     w-10 h-full bg-black/60 flex items-center justify-center
                     opacity-0 group-hover/row:opacity-100 transition-opacity
                     hover:bg-black/80"
          aria-label="Scroll right"
        >
          <FiChevronRight size={24} className="text-white" />
        </button>
      </div>
    </section>
  );
}
