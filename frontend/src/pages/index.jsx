import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MovieRow from '@/components/MovieRow';
import MovieCard from '@/components/MovieCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { moviesService, categoriesService } from '@/services/movies.service';

export default function Home() {
  const router = useRouter();
  const { search, type, category } = router.query;

  const [allMovies, setAllMovies] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Aguarda o router estar pronto antes de buscar
    if (!router.isReady) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { limit: 100 };
        if (search) params.search = search;
        if (type) params.type = type;
        if (category) params.category = category;

        const [moviesRes, catsRes] = await Promise.all([
          moviesService.getAll(params),
          categoriesService.getAll(),
        ]);

        setAllMovies(moviesRes.data || []);
        setCategories(catsRes || []);

        if (!search && !type && !category) {
          const featuredRes = await moviesService.getFeatured();
          setFeatured(featuredRes || []);
        }
      } catch (err) {
        setError('Failed to load content. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router.isReady, search, type, category]);

  const movieRows = useMemo(() => {
    if (search || type || category) return [];
    return categories
      .map((cat) => ({
        ...cat,
        movies: allMovies.filter((m) => m.category?.id === cat.id),
      }))
      .filter((cat) => cat.movies.length > 0);
  }, [allMovies, categories, search, type, category]);

  const heroMovie = featured[0] || allMovies[0] || null;
  const isFiltering = !!(search || type || category);

  const filterLabel = search
    ? `Results for "${search}"`
    : type === 'series'
    ? 'All Series'
    : type === 'movie'
    ? 'All Movies'
    : category
    ? categories.find((c) => c.id === parseInt(category))?.name || 'Category'
    : '';

  return (
    <>
      <Head>
        <title>CineStream — Watch Movies & Series</title>
      </Head>

      <div className="min-h-screen bg-cine-dark">
        <Navbar />

        {loading ? (
          <LoadingSpinner fullScreen />
        ) : error ? (
          <div className="flex items-center justify-center min-h-screen">
            <EmptyState
              icon="⚠️"
              title="Something went wrong"
              description={error}
              actionLabel="Retry"
              actionHref="/"
            />
          </div>
        ) : (
          <>
            {!isFiltering && heroMovie && <Hero movie={heroMovie} />}

            {isFiltering && (
              <div className="pt-28 pb-8 px-4 md:px-10">
                <h1 className="text-2xl font-bold text-white mb-2">{filterLabel}</h1>
                <p className="text-gray-400 text-sm">{allMovies.length} titles found</p>
              </div>
            )}

            <div className={isFiltering ? 'pb-20' : '-mt-20 relative z-10 pb-20'}>
              {isFiltering ? (
                allMovies.length === 0 ? (
                  <EmptyState
                    icon="🔍"
                    title="No results found"
                    description="Try a different search term or browse our categories."
                    actionLabel="Browse All"
                    actionHref="/"
                  />
                ) : (
                  <div className="px-4 md:px-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {allMovies.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                  </div>
                )
              ) : (
                <>
                  <MovieRow title="🔥 Top Picks" movies={featured} />
                  {movieRows.map((cat) => (
                    <MovieRow key={cat.id} title={cat.name} movies={cat.movies} />
                  ))}
                  <MovieRow title="All Titles" movies={allMovies} />
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
