import React from 'react';
import type { Movie } from '../../types/movie';
import MovieCard from '../MovieCard/MovieCard';
import styles from './MovieGrid.module.css';

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

const MovieGrid: React.FC<MovieGridProps> = ({ movies, onSelect }) => {
  if (!movies.length) return null;
  return (
    <ul className={styles.grid}>
      {movies.map((movie) => (
        <li key={movie.id}>
          <MovieCard movie={movie} onClick={onSelect} />
        </li>
      ))}
    </ul>
  );
};

export default MovieGrid;