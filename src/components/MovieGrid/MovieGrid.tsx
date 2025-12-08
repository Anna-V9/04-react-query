import React from 'react';
import styles from './MovieGrid.module.css';
import type { Movie } from '../../types/movie';

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

const MovieGrid: React.FC<MovieGridProps> = ({ movies, onSelect }) => {
  return (
    <div className={styles.grid}>
      {movies.map(movie => (
        <div
          key={movie.id}
          className={styles.card}
          onClick={() => onSelect(movie)}
        >
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
            />
          ) : (
            <div className={styles.noImage}>No Image</div>
          )}
          <h3>{movie.title}</h3>
        </div>
      ))}
    </div>
  );
};

export default MovieGrid;
