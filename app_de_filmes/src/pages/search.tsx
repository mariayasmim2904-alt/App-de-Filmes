import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchMulti, fetchGenres } from '../services/api';
import MovieCard from '../components/moviecard';
import SearchBar from '../components/searchbar';
import { CardSkeleton } from '../components/skeleton';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [genreId, setGenreId] = useState<number | undefined>(undefined);
  const [year, setYear] = useState<number | undefined>(undefined);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [page, setPage] = useState<number>(1);

  // Busca gêneros
  const { data: genres } = useQuery({
    queryKey: ['genres', 'movie'],
    queryFn: () => fetchGenres('movie'),
  });

  // Busca resultados da API
  const { data, isLoading, isError } = useQuery({
    queryKey: ['search', query, page],
    queryFn: () => searchMulti(query, page),
    enabled: !!query,
    staleTime: 1 * 60 * 1000,
  });

  // Reseta filtros se a pesquisa principal mudar
  useEffect(() => {
    setPage(1);
    setGenreId(undefined);
    setYear(undefined);
    setMinRating(undefined);
  }, [query]);

  // Filtra resultados localmente
  const filteredResults = useMemo(() => {
    if (!data?.results) return [];
    
    return data.results.filter((item: any) => {
      // Apenas filmes e séries
      if (item.media_type !== 'movie' && item.media_type !== 'tv') return false;

      // Filtro de Gênero
      if (genreId && !item.genre_ids?.includes(genreId)) return false;

      // Filtro de Ano
      const date = item.release_date || item.first_air_date || '';
      const itemYear = date ? Number(date.split('-')[0]) : null;
      if (year && itemYear !== year) return false;

      // Filtro de Avaliação
      if (minRating && (item.vote_average || 0) < minRating) return false;

      return true;
    });
  }, [data, genreId, year, minRating]);

  // Lista de anos para o dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => currentYear - i);

  const handleSearch = (newQuery: string) => {
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery });
    } else {
      setSearchParams({});
    }
  };

  const totalPages = data?.total_pages || 1;

  return (
    <div className="w-full bg-[#F8FAFC] dark:bg-[#0D1117] min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        
        {/* BUSCA DE PÁGINA */}
        <div className="max-w-xl mx-auto mb-10">
          <SearchBar initialValue={query} onSearch={handleSearch} />
        </div>

        {query && (
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-extrabold font-poppins text-gray-900 dark:text-white">
              Resultados para: <span className="text-[#E50914]">"{query}"</span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Encontramos {filteredResults.length} títulos que correspondem aos seus filtros nesta página.
            </p>
          </div>
        )}

        {/* FILTERS PANEL */}
        {query && (
          <div className="bg-white dark:bg-[#161B22] p-4 rounded-2xl border border-gray-200 dark:border-gray-800/40 shadow-sm flex flex-wrap gap-4 items-end mb-8 transition-colors">
            {/* GENRE */}
            <div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
              <label className="text-[10px] font-bold text-gray-650 dark:text-gray-400 uppercase tracking-wider">Refinar por Gênero</label>
              <select
                value={genreId || ''}
                onChange={(e) => setGenreId(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full bg-gray-100 dark:bg-[#0D1117] text-xs text-gray-800 dark:text-gray-200 rounded-xl px-3 py-2.5 border border-gray-300 dark:border-gray-700/60 focus:outline-none focus:ring-2 focus:ring-[#E50914]"
              >
                <option value="">Todos</option>
                {genres?.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            {/* YEAR */}
            <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
              <label className="text-[10px] font-bold text-gray-650 dark:text-gray-400 uppercase tracking-wider">Ano</label>
              <select
                value={year || ''}
                onChange={(e) => setYear(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full bg-gray-100 dark:bg-[#0D1117] text-xs text-gray-800 dark:text-gray-200 rounded-xl px-3 py-2.5 border border-gray-300 dark:border-gray-700/60 focus:outline-none focus:ring-2 focus:ring-[#E50914]"
              >
                <option value="">Qualquer</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* RATING */}
            <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
              <label className="text-[10px] font-bold text-gray-650 dark:text-gray-400 uppercase tracking-wider">Nota Mínima</label>
              <select
                value={minRating || ''}
                onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full bg-gray-100 dark:bg-[#0D1117] text-xs text-gray-800 dark:text-gray-200 rounded-xl px-3 py-2.5 border border-gray-300 dark:border-gray-700/60 focus:outline-none focus:ring-2 focus:ring-[#E50914]"
              >
                <option value="">Qualquer</option>
                <option value="8">★ 8.0+</option>
                <option value="7">★ 7.0+</option>
                <option value="6">★ 6.0+</option>
                <option value="5">★ 5.0+</option>
              </select>
            </div>
          </div>
        )}

        {/* RESULTS GRID */}
        {!query ? (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">Digite algo acima para pesquisar filmes e séries.</p>
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <p className="text-red-500 font-medium">Erro ao buscar resultados. Verifique sua conexão.</p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, idx) => (
              <CardSkeleton key={idx} />
            ))}
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-base">Nenhum resultado corresponde aos seus filtros nesta página.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {filteredResults.map((item) => (
                <div key={item.id} className="w-full">
                  <MovieCard movie={item} mediaType={item.media_type} />
                </div>
              ))}
            </div>

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="p-2.5 rounded-xl bg-white dark:bg-[#161B22] border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-300 hover:bg-[#E50914] hover:text-white disabled:opacity-30 cursor-pointer"
                >
                  Anterior
                </button>
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-300">
                  Página {page} de {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="p-2.5 rounded-xl bg-white dark:bg-[#161B22] border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-300 hover:bg-[#E50914] hover:text-white disabled:opacity-30 cursor-pointer"
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
