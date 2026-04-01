import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FiPlay, FiInfo, FiPlus, FiCheck } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useWatchlist } from '@/hooks/useWatchlist';
import { truncate, formatDuration, formatRating } from '@/utils/helpers';

export default function Hero({ movie }) {
  const { user } = useAuth();
  const { isInWatchlist, toggle } = useWatchlist();
  const router = useRouter();
  const [toggling, setToggling] = useState(false);

  if (!movie) return null;

  const inList = isInWatchlist(movie.id);

  const handleWatchlist = async () => {
    if (!user) return router.push('/login');
    setToggling(true);
    await toggle(movie.id);
    setToggling(false);
  };

  return (
    <div className="relative w-full h-[92vh] min-h-[520px] overflow-hidden">
      {/* Backdrop */}
      {movie.backdrop_url ? (
        <Image
          src={movie.backdrop_url}
          alt={movie.title}
          fill
          className="object-cover object-top"
          priority
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-cine-dark" />
      )}

      {/* Gradients */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-bottom-fade" />
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-24 px-6 md:px-14 max-w-3xl">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-cine-red border border-cine-red px-2 py-0.5 rounded">
            {movie.type === 'series' ? 'Series' : 'Movie'}
          </span>
          {movie.category && (
            <span className="text-xs text-gray-400">{movie.category.name}</span>
          )}
        </div>

        {/* Title */}
        <h1
          className="text-5xl md:text-7xl font-bold text-white text-shadow mb-4 leading-none"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          {movie.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
          <span className="text-green-400 font-semibold">⭐ {formatRating(movie.rating)}</span>
          <span>{movie.year}</span>
          {movie.duration && <span>{formatDuration(movie.duration)}</span>}
        </div>

        {/* Description */}
        <p className="text-gray-300 text-base leading-relaxed mb-6 max-w-xl">
          {truncate(movie.description, 180)}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => router.push(`/movies/${movie.id}`)}
            className="flex items-center gap-2 bg-white text-black font-semibold px-7 py-3 rounded-md hover:bg-gray-200 transition-colors text-sm"
          >
            <FiPlay fill="black" size={16} /> Play
          </button>

          <button
            onClick={() => router.push(`/movies/${movie.id}`)}
            className="flex items-center gap-2 bg-white/20 backdrop-blur text-white font-semibold px-7 py-3 rounded-md hover:bg-white/30 transition-colors text-sm border border-white/20"
          >
            <FiInfo size={16} /> More Info
          </button>

          <button
            onClick={handleWatchlist}
            disabled={toggling}
            className="flex items-center gap-2 bg-white/10 backdrop-blur text-white px-4 py-3 rounded-md hover:bg-white/20 transition-colors text-sm border border-white/20 disabled:opacity-50"
            title={inList ? 'Remove from My List' : 'Add to My List'}
          >
            {inList ? <FiCheck size={16} className="text-green-400" /> : <FiPlus size={16} />}
            {inList ? 'In My List' : 'My List'}
          </button>
        </div>
      </div>
    </div>
  );
}
