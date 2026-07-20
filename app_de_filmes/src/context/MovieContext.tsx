import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Movie } from '../types/movie';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface MovieContextType {
  favorites: Movie[];
  watchlist: Movie[];
  watched: Movie[];
  toasts: Toast[];
  toggleFavorite: (movie: Movie) => void;
  isFavorite: (id: number) => boolean;
  toggleWatchlist: (movie: Movie) => void;
  isInWatchlist: (id: number) => boolean;
  toggleWatched: (movie: Movie) => void;
  isWatched: (id: number) => boolean;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  profileName: string;
  setProfileName: (name: string) => void;
  profileAvatar: string;
  setProfileAvatar: (avatar: string) => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Movie[]>(() => {
    const saved = localStorage.getItem('app-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [watchlist, setWatchlist] = useState<Movie[]>(() => {
    const saved = localStorage.getItem('app-watchlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [watched, setWatched] = useState<Movie[]>(() => {
    const saved = localStorage.getItem('app-watched');
    return saved ? JSON.parse(saved) : [];
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  const [profileName, setProfileName] = useState(() => {
    return localStorage.getItem('profile-name') || 'Cinefilo';
  });

  const [profileAvatar, setProfileAvatar] = useState(() => {
    return localStorage.getItem('profile-avatar') || 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Felix';
  });

  useEffect(() => {
    localStorage.setItem('app-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('app-watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('app-watched', JSON.stringify(watched));
  }, [watched]);

  useEffect(() => {
    localStorage.setItem('profile-name', profileName);
  }, [profileName]);

  useEffect(() => {
    localStorage.setItem('profile-avatar', profileAvatar);
  }, [profileAvatar]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleFavorite = (movie: Movie) => {
    const exists = favorites.some((f) => f.id === movie.id);
    const movieTitle = movie.title || (movie as any).name || 'Filme/Série';
    if (exists) {
      setFavorites((prev) => prev.filter((f) => f.id !== movie.id));
      showToast(`"${movieTitle}" removido dos favoritos.`, 'info');
    } else {
      setFavorites((prev) => [...prev, movie]);
      showToast(`"${movieTitle}" adicionado aos favoritos!`, 'success');
    }
  };

  const isFavorite = (id: number) => favorites.some((f) => f.id === id);

  const toggleWatchlist = (movie: Movie) => {
    const exists = watchlist.some((w) => w.id === movie.id);
    const movieTitle = movie.title || (movie as any).name || 'Filme/Série';
    if (exists) {
      setWatchlist((prev) => prev.filter((w) => w.id !== movie.id));
      showToast(`"${movieTitle}" removido da sua lista.`, 'info');
    } else {
      setWatchlist((prev) => [...prev, movie]);
      showToast(`"${movieTitle}" adicionado à Minha Lista!`, 'success');
    }
  };

  const isInWatchlist = (id: number) => watchlist.some((w) => w.id === id);

  const toggleWatched = (movie: Movie) => {
    const exists = watched.some((w) => w.id === movie.id);
    const movieTitle = movie.title || (movie as any).name || 'Filme/Série';
    if (exists) {
      setWatched((prev) => prev.filter((w) => w.id !== movie.id));
      showToast(`"${movieTitle}" removido de assistidos.`, 'info');
    } else {
      setWatched((prev) => [...prev, movie]);
      showToast(`"${movieTitle}" marcado como assistido!`, 'success');
    }
  };

  const isWatched = (id: number) => watched.some((w) => w.id === id);

  return (
    <MovieContext.Provider
      value={{
        favorites,
        watchlist,
        watched,
        toasts,
        toggleFavorite,
        isFavorite,
        toggleWatchlist,
        isInWatchlist,
        toggleWatched,
        isWatched,
        showToast,
        removeToast,
        profileName,
        setProfileName,
        profileAvatar,
        setProfileAvatar,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovies deve ser usado dentro de um MovieProvider');
  }
  return context;
};
