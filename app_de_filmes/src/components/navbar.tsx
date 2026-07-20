import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Search, Clapperboard } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useMovies } from '../context/MovieContext';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { profileAvatar, profileName } = useMovies();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fecha menu mobile quando mudar de rota
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal)}`);
      setSearchVal('');
      setSearchOpen(false);
    }
  };

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Filmes', path: '/movies' },
    { name: 'Séries', path: '/tvshows' },
    { name: 'Favoritos', path: '/favorites' },
    { name: 'Minha Lista', path: '/watchlist' },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
        scrolled
          ? theme === 'dark'
            ? 'glassmorphism shadow-lg py-3'
            : 'glassmorphism-light shadow-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-netflix-red to-disney-blue flex items-center justify-center shadow-lg shadow-netflix-red/20 group-hover:scale-105 transition-transform">
            <Clapperboard className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-wider font-poppins bg-gradient-to-r from-white via-slate-100 to-gray-400 dark:from-white dark:via-slate-100 dark:to-gray-400 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
            Cine<span className="text-[#E50914] dark:text-[#E50914]">Stream</span>
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-6">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-semibold tracking-wide transition-all duration-300 relative py-1 hover:text-[#E50914] ${
                  isActive
                    ? 'text-[#E50914] font-bold'
                    : 'text-gray-400 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.name}
                  {isActive && (
                    <motion.span
                      layoutId="navUnderline"
                      className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-[#E50914] to-[#3B82F6] rounded-full"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ICONS & CONTROLS */}
        <div className="flex items-center gap-4">
          {/* SEARCH TRIGGER */}
          <div className="relative">
            <AnimatePresence>
              {searchOpen && (
                <motion.form
                  onSubmit={handleSearchSubmit}
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-gray-100 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-700/60 rounded-full px-3 py-1.5 overflow-hidden"
                >
                  <input
                    type="text"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    placeholder="Pesquisar..."
                    className="w-full bg-transparent text-sm text-gray-900 dark:text-white outline-none placeholder-gray-400 dark:placeholder-gray-500 pr-5"
                    autoFocus
                  />
                  <button type="submit" className="hidden" />
                </motion.form>
              )}
            </AnimatePresence>
            
            <button
              onClick={() => {
                if (searchOpen && searchVal.trim()) {
                  navigate(`/search?q=${encodeURIComponent(searchVal)}`);
                  setSearchVal('');
                  setSearchOpen(false);
                } else {
                  setSearchOpen(!searchOpen);
                }
              }}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800/60 text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800/60 text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* PROFILE BUTTON */}
          <Link
            to="/profile"
            className="flex items-center gap-2 group p-1 pr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors"
          >
            <img
              src={profileAvatar}
              alt={profileName}
              className="w-8 h-8 rounded-full object-cover border-2 border-transparent group-hover:border-[#E50914] transition-all"
            />
            <span className="hidden lg:inline text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
              {profileName}
            </span>
          </Link>

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800/60 text-gray-400 hover:text-gray-850 dark:hover:text-white md:hidden transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-gray-200 dark:border-gray-800/50 bg-white/95 dark:bg-[#0D1117]/95 backdrop-blur-md"
          >
            <nav className="flex flex-col px-4 py-4 gap-3">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-xl text-base font-semibold tracking-wide transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#E50914]/10 to-[#3B82F6]/10 border-l-4 border-[#E50914] text-[#E50914]'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/30 hover:text-gray-900 dark:hover:text-white'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
