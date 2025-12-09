import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import ReactPaginate from 'react-paginate';
import styles from './App.module.css';
import type { Movie } from '../../types/movie';
import type { MovieResponse } from '../../services/movieService.types';
import { fetchMovies } from '../../services/movieService';
import { Toaster, toast } from 'react-hot-toast';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Movie | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery<MovieResponse, Error>({
  queryKey: ['movies', query, page],
  queryFn: () => fetchMovies({ query, page }),
  enabled: query.trim().length > 0,
  placeholderData: (prev: MovieResponse | undefined) => prev,
});


  useEffect(() => {
    if (data && data.results.length === 0) {
      toast('No movies found for your request.');
    }
  }, [data]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
    setErrorMessage(null);
  };

  const handleSelect = (movie: Movie) => {
    setSelected(movie);
  };

  const handleCloseModal = () => {
    setSelected(null);
  };

  const totalPages = data?.total_pages ?? 0;

  return (
    <div className={styles.app}>
      <SearchBar onSubmit={handleSearch} />

      <main className={styles.main}>
        {isLoading && <Loader />}
        {isError && <ErrorMessage message={errorMessage || 'Error fetching movies'} />}

        {!isLoading && !isError && data && (
  <>
    <div className={styles.pageInfo}>
      Page {page} of {totalPages}
    </div>


    {totalPages > 1 && (
      <ReactPaginate
        pageCount={totalPages}
        pageRangeDisplayed={5}
        marginPagesDisplayed={1}
        onPageChange={({ selected }) => setPage(selected + 1)}
        forcePage={page - 1}
        containerClassName={styles.pagination}
        activeClassName={styles.active}
        nextLabel="→"
        previousLabel="←"
      />
    )}
    <MovieGrid movies={data.results} onSelect={handleSelect} />
  </>
)}
      </main>

      {selected && (
  <MovieModal
    movie={selected}
    onClose={handleCloseModal}
    
  />
)}
      <Toaster position="top-right" />
    </div>
  );
};

export default App;