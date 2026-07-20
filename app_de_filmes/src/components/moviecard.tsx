import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Play, Star, X } from 'lucide-react';
import type { Movie, Video } from '../types/movie';
import { getImageUrl, fetchMovieVideos, fetchTVVideos } from '../services/api';
import { useMovies } from '../context/MovieContext';

interface MovieCardProps {
  movie: Movie;
  mediaType?: 'movie' | 'tv';
}

const GENRE_MAP: Record<number, string> = {
  // Filmes
  28: 'Ação', 12: 'Aventura', 16: 'Animação', 35: 'Comédia', 80: 'Crime',
  99: 'Documentário', 18: 'Drama', 10751: 'Família', 14: 'Fantasia',
  36: 'História', 27: 'Terror', 10402: 'Música', 9648: 'Mistério',
  10749: 'Romance', 878: 'Ficção Científica', 10770: 'Cinema TV',
  53: 'Suspense', 10752: 'Guerra', 37: 'Faroeste',
  // Séries (adicionais)
  10759: 'Ação e Aventura', 10762: 'Kids', 10763: 'Notícias',
  10764: 'Reality', 10765: 'Ficção e Fantasia', 10766: 'Soap',
  10767: 'Talk Show', 10768: 'Guerra e Política'
};

export const MovieCard: React.FC<MovieCardProps> = ({ movie, mediaType: initialMediaType }) => {
  const { toggleFavorite, isFavorite, showToast } = useMovies();
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);

  // Determina se é filme ou série
  const resolvedMediaType = initialMediaType || movie.media_type || (movie.title ? 'movie' : 'tv');
  const id = movie.id;
  const isMovie = resolvedMediaType === 'movie';
  
  const title = movie.title || (movie as any).name || 'Sem título';
  const releaseDate = movie.release_date || (movie as any).first_air_date || '';
  const year = releaseDate ? releaseDate.split('-')[0] : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '0.0';

  const favorited = isFavorite(id);

  // Mapear gêneros
  const genres = movie.genre_ids
    ? movie.genre_ids.slice(0, 2).map((gid) => GENRE_MAP[gid] || '').filter(Boolean).join(' • ')
    : '';

  const handlePlayTrailer = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoadingTrailer(true);
    try {
      let videos: Video[] = [];
      if (isMovie) {
        videos = await fetchMovieVideos(id);
      } else {
        videos = await fetchTVVideos(id);
      }

      if (!videos || videos.length === 0) {
        showToast('Trailer indisponível para este título.', 'error');
        return;
      }

      // Procura por Trailer, Teaser ou qualquer vídeo hospedado no YouTube
      const trailer = 
        videos.find((v) => v.type === 'Trailer' && v.site === 'YouTube') ||
        videos.find((v) => v.type === 'Teaser' && v.site === 'YouTube') ||
        videos.find((v) => v.site === 'YouTube');

      if (trailer && trailer.key) {
        setTrailerKey(trailer.key);
      } else {
        showToast('Trailer indisponível para este título.', 'error');
    }
   } catch (error) {
     console.error(error);
     showToast('Erro ao buscar o trailer.', 'error');
   } finally {
     setIsLoadingTrailer(false);
   }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(movie);
  };

  const detailsPath = isMovie ? `/movie/${id}` : `/tv/${id}`;

  return (
    <>
      <Link to={detailsPath} className="block relative w-full h-full select-none">
        <motion.div
          className="relative rounded-2xl overflow-hidden aspect-[2/3] w-full bg-[#161B22] shadow-md transition-shadow hover:shadow-2xl hover:shadow-netflix-red/10 cursor-pointer group"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {/* POSTER IMAGE */}
          <img
            src={getImageUrl(movie.poster_path, 'w500')}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350 flex flex-col justify-end p-4">
            {/* FAVORITE BUTTON */}
            <button
              onClick={handleFavoriteClick}
              className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-md cursor-pointer ${
                favorited
                  ? 'bg-[#E50914] text-white'
                  : 'bg-black/55 text-white hover:bg-[#E50914] hover:scale-110'
              }`}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
            </button>

            {/* MOVIE INFO */}
            <div className="flex flex-col gap-1.5 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <span className="text-xs font-bold text-white px-2 py-0.5 rounded bg-black/60 w-max self-start uppercase tracking-wider">
                {isMovie ? 'Filme' : 'Série'}
              </span>
              
              <h3 className="font-bold text-white text-sm sm:text-base leading-tight line-clamp-2">
                {title}
              </h3>

              <div className="flex items-center gap-2 text-xs text-gray-300 font-medium">
                <span className="flex items-center gap-0.5 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current" /> {rating}
                </span>
                <span>•</span>
                <span>{year}</span>
              </div>

              {genres && (
                <p className="text-[10px] text-gray-400 font-normal line-clamp-1">
                  {genres}
                </p>
              )}

              {/* ACTION BUTTONS */}
              <div className="flex gap-2 mt-2 pt-2 border-t border-white/10">
                <button
                  onClick={handlePlayTrailer}
                  disabled={isLoadingTrailer}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-[#E50914] hover:bg-[#b80710] text-white text-[11px] font-bold shadow-md cursor-pointer transition-colors disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Trailer
                </button>
                
                <span className="flex items-center justify-center p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-semibold"
                 >Ver Detalhes </span>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>

      {/* TRAILER MODAL */}
      <AnimatePresence>
        {trailerKey && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
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
               title={`Trailer - ${title}`}
               src={`https://www.youtube.com/embed/${trailerKey}`}
               className="w-full h-full border-none"
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
               allowFullScreen
               referrerPolicy="strict-origin-when-cross-origin"
             /> 
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MovieCard;
