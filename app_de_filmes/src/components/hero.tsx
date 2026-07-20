import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Heart, Bookmark, Star, X } from 'lucide-react';
import type { Movie } from '../types/movie';
import { getBackdropUrl, fetchMovieVideos } from '../services/api';
import type { Video } from '../services/api';
import { useMovies } from '../context/MovieContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroProps {
  movie: Movie;
}

export const Hero: React.FC<HeroProps> = ({ movie }) => {
  const { theme } = useTheme();
  const { toggleFavorite, isFavorite, toggleWatchlist, isInWatchlist, showToast } = useMovies();
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);

  const id = movie.id;
  const title = movie.title || (movie as any).name || 'Filme em Destaque';
  const releaseDate = movie.release_date || (movie as any).first_air_date || '';
  const year = releaseDate ? releaseDate.split('-')[0] : '';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '0.0';
  const backdrop = getBackdropUrl(movie.backdrop_path, 'original');

  const favorited = isFavorite(id);
  const watchlisted = isInWatchlist(id);

  const handlePlayTrailer = async () => {
    setIsLoadingTrailer(true);
    try {
      const videos: Video[] = await fetchMovieVideos(id);
      
      const trailer = videos.find(
        (v) => (v.type === 'Trailer' || v.type === 'Teaser') && v.site === 'YouTube'
      ) || videos.find((v) => v.site === 'YouTube');

      if (trailer) {
        setTrailerKey(trailer.key);
      } else {
        showToast('Trailer indisponível para este título.', 'error');
      }
    } catch (error) {
      showToast('Erro ao buscar o trailer.', 'error');
    } finally {
      setIsLoadingTrailer(false);
    }
  };

  return (
    <>
      <section className="relative w-full h-[70vh] sm:h-[80vh] md:h-[88vh] flex items-center overflow-hidden">
        {/* BACKDROP IMAGE */}
        <div className="absolute inset-0 z-0">
          <img
            src={backdrop}
            alt={title}
            className="w-full h-full object-cover object-top scale-100 animate-[zoomSlow_20s_infinite_alternate]"
          />
          {/* GRADIENT OVERLAYS */}
          <div
            className={`absolute inset-0 z-10 transition-all ${
              theme === 'dark' ? 'hero-side-gradient-dark' : 'hero-side-gradient-light'
            }`}
          />
          <div
            className={`absolute inset-0 z-10 transition-all ${
              theme === 'dark' ? 'hero-gradient-dark' : 'hero-gradient-light'
            }`}
          />
        </div>

        {/* CONTENT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-25 relative mt-12">
          <div className="max-w-2xl flex flex-col gap-4 text-left">
            {/* TAG */}
            <span className="flex items-center gap-1.5 text-xs sm:text-sm font-bold tracking-widest text-[#E50914] uppercase">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E50914] animate-ping" />
              Destaque de Hoje
            </span>

            {/* TITLE */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-poppins text-gray-900 dark:text-white leading-tight tracking-tight drop-shadow-md">
              {title}
            </h1>

            {/* METRICS */}
            <div className="flex items-center gap-4 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">
              <span className="flex items-center gap-1 text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md">
                <Star className="w-4 h-4 fill-current" /> {rating}
              </span>
              {year && <span>{year}</span>}
              <span className="border border-gray-400 dark:border-gray-600 px-2 py-0.5 rounded text-[10px] sm:text-xs uppercase tracking-wider font-bold">
                HD / 4K
              </span>
            </div>

            {/* OVERVIEW */}
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed font-normal line-clamp-3 sm:line-clamp-4 max-w-xl drop-shadow-sm">
              {movie.overview || 'Sinopse não disponível em português.'}
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap gap-3 mt-4">
              <button
                onClick={handlePlayTrailer}
                disabled={isLoadingTrailer}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E50914] hover:bg-[#b80710] text-white font-medium disabled:opacity-50 transition-all hover:scale-105 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                {isLoadingTrailer ? "Carregando..." : "Assistir Trailer"}
              </button>

              <Link
                to={`/movie/${id}`}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-900 dark:text-white text-sm sm:text-base font-bold border border-gray-300 dark:border-white/10 cursor-pointer transition-all hover:scale-105 backdrop-blur-md"
              >
                <Info className="w-5 h-5" />
                Mais Informações
              </Link>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleFavorite(movie)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 transition-colors cursor-pointer"
                  title={favorited ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
                >
                  <Heart 
                    className={`w-5 h-5 ${favorited ? "text-red-500 fill-red-500" : "text-gray-700 dark:text-white"}`} 
                  />
                </button>

                <button
                  onClick={() => toggleWatchlist(movie)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 transition-colors cursor-pointer"
                  title={watchlisted ? "Remover da Watchlist" : "Adicionar à Watchlist"}
                >
                  <Bookmark 
                    className={`w-5 h-5 ${watchlisted ? "text-blue-500 fill-blue-500" : "text-gray-700 dark:text-white"}`} 
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KEYFRAME ANIMATION */}
      <style>{`
        @keyframes zoomSlow {
          0% { transform: scale(1.0); }
          100% { transform: scale(1.08); }
        }
      `}</style>

      {/* TRAILER MODAL */}
      <AnimatePresence>
        {trailerKey && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
            onClick={() => setTrailerKey(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden border border-gray-800 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setTrailerKey(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-[#E50914] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              
              <iframe
                title={`Trailer Destaque - ${title}`}
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Hero;