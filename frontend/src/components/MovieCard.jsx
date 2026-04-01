import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FiPlay, FiPlus, FiCheck, FiInfo } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useWatchlist } from '@/hooks/useWatchlist';
import { formatRating, formatDuration } from '@/utils/helpers';

export default function MovieCard({ movie }) {
  const router = useRouter();
  const { user } = useAuth();
  const { isInWatchlist, toggle } = useWatchlist();
  const [toggling, setToggling] = useState(false);
  const [imgError, setImgError] = useState(false);

  const inList = isInWatchlist(movie.id);

  const handleWatchlist = async (e) => {
    e.stopPropagation();
    if (!user) return router.push('/login');
    setToggling(true);
    await toggle(movie.id);
    setToggling(false);
  };

  const goToDetail = () => router.push(`/movies/${movie.id}`);

  return (
    <div
      className="group relative rounded-md overflow-hidden cursor-pointer shrink-0
                 w-[160px] md:w-[200px] lg:w-[220px]
                 transition-all duration-300 ease-out
                 hover:scale-105 hover:z-20 hover:shadow-2xl"
      onClick={goToDetail}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && goToDetail()}
      aria-label={`View ${movie.title}`}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] bg-cine-card">
        {movie.poster_url && !imgError ? (
          <Image
            src={movie.poster_url}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 160px, 220px"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 p-3">
            <span className="text-3xl mb-2">🎬</span>
            <span className="text-xs text-center text-gray-400 line-clamp-2">{movie.title}</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300" />

        {/* Hover actions */}
        <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={(e) => { e.stopPropagation(); goToDetail(); }}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors"
              title="Play"
            >
              <FiPlay size={14} fill="black" color="black" />
            </button>

            <button
              onClick={handleWatchlist}
              disabled={toggling}
              className="w-8 h-8 rounded-full bg-white/20 border border-white/50 flex items-center justify-center hover:bg-white/30 transition-colors disabled:opacity-50"
              title={inList ? 'Remove from list' : 'Add to list'}
            >
              {inList
                ? <FiCheck size={14} className="text-green-400" />
                : <FiPlus size={14} className="text-white" />
              }
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); goToDetail(); }}
              className="w-8 h-8 rounded-full bg-white/20 border border-white/50 flex items-center justify-center hover:bg-white/30 transition-colors ml-auto"
              title="More info"
            >
              <FiInfo size={14} className="text-white" />
            </button>
          </div>

          {/* Mini info */}
          <div className="bg-cine-card rounded-b-md px-2 py-1.5">
            <p className="text-white text-xs font-medium truncate">{movie.title}</p>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
              <span className="text-green-400">⭐ {formatRating(movie.rating)}</span>
              <span>{movie.year}</span>
              {movie.duration && <span>{formatDuration(movie.duration)}</span>}
            </div>
            {movie.category && (
              <span className="inline-block mt-1 text-xs bg-white/10 px-1.5 py-0.5 rounded text-gray-300">
                {movie.category.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Title below (always visible) */}
      <div className="p-2">
        <p className="text-gray-200 text-xs font-medium truncate group-hover:text-white transition-colors">
          {movie.title}
        </p>
        <p className="text-gray-500 text-xs">{movie.year}</p>
      </div>
    </div>
  );
}
