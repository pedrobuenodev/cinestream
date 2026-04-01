import { useState, useEffect, useCallback } from 'react';
import { watchlistService } from '@/services/movies.service';
import { useAuth } from './useAuth';

export function useWatchlist() {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWatchlist = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await watchlistService.getAll();
      setWatchlist(data);
    } catch {
      setWatchlist([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const isInWatchlist = useCallback(
    (movieId) => watchlist.some((m) => m.id === movieId),
    [watchlist]
  );

  const toggle = useCallback(
    async (movieId) => {
      if (!user) return;
      const inList = isInWatchlist(movieId);
      try {
        if (inList) {
          await watchlistService.remove(movieId);
          setWatchlist((prev) => prev.filter((m) => m.id !== movieId));
        } else {
          await watchlistService.add(movieId);
          await fetchWatchlist();
        }
      } catch (err) {
        console.error('Watchlist toggle error:', err);
      }
    },
    [user, isInWatchlist, fetchWatchlist]
  );

  return { watchlist, loading, isInWatchlist, toggle, refetch: fetchWatchlist };
}
