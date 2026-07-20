export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  original_title?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  genre_ids: number[];
  vote_average: number;
  vote_count: number;
  popularity: number;
  media_type?: 'movie' | 'tv';
  adult?: boolean;
}

export interface TVShow {
  id: number;
  name: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  genre_ids: number[];
  vote_average: number;
  vote_count: number;
  popularity: number;
  media_type?: 'movie' | 'tv';
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
}

export interface Video {
  id: string;
  key: string; // YouTube Key
  name: string;
  site: string;
  type: string; // Ex: "Trailer"
  official: boolean;
}

export interface MovieDetails extends Omit<Movie, 'genre_ids'> {
  genres: Genre[];
  runtime: number; // em minutos
  tagline: string | null;
  budget: number;
  revenue: number;
  status: string;
  spoken_languages: { english_name: string; iso_639_1: string; name: string }[];
  original_language: string;
}

export interface TVShowDetails extends Omit<TVShow, 'genre_ids'> {
  genres: Genre[];
  episode_run_time: number[];
  number_of_episodes: number;
  number_of_seasons: number;
  status: string;
  spoken_languages: { english_name: string; iso_639_1: string; name: string }[];
  original_language: string;
}

export interface ImageGallery {
  backdrops: { file_path: string; aspect_ratio: number; width: number; height: number }[];
  posters: { file_path: string; aspect_ratio: number; width: number; height: number }[];
}

export interface CreditsResponse {
  cast: CastMember[];
  crew: CrewMember[];
}
