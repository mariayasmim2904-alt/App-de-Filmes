import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, Heart, Calendar, Clock, User, Award, Play, Check, Eye } from 'lucide-react';
import { 
  fetchMovieDetails, 
  fetchTVShowDetails, 
  fetchMovieCredits, 
  fetchTVCredits, 
  fetchMovieVideos, 
  fetchTVVideos, 
  fetchMovieImages, 
  fetchTVImages, 
  fetchSimilarMovies, 
  fetchSimilarTVShows, 
  getImageUrl, 
  getBackdropUrl 
} from '../services/api';
import { useMovies } from '../context/MovieContext';
import { useTheme } from '../context/ThemeContext';
import MovieCard from '../components/moviecard';
import { DetailsSkeleton } from '../components/skeleton';
import type { Movie } from '../types/movie';

export const MovieDetailsPage: React.FC = () => {
  const { id: rawId } = useParams<{ id: string }>();
  const id = Number(rawId);
  const location = useLocation();
  const { theme } = useTheme();
  
  const { 
    toggleFavorite, 
    isFavorite, 
    toggleWatchlist, 
    isInWatchlist, 
    toggleWatched, 
    isWatched 
  } = useMovies();

  // Determina se é filme ou série a partir da URL
  const isMovie = location.pathname.startsWith('/movie');

  // 1. Busca Detalhes
  const { data: details, isLoading: detailsLoading } = useQuery<any>({
    queryKey: [isMovie ? 'movie' : 'tv', 'details', id],
    queryFn: () => isMovie ? fetchMovieDetails(id) : fetchTVShowDetails(id),
    enabled: !isNaN(id),
  });

  // 2. Busca Elenco/Créditos
  const { data: credits } = useQuery<any>({
    queryKey: [isMovie ? 'movie' : 'tv', 'credits', id],
    queryFn: () => isMovie ? fetchMovieCredits(id) : fetchTVCredits(id),
    enabled: !isNaN(id),
  });

  // 3. Busca Vídeos (Trailers)
  const { data: videos } = useQuery<any>({
    queryKey: [isMovie ? 'movie' : 'tv', 'videos', id],
    queryFn: () => isMovie ? fetchMovieVideos(id) : fetchTVVideos(id),
    enabled: !isNaN(id),
  });

  // 4. Busca Imagens da Galeria
  const { data: gallery } = useQuery<any>({
    queryKey: [isMovie ? 'movie' : 'tv', 'images', id],
    queryFn: () => isMovie ? fetchMovieImages(id) : fetchTVImages(id),
    enabled: !isNaN(id),
  });

  // 5. Busca Recomendados / Semelhantes
  const { data: similar } = useQuery<any>({
    queryKey: [isMovie ? 'movie' : 'tv', 'similar', id],
    queryFn: () => isMovie ? fetchSimilarMovies(id) : fetchSimilarTVShows(id),
    enabled: !isNaN(id),
  });

  if (detailsLoading || !details) {
    return <DetailsSkeleton />;
  }

  // Cast para any nos detalhes dinâmicos para evitar conflito de tipos Filme vs Série
  const detailsData = details as any;

  // Mapeia variáveis comuns
  const title = detailsData.title || detailsData.name || 'Sem título';
  const tagline = detailsData.tagline;
  const overview = detailsData.overview || 'Sinopse não disponível em português.';
  const rating = detailsData.vote_average ? detailsData.vote_average.toFixed(1) : '0.0';
  
  const releaseDateRaw = detailsData.release_date || detailsData.first_air_date || '';
  const releaseDateFormatted = releaseDateRaw 
    ? new Date(releaseDateRaw).toLocaleDateString('pt-BR') 
    : 'N/A';
  const year = releaseDateRaw ? releaseDateRaw.split('-')[0] : '';

  // Duração ou Temporadas
  const durationText = isMovie 
    ? detailsData.runtime 
      ? `${Math.floor(detailsData.runtime / 60)}h ${detailsData.runtime % 60}m` 
      : 'N/A'
    : detailsData.number_of_seasons 
      ? `${detailsData.number_of_seasons} Temporada(s) • ${detailsData.number_of_episodes || 0} Eps` 
      : 'N/A';

  // Diretor
  const director = credits?.crew?.find((member: any) => member.job === 'Director')?.name || 'N/A';

  // Trailer do Youtube
  const youtubeTrailer = videos?.find(
    (v: any) => (v.type === 'Trailer' || v.type === 'Teaser') && v.site === 'YouTube'
  ) || videos?.find((v: any) => v.site === 'YouTube');

  // Estados locais do local storage
  const favorited = isFavorite(id);
  const watchlisted = isInWatchlist(id);
  const watched = isWatched(id);

  // Cast do carrossel (limitar a 10)
  const cast = credits?.cast?.slice(0, 10) || [];
  
  // Imagens da galeria (limitar a 8 backdrops)
  const backdrops = gallery?.backdrops?.slice(0, 8) || [];

  // Similar movies
  const similarItems: Movie[] = (similar || []).slice(0, 6) as Movie[];

  // Objeto para ações de guardar
  const moviePayload: Movie = {
    id: detailsData.id,
    title: detailsData.title || '',
    overview: detailsData.overview || '',
    poster_path: detailsData.poster_path || '',
    backdrop_path: detailsData.backdrop_path || '',
    release_date: detailsData.release_date || '',
    vote_average: detailsData.vote_average || 0,
    vote_count: detailsData.vote_count || 0,
    popularity: detailsData.popularity || 0,
    genre_ids: detailsData.genres ? detailsData.genres.map((g: any) => g.id) : [],
    media_type: isMovie ? 'movie' : 'tv',
  };

  return (
    <div className="w-full bg-[#F8FAFC] dark:bg-[#0D1117] min-h-screen pb-16 text-gray-800 dark:text-[#E6EDF2] transition-colors relative overflow-hidden">
      
      {/* 1. HERO BACKDROP SECTION */}
      <div className="relative w-full h-[55vh] md:h-[65vh] flex items-end">
        <div className="absolute inset-0">
          <img
            src={getBackdropUrl(detailsData.backdrop_path, 'original')}
            alt={title}
            className="w-full h-full object-cover object-top"
          />
          <div className={`absolute inset-0 ${theme === 'dark' ? 'hero-gradient-dark' : 'hero-gradient-light'}`} />
          <div className={`absolute inset-0 ${theme === 'dark' ? 'hero-side-gradient-dark' : 'hero-side-gradient-light'}`} />
        </div>

        {/* HERO CONTENT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-20 pb-6">
          <div className="max-w-3xl flex flex-col gap-3">
            <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#E50914] bg-[#E50914]/10 w-max px-3 py-1 rounded-full border border-[#E50914]/20">
              {isMovie ? 'Filme' : 'Série de TV'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-poppins text-gray-900 dark:text-white leading-tight drop-shadow-md">
              {title}
            </h1>
            {tagline && (
              <p className="text-sm sm:text-base italic text-gray-500 dark:text-gray-400 font-medium">
                "{tagline}"
              </p>
            )}

            {/* QUICK META */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-semibold mt-2 text-gray-800 dark:text-gray-200">
              <span className="flex items-center gap-1 text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md">
                <Star className="w-4 h-4 fill-current" /> {rating}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> {year}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {durationText}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BODY CONTENT LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-20">
        
        {/* LEFT COLUMN: POSTER & QUICK SPECS */}
        <div className="flex flex-col gap-6 items-center lg:items-stretch">
          {/* POSTER */}
          <div className="w-[220px] sm:w-[280px] lg:w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl bg-[#161B22] border border-gray-200 dark:border-gray-800/40 relative group">
            <img
              src={getImageUrl(detailsData.poster_path, 'w500')}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* INTERACTION BUTTONS */}
          <div className="w-full flex flex-col gap-3">
            <button
              onClick={() => toggleWatchlist(moviePayload)}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold border transition-all cursor-pointer hover:scale-[1.02] ${
                watchlisted
                  ? 'bg-[#3B82F6] border-[#3B82F6] text-white shadow-lg shadow-blue-500/20'
                  : 'bg-white dark:bg-[#161B22] border-gray-300 dark:border-gray-800 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              {watchlisted ? <Check className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
              {watchlisted ? 'Na Minha Lista' : 'Adicionar à Minha Lista'}
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => toggleFavorite(moviePayload)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-bold border transition-all cursor-pointer hover:scale-[1.02] ${
                  favorited
                    ? 'bg-[#E50914] border-[#E50914] text-white shadow-lg shadow-red-500/20'
                    : 'bg-white dark:bg-[#161B22] border-gray-300 dark:border-gray-800 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
                Favorito
              </button>
              
              <button
                onClick={() => toggleWatched(moviePayload)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-bold border transition-all cursor-pointer hover:scale-[1.02] ${
                  watched
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-white dark:bg-[#161B22] border-gray-300 dark:border-gray-800 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
              >
                <Eye className={`w-4 h-4 ${watched ? 'fill-current' : ''}`} />
                {watched ? 'Assistido' : 'Marcar Assistido'}
              </button>
            </div>
          </div>

          {/* QUICK DETAILS BOX */}
          <div className="w-full bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-gray-200 dark:border-gray-800/40 shadow-sm flex flex-col gap-4 text-sm font-medium">
            <h3 className="font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800/60 pb-2">Informações Técnicas</h3>
            <div className="flex justify-between">
              <span className="text-gray-400">Diretor</span>
              <span className="text-gray-800 dark:text-white font-bold">{director}</span>
            </div>
            {isMovie && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-400">Orçamento</span>
                  <span className="text-gray-800 dark:text-white font-bold">
                    {detailsData.budget ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(detailsData.budget) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Receita</span>
                  <span className="text-gray-800 dark:text-white font-bold">
                    {detailsData.revenue ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(detailsData.revenue) : 'N/A'}
                  </span>
                </div>
              </>
            )}
            <div className="flex justify-between">
              <span className="text-gray-400">Lançamento</span>
              <span className="text-gray-800 dark:text-white font-bold">{releaseDateFormatted}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Idioma Original</span>
              <span className="text-gray-800 dark:text-white font-bold uppercase">{detailsData.original_language}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status</span>
              <span className="text-gray-800 dark:text-white font-bold">{detailsData.status}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SPECS, CAST, TRAILER, GALLERY */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* OVERVIEW */}
          <div className="flex flex-col gap-3 bg-white dark:bg-[#161B22] p-6 rounded-2xl border border-gray-200 dark:border-gray-800/40 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sinopse</h2>
            <p className="text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300 font-normal">
              {overview}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {detailsData.genres?.map((g: any) => (
                <span
                  key={g.id}
                  className="text-xs bg-gray-100 dark:bg-[#0D1117] border border-gray-300 dark:border-gray-800/60 px-3 py-1.5 rounded-xl font-semibold"
                >
                  {g.name}
                </span>
              ))}
            </div>
          </div>

          {/* ELENCO (CAST CAROUSEL) */}
          {cast.length > 0 && (
            <div className="flex flex-col gap-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-1.5 px-1">
                <User className="w-5 h-5 text-[#3B82F6]" /> Elenco Principal
              </h2>
              <div className="flex gap-4 overflow-x-auto py-2 no-scrollbar w-full">
                {cast.map((actor: any) => (
                  <div key={actor.id} className="flex-shrink-0 w-24 text-center flex flex-col gap-1.5">
                    <img
                      src={actor.profile_path ? getImageUrl(actor.profile_path, 'w200') : 'https://api.dicebear.com/7.x/bottts/svg?seed=' + actor.name}
                      alt={actor.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full mx-auto shadow border border-gray-300 dark:border-gray-800/60"
                      loading="lazy"
                    />
                    <div className="text-[11px] font-bold text-gray-950 dark:text-white leading-tight line-clamp-1">
                      {actor.name}
                    </div>
                    <div className="text-[10px] text-gray-400 line-clamp-1 leading-none">
                      {actor.character}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TRAILER INCORPORADO (YOUTUBE) */}
          {youtubeTrailer ? (
            <div className="flex flex-col gap-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-1.5 px-1">
                <Play className="w-5 h-5 text-[#E50914] fill-current" /> Trailer Oficial
              </h2>
              <div className="w-full aspect-video rounded-2xl overflow-hidden border border-gray-300 dark:border-gray-800/50 shadow-lg">
                <iframe
                  title={`Trailer Oficial - ${title}`}
                  src={`https://www.youtube.com/embed/${youtubeTrailer.key}`}
                  className="w-full h-full border-none"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          ) : (
            <div className="p-6 text-center border border-dashed border-gray-300 dark:border-gray-800 rounded-2xl text-gray-500">
              Vídeo de trailer oficial não disponível para exibição direta.
            </div>
          )}

          {/* GALERIA DE IMAGENS (BACKDROPS) */}
          {backdrops.length > 0 && (
            <div className="flex flex-col gap-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-1.5 px-1">
                <Award className="w-5 h-5 text-amber-500" /> Galeria de Imagens
              </h2>
              <div className="flex gap-4 overflow-x-auto py-2 no-scrollbar w-full">
                {backdrops.map((img: any, index: number) => (
                  <div key={index} className="flex-shrink-0 w-64 sm:w-80 aspect-video rounded-xl overflow-hidden border border-gray-300 dark:border-gray-800/60 shadow">
                    <img
                      src={getImageUrl(img.file_path, 'w500')}
                      alt={`Backdrop ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. SIMILAR MOVIES CAROUSEL */}
      {similarItems.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 flex flex-col gap-4">
          <h2 className="text-xl sm:text-2xl font-bold font-poppins text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2">
            Títulos Semelhantes Recomendados
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {similarItems.map((item) => (
              <div key={item.id} className="w-full">
                <MovieCard movie={item} mediaType={isMovie ? 'movie' : 'tv'} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailsPage;