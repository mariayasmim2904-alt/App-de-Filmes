import React from 'react';
import { useMovies } from '../context/MovieContext';
import MovieCard from '../components/moviecard';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Watchlist: React.FC = () => {
  const { watchlist } = useMovies();

  return (
    <div className="w-full bg-[#F8FAFC] dark:bg-[#0D1117] min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-poppins text-gray-900 dark:text-white flex items-center gap-2">
            Minha Lista
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Seus filmes e séries salvos para assistir mais tarde.
          </p>
        </div>

        {/* CONTENT */}
        {watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 bg-white dark:bg-[#161B22] border border-gray-200 dark:border-gray-800/40 rounded-2xl p-8 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#3B82F6]/10 flex items-center justify-center mb-4 text-[#3B82F6]">
              <Play className="w-8 h-8 fill-current ml-1" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Sua lista está vazia</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
              Adicione filmes e séries clicando no botão "Adicionar à Minha Lista" nos detalhes ou banner.
            </p>
            <Link
              to="/"
              className="px-6 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-bold shadow-md cursor-pointer transition-colors"
            >
              Explorar Catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {watchlist.map((movie) => (
              <div key={movie.id} className="w-full animate-[fadeIn_0.3s_ease-out]">
                <MovieCard movie={movie} mediaType={movie.media_type} />
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Watchlist;
