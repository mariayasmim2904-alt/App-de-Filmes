import React from 'react';
import { Link } from 'react-router-dom';
import { Clapperboard } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="w-full bg-[#F8FAFC] dark:bg-[#0D1117] min-h-screen flex flex-col items-center justify-center text-center p-6 transition-colors">
      <div className="w-20 h-20 bg-[#E50914]/15 rounded-full flex items-center justify-center text-[#E50914] mb-6 border border-[#E50914]/20 animate-bounce">
        <Clapperboard className="w-10 h-10" />
      </div>
      <h1 className="text-7xl sm:text-8xl font-black text-gray-900 dark:text-white mb-2 font-poppins bg-gradient-to-r from-[#E50914] to-[#3B82F6] bg-clip-text text-transparent">
        404
      </h1>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-250 mb-3">
        Corte final! Página não encontrada
      </h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8 text-sm sm:text-base">
        O título que você está procurando saiu do catálogo ou o link está incorreto.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-[#E50914] hover:bg-[#b80710] text-white rounded-xl font-bold shadow-lg shadow-red-500/25 transition-all hover:scale-105 cursor-pointer"
      >
        Voltar à Programação
      </Link>
    </div>
  );
};

export default NotFound;
