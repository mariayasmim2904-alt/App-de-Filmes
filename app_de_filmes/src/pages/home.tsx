import React, { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchMoviesByCategory } from '../services/api';
import type { CategoryKey } from '../services/api';
import Hero from '../components/hero';
import MovieCard from '../components/moviecard';
import { CardSkeleton, HeroSkeleton } from '../components/skeleton';

interface MovieRowProps {
  title: string;
  category: CategoryKey;
}

const MovieRow: React.FC<MovieRowProps> = ({ title, category }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['movies', category],
    queryFn: () => fetchMoviesByCategory(category),
    staleTime: 5 * 60 * 1000, // Cache de 5 minutos
  });

  const handleScroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = direction === 'left' 
        ? scrollLeft - clientWidth * 0.75 
        : scrollLeft + clientWidth * 0.75;
      
      rowRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const checkScrollPosition = () => {
    if (rowRef.current) {
      setShowLeftArrow(rowRef.current.scrollLeft > 10);
    }
  };

  if (isError) return null;

  return (
    <div className="relative group/row mb-10 px-4 sm:px-6 lg:px-8">
      {/* ROW TITLE */}
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold font-poppins text-gray-900 dark:text-white mb-4 hover:text-[#E50914] transition-colors cursor-pointer inline-flex items-center gap-1">
        {title}
      </h2>

      {/* CAROUSEL WRAPPER */}
      <div className="relative flex items-center">
        {/* LEFT NAV ARROW */}
        {showLeftArrow && (
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-0 z-30 h-full w-12 bg-black/60 hover:bg-black/80 flex items-center justify-center text-white border-r border-white/5 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 backdrop-blur-sm cursor-pointer rounded-r-2xl"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        )}

        {/* ITEMS LIST */}
        <div
          ref={rowRef}
          onScroll={checkScrollPosition}
          className="flex gap-4 overflow-x-auto overflow-y-hidden py-4 px-2 no-scrollbar scroll-smooth w-full"
        >
          {isLoading
            ? Array.from({ length: 8 }).map((_, idx) => <CardSkeleton key={idx} />)
            : data?.results?.map((movie) => (
                <div key={movie.id} className="w-[150px] sm:w-[180px] md:w-[220px] flex-shrink-0">
                  <MovieCard movie={movie} />
                </div>
              ))}
        </div>

        {/* RIGHT NAV ARROW */}
        <button
          onClick={() => handleScroll('right')}
          className="absolute right-0 z-30 h-full w-12 bg-black/60 hover:bg-black/80 flex items-center justify-center text-white border-l border-white/5 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 backdrop-blur-sm cursor-pointer rounded-l-2xl"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export const Home: React.FC = () => {
  // Busca o banner a partir dos mais populares
  const { data: popularData, isLoading: popularLoading } = useQuery({
    queryKey: ['movies', 'populares'],
    queryFn: () => fetchMoviesByCategory('populares'),
  });

  const featuredMovie = popularData?.results?.[0];

  return (
    <div className="w-full bg-[#F8FAFC] dark:bg-[#0D1117] min-h-screen pb-16 transition-colors overflow-hidden">
      {/* HERO SECTION */}
      {popularLoading || !featuredMovie ? (
        <HeroSkeleton />
      ) : (
        <Hero movie={featuredMovie} />
      )}

      {/* MOVIE CATEGORIES */}
      <div className="flex flex-col mt-4 gap-2 relative z-20">
        <MovieRow title="Lançamentos Recentes" category="lancamentos" />
        <MovieRow title="Em Alta" category="em_alta" />
        <MovieRow title="Mais Populares" category="populares" />
        
        {/* Gêneros */}
        <MovieRow title="Ação " category="acao" />
        <MovieRow title="Aventura & Fantasia" category="aventura" />
        <MovieRow title="Comédias para Rir" category="comedia" />
        <MovieRow title="Clássicos do Cinema" category="classicos" />
        
        {/* Curadorias */}
        <MovieRow title="Cinema Nacional 🇧🇷" category="brasileiros" />
        <MovieRow title="Sucessos do Oscar " category="oscar" />
        <MovieRow title="Grandes Esportes" category="esportes" />
        <MovieRow title="Documentários" category="documentario" />
        <MovieRow title="Romances" category="romance" />
        <MovieRow title="Ficção Científica" category="ficcao_cientifica" />
        <MovieRow title="Terror de Arrepiar" category="terror" />
      </div>
    </div>
  );
};

export default Home;
