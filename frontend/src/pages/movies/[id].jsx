import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  FiPlay, FiPlus, FiCheck, FiArrowLeft,
  FiStar, FiClock, FiCalendar, FiTag,
} from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { moviesService } from '@/services/movies.service';
import { useAuth } from '@/hooks/useAuth';
import { useWatchlist } from '@/hooks/useWatchlist';
import { formatDuration, formatRating } from '@/utils/helpers';

export default function MovieDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const { isInWatchlist, toggle } = useWatchlist();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    moviesService
      .getById(id)
      .then(setMovie)
      .catch(() => setError('Movie not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const inList = movie ? isInWatchlist(movie.id) : false;

  const handleWatchlist = async () => {
    if (!user) return router.push('/login');
    setToggling(true);
    await toggle(movie.id);
    setToggling(false);
  };

  if (loading) return <LoadingSpinner fullScreen />;

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-cine-dark">
        <Navbar />
        <div className="pt-20">
          <EmptyState
            icon="🎬"
            title="Movie not found"
            description={error}
            actionLabel="Back to Home"
            actionHref="/"
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{movie.title} — CineStream</title>
      </Head>

      <div className="min-h-screen bg-cine-dark">
        <Navbar />

        {/* Backdrop hero */}
        <div className="relative w-full h-[55vh] md:h-[65vh] overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-t from-cine-dark via-cine-dark/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-cine-dark/80 to-transparent" />

          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="absolute top-20 left-4 md:left-10 z-10 flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
          >
            <FiArrowLeft size={18} /> Back
          </button>
        </div>

        {/* Content */}
        <div className="relative z-10 -mt-40 px-4 md:px-14 pb-20 animate-slide-up">
          <div className="flex flex-col md:flex-row gap-8 max-w-5xl">
            {/* Poster */}
            <div className="shrink-0 w-40 md:w-56 self-start rounded-xl overflow-hidden shadow-2xl border border-white/10">
              {movie.poster_url ? (
                <Image
                  src={movie.poster_url}
                  alt={movie.title}
                  width={224}
                  height={336}
                  className="w-full object-cover"
                />
              ) : (
                <div className="aspect-[2/3] bg-cine-card flex items-center justify-center text-5xl">
                  🎬
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              {/* Badge */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-cine-red border border-cine-red px-2 py-0.5 rounded">
                  {movie.type === 'series' ? 'Series' : 'Movie'}
                </span>
                {movie.category && (
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-gray-300">
                    {movie.category.name}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1
                className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {movie.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
                <span className="flex items-center gap-1.5 text-yellow-400 font-semibold">
                  <FiStar fill="currentColor" size={14} />
                  {formatRating(movie.rating)} / 10
                </span>
                <span className="flex items-center gap-1.5">
                  <FiCalendar size={14} /> {movie.year}
                </span>
                {movie.duration && (
                  <span className="flex items-center gap-1.5">
                    <FiClock size={14} /> {formatDuration(movie.duration)}
                  </span>
                )}
                {movie.category && (
                  <span className="flex items-center gap-1.5">
                    <FiTag size={14} /> {movie.category.name}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-300 text-base leading-relaxed mb-8 max-w-2xl">
                {movie.description}
              </p>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                {movie.trailer_url ? (
                  <a
                    href={movie.trailer_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white text-black font-semibold px-8 py-3 rounded-md hover:bg-gray-200 transition-colors text-sm"
                  >
                    <FiPlay fill="black" size={16} /> Watch Trailer
                  </a>
                ) : (
                  <button className="flex items-center gap-2 bg-white text-black font-semibold px-8 py-3 rounded-md opacity-50 cursor-not-allowed text-sm">
                    <FiPlay fill="black" size={16} /> No Trailer Available
                  </button>
                )}

                <button
                  onClick={handleWatchlist}
                  disabled={toggling}
                  className={`flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-sm transition-colors border disabled:opacity-50 ${
                    inList
                      ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                      : 'bg-transparent border-white/40 text-white hover:bg-white/10'
                  }`}
                >
                  {toggling ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : inList ? (
                    <FiCheck size={16} className="text-green-400" />
                  ) : (
                    <FiPlus size={16} />
                  )}
                  {inList ? 'In My List' : 'Add to My List'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
