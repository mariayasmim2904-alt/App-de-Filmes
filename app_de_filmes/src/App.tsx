import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { MovieProvider } from './context/MovieContext';
import { AnimatePresence, motion } from 'framer-motion';

// Componentes
import Navbar from './components/navbar';
import Footer from './components/footer';
import ToastContainer from './components/toast';

// Páginas
import Home from './pages/home';
import Movies from './pages/movies';
import TVShows from './pages/tvshows';
import MovieDetailsPage from './pages/moviedetails';
import Favorites from './pages/favorites';
import Watchlist from './pages/watchlist';
import SearchPage from './pages/search';
import Profile from './pages/profile';
import NotFound from './pages/notfound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
};

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#0D1117] text-[#E6EDF2]' : 'bg-[#F8FAFC] text-gray-800'
    }`}>
      {/* NAVBAR */}
      <Navbar />

      {/* ROTA ATUAL COM ANIMAÇÃO */}
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/movies" element={<PageTransition><Movies /></PageTransition>} />
            <Route path="/tvshows" element={<PageTransition><TVShows /></PageTransition>} />
            <Route path="/movie/:id" element={<PageTransition><MovieDetailsPage /></PageTransition>} />
            <Route path="/tv/:id" element={<PageTransition><MovieDetailsPage /></PageTransition>} />
            <Route path="/favorites" element={<PageTransition><Favorites /></PageTransition>} />
            <Route path="/watchlist" element={<PageTransition><Watchlist /></PageTransition>} />
            <Route path="/search" element={<PageTransition><SearchPage /></PageTransition>} />
            <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <Footer />

      {/* NOTIFICAÇÕES FLOATING TOASTS */}
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <MovieProvider>
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </MovieProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
