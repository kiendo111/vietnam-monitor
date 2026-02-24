// src/hooks/useTmdb.ts
import { useState, useEffect } from 'react';
import { getTrendingMovies } from '../services/tmdb';
import type { MovieTrend } from '../types';

export function useTmdb() {
  const [movies, setMovies] = useState<MovieTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTmdbData() {
      try {
        setLoading(true);
        const trendingMovies = await getTrendingMovies();
        setMovies(trendingMovies);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTmdbData();
  }, []);

  return { movies, loading, error };
}
