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
import { keepPreviousData } from '@tanstack/react-query';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setSelectedMovie(null);
    }
  }, []);

  
  useEffect(() => {
    if (!selectedMovie) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedMovie(null);
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
    isPending,
    isError,
  } = useQuery<FetchMoviesResult, Error, FetchMoviesResult>({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies({ query, page }),
    enabled: !!query,
    placeholderData: keepPreviousData,
  });

 
  useEffect(() => {
    if (data?.results && data.results.length === 0 && query) {
      toast.error('No movies found for your search query.');
    }
  }, [data, query]);

  const handleSelectMovie = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  return (
    <div className={styles.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />
      {isPending && query && <Loader />}
      {isError && <ErrorMessage />}
      {!isPending && !isError && data?.results && data.results.length > 0 && (
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
        <div 
          className={styles.modalBackdrop} 
          onClick={handleBackdropClick}
        >
          <MovieModal 
            movie={selectedMovie} 
            onClose={() => setSelectedMovie(null)} 
          />
        </div>
      )}
    </div>
  );
};

export default App;