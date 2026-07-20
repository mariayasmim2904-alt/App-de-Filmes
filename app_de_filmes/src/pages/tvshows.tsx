import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { discoverMedia, fetchGenres } from '../services/api';
import MovieCard from '../components/moviecard';
import { CardSkeleton } from '../components/skeleton';

export const TVShows: React.FC = () => {
  const [genreId, setGenreId] = useState<number | undefined>(undefined);
  const [year, setYear] = useState<number | undefined>(undefined);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>('popularity.desc');
  const [page, setPage] = useState<number>(1);

  // Busca gêneros de séries
  const { data: genres } = useQuery({
    queryKey: ['genres', 'tv'],
    queryFn: () => fetchGenres('tv'),
  });

  // Busca séries filtradas
  const { data, isLoading, isError } = useQuery({
    queryKey: ['discover', 'tv', genreId, year, minRating, sortBy, page],
    queryFn: () =>
      discoverMedia({
        type: 'tv',
        genreId,
        year,
        minRating,
        sortBy,
        page,
      }),
    staleTime: 2 * 60 * 1000,
  });

  // Reseta a página se os filtros mudarem
  useEffect(() => {
    setPage(1);
  }, [genreId, year, minRating, sortBy]);

  const handleClearFilters = () => {
    setGenreId(undefined);
    setYear(undefined);
    setMinRating(undefined);
    setSortBy('popularity.desc');
    setPage(1);
  };

  // Gera lista de anos (2026 até 1950)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => currentYear - i);

  const shows = data?.results || [];
  const totalPages = data?.total_pages ? Math.min(data.total_pages, 500) : 1;

  return (
    <div className="w-full bg-[#F8FAFC] dark:bg-[#0D1117] min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-poppins text-gray-900 dark:text-white flex items-center gap-2">
              Explorar Séries de TV
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Encontre séries incríveis filtrando por gênero, lançamento e avaliação.
            </p>
          </div>
          
          {/* RESET BUTTON */}
          {(genreId || year || minRating || sortBy !== 'popularity.desc') && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-[#E50914]/15 hover:bg-[#E50914]/25 text-[#E50914] rounded-xl border border-[#E50914]/20 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Limpar Filtros
            </button>
          )}
        </div>

        {/* FILTERS PANEL */}
        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-gray-200 dark:border-gray-800/40 shadow-sm flex flex-wrap gap-4 items-end mb-8 transition-colors">
          
          {/* GENRE FILTER */}
          <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
            <label className="text-xs font-bold text-gray-650 dark:text-gray-400 uppercase tracking-wider">Gênero</label>
            <select
              value={genreId || ''}
              onChange={(e) => setGenreId(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full bg-gray-100 dark:bg-[#0D1117] text-sm text-gray-800 dark:text-gray-200 rounded-xl px-4 py-3 border border-gray-300 dark:border-gray-700/60 focus:outline-none focus:ring-2 focus:ring-[#E50914] cursor-pointer"
            >
              <option value="">Todos os Gêneros</option>
              {genres?.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          {/* YEAR FILTER */}
          <div className="flex flex-col gap-2 flex-1 min-w-[150px]">
            <label className="text-xs font-bold text-gray-650 dark:text-gray-400 uppercase tracking-wider">Ano</label>
            <select
              value={year || ''}
              onChange={(e) => setYear(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full bg-gray-100 dark:bg-[#0D1117] text-sm text-gray-800 dark:text-gray-200 rounded-xl px-4 py-3 border border-gray-300 dark:border-gray-700/60 focus:outline-none focus:ring-2 focus:ring-[#E50914] cursor-pointer"
            >
              <option value="">Qualquer Ano</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* MIN RATING FILTER */}
          <div className="flex flex-col gap-2 flex-1 min-w-[150px]">
            <label className="text-xs font-bold text-gray-650 dark:text-gray-400 uppercase tracking-wider">Nota Mínima</label>
            <select
              value={minRating || ''}
              onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full bg-gray-100 dark:bg-[#0D1117] text-sm text-gray-800 dark:text-gray-200 rounded-xl px-4 py-3 border border-gray-300 dark:border-gray-700/60 focus:outline-none focus:ring-2 focus:ring-[#E50914] cursor-pointer"
            >
              <option value="">Qualquer Nota</option>
              <option value="8">★ 8.0+ Superior</option>
              <option value="7">★ 7.0+ Muito Bom</option>
              <option value="6">★ 6.0+ Bom</option>
              <option value="5">★ 5.0+ Regular</option>
            </select>
          </div>

          {/* SORTING FILTER */}
          <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
            <label className="text-xs font-bold text-gray-650 dark:text-gray-400 uppercase tracking-wider">Ordenar Por</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-gray-100 dark:bg-[#0D1117] text-sm text-gray-800 dark:text-gray-200 rounded-xl px-4 py-3 border border-gray-300 dark:border-gray-700/60 focus:outline-none focus:ring-2 focus:ring-[#E50914] cursor-pointer"
            >
              <option value="popularity.desc">Mais Populares</option>
              <option value="popularity.asc">Menos Populares</option>
              <option value="vote_average.desc">Melhor Avaliadas</option>
              <option value="first_air_date.desc">Lançamentos Recentes</option>
            </select>
          </div>
        </div>

        {/* RESULTS GRID */}
        {isError ? (
          <div className="text-center py-12">
            <p className="text-red-500 font-medium">Ocorreu um erro ao carregar as séries. Tente novamente mais tarde.</p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, idx) => (
              <CardSkeleton key={idx} />
            ))}
          </div>
        ) : shows.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhuma série corresponde aos filtros selecionados.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {shows.map((show) => (
                <div key={show.id} className="w-full">
                  <MovieCard movie={show} mediaType="tv" />
                </div>
              ))}
            </div>

            {/* PAGINATION CONTROLS */}
            <div className="flex justify-center items-center gap-4 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="p-3 rounded-xl bg-white dark:bg-[#161B22] border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-300 hover:bg-[#E50914] hover:text-white disabled:opacity-30 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-300">
                Página {page} de {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="p-3 rounded-xl bg-white dark:bg-[#161B22] border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-300 hover:bg-[#E50914] hover:text-white disabled:opacity-30 transition-all cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TVShows;
