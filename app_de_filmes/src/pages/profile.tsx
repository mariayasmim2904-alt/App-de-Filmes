import React, { useState } from 'react';
import { useMovies } from '../context/MovieContext';
import { Heart, Eye, Play, Award, Save, Edit3, Image } from 'lucide-react';

const PRESET_AVATARS = [
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Felix',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Ane',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Jack',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Milo',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Buster',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Cleo'
];

const GENRE_MAP: Record<number, string> = {
  28: 'Ação', 12: 'Aventura', 16: 'Animação', 35: 'Comédia', 80: 'Crime',
  99: 'Documentário', 18: 'Drama', 10751: 'Família', 14: 'Fantasia',
  36: 'História', 27: 'Terror', 10402: 'Música', 9648: 'Mistério',
  10749: 'Romance', 878: 'Ficção Científica', 10770: 'Cinema TV',
  53: 'Suspense', 10752: 'Guerra', 37: 'Faroeste'
};

export const Profile: React.FC = () => {
  const { 
    favorites, 
    watchlist, 
    watched, 
    profileName, 
    setProfileName, 
    profileAvatar, 
    setProfileAvatar,
    showToast
  } = useMovies();

  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(profileName);
  const [selectedAvatar, setSelectedAvatar] = useState(profileAvatar);

  const handleSave = () => {
    if (!tempName.trim()) {
      showToast('O nome não pode ficar em branco.', 'error');
      return;
    }
    setProfileName(tempName);
    setProfileAvatar(selectedAvatar);
    setIsEditing(false);
    showToast('Perfil atualizado com sucesso!', 'success');
  };

  // Calcula estatísticas de gêneros dinamicamente a partir dos favoritos
  const genreStats = React.useMemo(() => {
    const counts: Record<string, number> = {};
    
    favorites.forEach((movie) => {
      movie.genre_ids?.forEach((genreId) => {
        const name = GENRE_MAP[genreId];
        if (name) {
          counts[name] = (counts[name] || 0) + 1;
        }
      });
    });

    const totalGenresCount = Object.values(counts).reduce((acc, curr) => acc + curr, 0);
    
    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalGenresCount > 0 ? Math.round((count / totalGenresCount) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5
  }, [favorites]);

  // Cores dinâmicas para os gêneros
  const colors = [
    'bg-[#E50914]', // Vermelho
    'bg-[#3B82F6]', // Azul
    'bg-emerald-500', 
    'bg-amber-500', 
    'bg-purple-500'
  ];

  return (
    <div className="w-full bg-[#F8FAFC] dark:bg-[#0D1117] min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        
        {/* HEADER */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-poppins text-gray-900 dark:text-white flex items-center gap-2">
            Meu Perfil
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gerencie seu cadastro e confira suas estatísticas de exibição.
          </p>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-gray-800/40 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center transition-colors">
          {/* AVATAR DISPLAY */}
          <div className="flex flex-col items-center gap-3">
            <img
              src={selectedAvatar}
              alt="Avatar"
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-850 shadow-md bg-gray-900"
            />
            {isEditing && (
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Image className="w-3.5 h-3.5" /> Escolha um avatar
              </span>
            )}
          </div>

          {/* EDIT FORM */}
          <div className="flex-1 flex flex-col gap-6 w-full">
            {isEditing ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nome de Exibição</label>
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="w-full max-w-md bg-gray-150 dark:bg-[#0D1117] text-gray-900 dark:text-white rounded-xl px-4 py-3 border border-gray-300 dark:border-gray-700/60 focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                    maxLength={20}
                  />
                </div>

                {/* AVATAR PICKER */}
                <div className="flex flex-wrap gap-2.5 mt-2">
                  {PRESET_AVATARS.map((avatar) => (
                    <button
                      key={avatar}
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all hover:scale-105 cursor-pointer ${
                        selectedAvatar === avatar ? 'border-[#E50914] scale-110' : 'border-transparent'
                      }`}
                    >
                      <img src={avatar} alt="Preset Avatar" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
                  >
                    <Save className="w-4 h-4" /> Salvar Alterações
                  </button>
                  <button
                    onClick={() => {
                      setTempName(profileName);
                      setSelectedAvatar(profileAvatar);
                      setIsEditing(false);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gray-250 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-705 dark:text-white text-xs font-bold cursor-pointer transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center md:items-start gap-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Usuário Premium</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 dark:text-white font-poppins text-center md:text-left">
                  {profileName}
                </h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 mt-2 px-4 py-2 text-xs font-bold bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-800 dark:text-white rounded-xl border border-gray-300 dark:border-white/10 transition-all cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Editar Perfil
                </button>
              </div>
            )}
          </div>
        </div>

        {/* STATISTICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-gray-200 dark:border-gray-800/40 shadow-sm flex items-center gap-4 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#E50914]/10 flex items-center justify-center text-[#E50914]">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider block">Favoritos</span>
              <span className="text-xl sm:text-2xl font-extrabold text-gray-950 dark:text-white font-poppins">{favorites.length}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-gray-200 dark:border-gray-800/40 shadow-sm flex items-center gap-4 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6]">
              <Play className="w-6 h-6 fill-current ml-0.5" />
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider block">Minha Lista</span>
              <span className="text-xl sm:text-2xl font-extrabold text-gray-950 dark:text-white font-poppins">{watchlist.length}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-gray-200 dark:border-gray-800/40 shadow-sm flex items-center gap-4 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Eye className="w-6 h-6 fill-current" />
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider block">Assistidos</span>
              <span className="text-xl sm:text-2xl font-extrabold text-gray-950 dark:text-white font-poppins">{watched.length}</span>
            </div>
          </div>
        </div>

        {/* GENRE PREFERENCES */}
        <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-gray-800/40 rounded-3xl p-6 sm:p-8 shadow-sm transition-colors">
          <h2 className="text-xl font-bold font-poppins text-gray-990 dark:text-white mb-6 flex items-center gap-2 border-b border-gray-200 dark:border-gray-800/60 pb-3">
            <Award className="w-5 h-5 text-amber-500" /> Preferências de Gêneros
          </h2>

          {genreStats.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">
              Adicione filmes aos seus <strong className="text-[#E50914]">Favoritos</strong> para gerar estatísticas personalizadas de gêneros!
            </p>
          ) : (
            <div className="flex flex-col gap-5">
              {genreStats.map((item, index) => (
                <div key={item.name} className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-gray-850 dark:text-gray-200">{item.name}</span>
                    <span className="text-gray-400">{item.percentage}% ({item.count} título{item.count > 1 ? 's' : ''})</span>
                  </div>
                  {/* PROGRESS BAR */}
                  <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${colors[index % colors.length]}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
