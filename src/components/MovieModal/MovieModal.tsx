import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Movie } from '../../types/movie';
import css from './MovieModal.module.css';

interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
  currentPage: number;
  totalPages: number;
  onChangePage: (page: number) => void;
}

const modalRoot = document.getElementById('modal-root') || document.body;

const MovieModal: React.FC<MovieModalProps> = ({
  movie,
  onClose,
  currentPage,
  totalPages,
  onChangePage
}) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  if (!movie) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div className={css.backdrop} onClick={handleBackdropClick}>
      <div className={css.modal} role="dialog" aria-modal="true">
        <button className={css.closeButton} onClick={onClose}>
          ×
        </button>

        {movie.backdrop_path && (
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            className={css.image}
          />
        )}

        <div className={css.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <p><strong>Release Date:</strong> {movie.release_date || '—'}</p>
          <p><strong>Rating:</strong> {movie.vote_average}/10</p>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className={css.pagination}>
            <button
              disabled={currentPage === 1}
              onClick={() => onChangePage(currentPage - 1)}
            >
              Prev
            </button>
            <span>{currentPage} / {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => onChangePage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>,
    modalRoot
  );
};

export default MovieModal;