import axios, { AxiosError } from 'axios';
import type { FetchMoviesResult } from '../types/movie';

// Типізую її параметри
interface FetchMoviesParams {
  query: string;
  page: number;
}

export async function fetchMovies({ query, page }: FetchMoviesParams): Promise<FetchMoviesResult> {
  try {
    const response = await axios.get<FetchMoviesResult>('https://api.themoviedb.org/3/search/movie', {
      params: {
        query,
        page,
      },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error('Invalid API key. Please check your TMDB token.');
      }
      if (error.response?.status === 404) {
        throw new Error('Movie not found.');
      }
    }
    throw new Error('Failed to fetch movies. Please try again later.');
  }
} 