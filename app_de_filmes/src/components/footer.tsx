import React from 'react';
import { Link } from 'react-router-dom';
import { Clapperboard, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-[#070A0F] text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800/40 py-12 px-6 sm:px-12 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/* LOGO & DESCRIPTION */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#E50914] to-[#3B82F6] flex items-center justify-center">
              <Clapperboard className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-wider font-poppins text-gray-900 dark:text-white">
              Cine<span className="text-[#E50914]">Stream</span>
            </span>
          </Link>
          <p className="text-xs max-w-sm leading-relaxed text-gray-500 dark:text-gray-400">
            Seu portal definitivo de entretenimento. Descubra lançamentos, assista trailers oficiais e gerencie sua própria lista de filmes favoritos.
          </p>
        </div>

        {/* TMDB ATTRIBUTION */}
        <div className="flex flex-col items-center gap-2 text-center">
          <img
              src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c68bc55e9827250e9573fbc.svg"
              alt="TMDB Logo"
              className="w-28 h-auto mx-auto"
            />
          <p className="text-[10px] max-w-xs leading-normal">
            Este produto utiliza a API do TMDB, mas não é endossado ou certificado pelo TMDB.
          </p>
        </div>

        {/* NAVIGATION LINKS & SOCIALS */}
        <div className="flex flex-col items-center md:items-end gap-4">
          <div className="flex gap-4 text-sm font-medium">
            <Link to="/" className="hover:text-[#E50914] transition-colors">Início</Link>
            <Link to="/movies" className="hover:text-[#E50914] transition-colors">Filmes</Link>
            <Link to="/tvshows" className="hover:text-[#E50914] transition-colors">Séries</Link>
            <Link to="/favorites" className="hover:text-[#E50914] transition-colors">Favoritos</Link>
          </div>
          <div className="flex gap-3">
            <a
              href="https://themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-white hover:bg-[#3B82F6] transition-all"
            >
              <Globe className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-gray-200 dark:border-gray-800/20 text-center text-[11px] text-gray-600 dark:text-gray-500">
        &copy; {new Date().getFullYear()} CineStream. Projetado para amantes do cinema. Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;
