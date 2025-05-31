import React from 'react';
import type { Movie } from '../../types/movie';
import styles from './MovieCard.module.css';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => (
  <div className={styles.card} onClick={() => onClick(movie)}>
    <img
      className={styles.image}
      src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
      alt={movie.title}
      loading="lazy"
    />
    <h2 className={styles.title}>{movie.title}</h2>
  </div>
);

export default MovieCard;