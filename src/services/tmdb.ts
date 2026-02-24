// src/services/tmdb.ts
import type { MovieTrend } from '../types';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export async function getTrendingMovies(): Promise<MovieTrend[]> {
  const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&language=vi-VN&region=VN`);

  if (!response.ok) {
    throw new Error('Failed to get TMDb trending movies.');
  }

  const data = await response.json();

  return data.results.slice(0, 10).map((item: any, index: number) => ({
    id: item.id,
    rank: index + 1,
    title: item.title,
    platform: 'Netflix', // This is a placeholder, as TMDb doesn't provide the platform
  }));
}
