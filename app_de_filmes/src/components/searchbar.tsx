import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  initialValue?: string;
  onSearch: (value: string) => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Pesquise por nome, gênero, ano, ator...",
  initialValue = "",
  onSearch,
  className = "",
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(value);
    }, 450); // Debounce de 450ms para diminuir requisições na API

    return () => clearTimeout(handler);
  }, [value, onSearch]);

  return (
    <div className={`relative w-full flex items-center ${className}`}>
      <Search className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-10 py-3 bg-gray-800/30 dark:bg-gray-800/20 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-700/50 rounded-full focus:outline-none focus:ring-2 focus:ring-[#E50914] focus:border-transparent transition-all backdrop-blur-sm shadow-inner"
      />
      {value && (
        <button
          onClick={() => setValue('')}
          className="absolute right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
