import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { useAuth } from '@/hooks/useAuth';
import { useWatchlist } from '@/hooks/useWatchlist';

export default function WatchlistPage() {
  const { user, loading: authLoading } = useAuth();
  const { watchlist, loading } = useWatchlist();
  const router = useRouter();

  // Protect route
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) return <LoadingSpinner fullScreen />;

  return (
    <>
      <Head><title>My List — CineStream</title></Head>

      <div className="min-h-screen bg-cine-dark">
        <Navbar />

        <div className="pt-24 px-4 md:px-10 pb-20">
          <div className="mb-8">
            <h1
              className="text-4xl font-bold text-white mb-2"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              My List
            </h1>
            <p className="text-gray-400 text-sm">
              {watchlist.length} {watchlist.length === 1 ? 'title' : 'titles'} saved
            </p>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : watchlist.length === 0 ? (
            <EmptyState
              icon="📋"
              title="Your list is empty"
              description="Add movies and series you want to watch later by clicking the + button on any title."
              actionLabel="Browse Content"
              actionHref="/"
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-fade-in">
              {watchlist.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
