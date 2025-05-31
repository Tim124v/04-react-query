import React, { useState, useEffect, useCallback } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import type { FetchMoviesResult } from '../../types/movie';
import toast, { Toaster } from 'react-hot-toast';
import styles from './App.module.css';
import ReactPaginate from 'react-paginate';
import { useQuery } from '@tanstack/react-query';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

 
  useEffect(() => {
    if (!selectedMovie) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedMovie]);

  const handleSearch = useCallback((newQuery: string) => {
    if (!newQuery) {
      toast.error('Please enter your search query.');
      return;
    }
    setQuery(newQuery);
    setPage(1);
  }, []);

  const {
    data,
    isLoading,
    isError,
  } = useQuery<FetchMoviesResult>({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies({ query, page }),
    enabled: !!query,
    staleTime: 5000,
  });

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

 
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  return (
    <div className={styles.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {!isLoading && !isError && data && data.results.length > 0 && (
        <>
          {data.total_pages > 1 && (
            <ReactPaginate
              pageCount={data.total_pages}
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
          <MovieGrid movies={data.results} onSelect={handleSelectMovie} />
        </>
      )}
      {selectedMovie && (
        <div onClick={handleBackdropClick} style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
          <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
        </div>
      )}
    </div>
  );
};

export default App;