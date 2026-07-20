import axios from 'axios';
import type { 
  Movie, 
  MovieDetails, 
  TVShowDetails, 
  CreditsResponse, 
  ImageGallery, 
  Video, 
  Genre 
} from '../types/movie';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '26f82e13253f732c1d11e1e138b04d01';
const BASE_URL = 'https://api.themoviedb.org/3';

export const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'pt-BR',
  },
});

export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const getImageUrl = (path: string | null, size: 'w200' | 'w500' | 'original' = 'w500') => {
  if (!path) return 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=500&auto=format&fit=crop';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null, size: 'w780' | 'w1280' | 'original' = 'original') => {
  if (!path) return 'https://images.unsplash.com/photo-1574267431629-2e570f242e23?q=80&w=1280&auto=format&fit=crop';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export interface CategoryInfo {
  name: string;
  endpoint: string;
  params?: Record<string, string>;
}

export const CATEGORIES: Record<string, CategoryInfo> = {
  lancamentos: { name: 'Lançamentos', endpoint: '/movie/now_playing' },
  em_alta: { name: 'Em Alta', endpoint: '/trending/movie/week' },
  populares: { name: 'Mais Populares', endpoint: '/movie/popular' },
  acao: { name: 'Ação', endpoint: '/discover/movie', params: { with_genres: '28' } },
  aventura: { name: 'Aventura', endpoint: '/discover/movie', params: { with_genres: '12' } },
  comedia: { name: 'Comédia', endpoint: '/discover/movie', params: { with_genres: '35' } },
  terror: { name: 'Terror', endpoint: '/discover/movie', params: { with_genres: '27' } },
  suspense: { name: 'Suspense', endpoint: '/discover/movie', params: { with_genres: '53' } },
  romance: { name: 'Romance', endpoint: '/discover/movie', params: { with_genres: '10749' } },
  ficcao_cientifica: { name: 'Ficção Científica', endpoint: '/discover/movie', params: { with_genres: '878' } },
  fantasia: { name: 'Fantasia', endpoint: '/discover/movie', params: { with_genres: '14' } },
  drama: { name: 'Drama', endpoint: '/discover/movie', params: { with_genres: '18' } },
  crime: { name: 'Crime', endpoint: '/discover/movie', params: { with_genres: '80' } },
  misterio: { name: 'Mistério', endpoint: '/discover/movie', params: { with_genres: '9648' } },
  animacao: { name: 'Animação', endpoint: '/discover/movie', params: { with_genres: '16' } },
  infantil: { name: 'Infantil', endpoint: '/discover/movie', params: { with_genres: '10751', certification_country: 'BR', 'certification.lte': 'L' } },
  familia: { name: 'Família', endpoint: '/discover/movie', params: { with_genres: '10751' } },
  documentario: { name: 'Documentário', endpoint: '/discover/movie', params: { with_genres: '99' } },
  guerra: { name: 'Guerra', endpoint: '/discover/movie', params: { with_genres: '10752' } },
  historia: { name: 'História', endpoint: '/discover/movie', params: { with_genres: '36' } },
  musica: { name: 'Música', endpoint: '/discover/movie', params: { with_genres: '10402' } },
  esportes: { name: 'Esportes', endpoint: '/discover/movie', params: { with_keywords: '6075|195666|180231' } },
  classicos: { name: 'Clássicos', endpoint: '/discover/movie', params: { 'release_date.lte': '1985-12-31', sort_by: 'vote_average.desc', 'vote_count.gte': '200' } },
  brasileiros: { name: 'Filmes Brasileiros', endpoint: '/discover/movie', params: { with_original_language: 'pt', with_origin_country: 'BR' } },
  internacionais: { name: 'Filmes Internacionais', endpoint: '/discover/movie', params: { without_original_language: 'pt' } },
  oscar: { name: 'Oscar', endpoint: '/discover/movie', params: { with_keywords: '234190|279818|256183' } },
  baseados_fatos: { name: 'Baseados em Histórias Reais', endpoint: '/discover/movie', params: { with_keywords: '156050|170327' } },
};

export type CategoryKey = keyof typeof CATEGORIES;

export const fetchMoviesByCategory = async (category: CategoryKey, page = 1): Promise<{ results: Movie[]; total_pages: number }> => {
  const cat = CATEGORIES[category];
  const response = await api.get(cat.endpoint, {
    params: {
      page,
      ...cat.params,
    },
  });
  return {
    results: response.data.results,
    total_pages: response.data.total_pages,
  };
};

export const fetchGenres = async (type: 'movie' | 'tv' = 'movie'): Promise<Genre[]> => {
  const response = await api.get(`/genre/${type}/list`);
  return response.data.genres;
};

export const fetchMovieDetails = async (id: number): Promise<MovieDetails> => {
  const response = await api.get(`/movie/${id}`);
  return response.data;
};

export const fetchTVShowDetails = async (id: number): Promise<TVShowDetails> => {
  const response = await api.get(`/tv/${id}`);
  return response.data;
};

export const fetchMovieCredits = async (id: number): Promise<CreditsResponse> => {
  const response = await api.get(`/movie/${id}/credits`);
  return response.data;
};

export const fetchTVCredits = async (id: number): Promise<CreditsResponse> => {
  const response = await api.get(`/tv/${id}/credits`);
  return response.data;
};

export const fetchMovieVideos = async (movieId: number) => {
  try {
    // 1. Tenta buscar trailers em Português
    let response = await api.get(`/movie/${movieId}/videos`, {
      params: { language: 'pt-BR' }
    });
    
    let videos = response.data.results;

    // 2. Se não encontrou nenhum vídeo em PT-BR, busca sem filtro de idioma (ou em inglês)
    if (!videos || videos.length === 0) {
      response = await api.get(`/movie/${movieId}/videos`, {
        params: { language: 'en-US' }
      });
      videos = response.data.results;
    }

    return videos || [];
  } catch (error) {
    console.error("Erro ao buscar vídeos:", error);
    return [];
  }
};

export const fetchTVVideos = async (tvId: number) => {
  try {
    // 1. Tenta buscar trailers em Português
    let response = await api.get(`/tv/${tvId}/videos`, {
      params: { language: 'pt-BR' }
    });
    
    let videos = response.data.results;

    // 2. Se não encontrou nenhum vídeo em PT-BR, busca em Inglês
    if (!videos || videos.length === 0) {
      response = await api.get(`/tv/${tvId}/videos`, {
        params: { language: 'en-US' }
      });
      videos = response.data.results;
    }

    return videos || [];
  } catch (error) {
    console.error("Erro ao buscar vídeos da série:", error);
    return [];
  }
};

export const fetchMovieImages = async (id: number): Promise<ImageGallery> => {
  const response = await api.get(`/movie/${id}/images`, {
    params: { include_image_language: 'en,pt,null' },
  });
  return response.data;
};

export const fetchTVImages = async (id: number): Promise<ImageGallery> => {
  const response = await api.get(`/tv/${id}/images`, {
    params: { include_image_language: 'en,pt,null' },
  });
  return response.data;
};

export const fetchSimilarMovies = async (id: number): Promise<Movie[]> => {
  const response = await api.get(`/movie/${id}/similar`);
  return response.data.results;
};

export const fetchSimilarTVShows = async (id: number): Promise<any[]> => {
  const response = await api.get(`/tv/${id}/similar`);
  return response.data.results;
};

export interface DiscoverParams {
  type: 'movie' | 'tv';
  genreId?: number;
  year?: number;
  minRating?: number;
  sortBy?: string;
  page?: number;
  originalLanguage?: string;
  withoutOriginalLanguage?: string;
}

export const discoverMedia = async ({
  type,
  genreId,
  year,
  minRating,
  sortBy = 'popularity.desc',
  page = 1,
  originalLanguage,
  withoutOriginalLanguage,
}: DiscoverParams): Promise<{ results: any[]; total_pages: number }> => {
  const endpoint = type === 'movie' ? '/discover/movie' : '/discover/tv';
  
  const params: Record<string, any> = {
    page,
    sort_by: sortBy,
  };

  if (genreId) {
    params.with_genres = genreId.toString();
  }

  if (year) {
    if (type === 'movie') {
      params.primary_release_year = year;
    } else {
      params.first_air_date_year = year;
    }
  }

  if (minRating) {
    params['vote_average.gte'] = minRating;
  }

  if (originalLanguage) {
    params.with_original_language = originalLanguage;
  }

  if (withoutOriginalLanguage) {
    params.without_original_language = withoutOriginalLanguage;
  }

  const response = await api.get(endpoint, { params });
  return {
    results: response.data.results,
    total_pages: response.data.total_pages,
  };
};

export const searchMulti = async (query: string, page = 1): Promise<{ results: any[]; total_pages: number }> => {
  const response = await api.get('/search/multi', {
    params: {
      query,
      page,
      include_adult: false,
    },
  });
  return {
    results: response.data.results,
    total_pages: response.data.total_pages,
  };
};

export type { Video };
