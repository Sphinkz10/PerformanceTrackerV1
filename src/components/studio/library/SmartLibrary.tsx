import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Library,
  Search,
  Filter,
  Grid3x3,
  List,
  Star,
  Clock,
  Trash2,
  Copy,
  Play,
  Download,
  Eye,
  Heart,
  TrendingUp,
  Folder,
  Tag,
  ChevronRight,
} from 'lucide-react';

export function SmartLibrary() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  // Mock data de todos os conteúdos
  const allContent = [
    {
      id: 1,
      type: 'exercise',
      name: 'Back Squat Progressivo',
      emoji: '🏋️',
      category: 'Força',
      usageCount: 45,
      isFavorite: true,
      lastUsed: 'Há 2 horas',
      createdAt: '2024-01-15',
      tags: ['Pernas', 'Força', 'Composto'],
      color: 'red',
    },
    {
      id: 2,
      type: 'workout',
      name: 'Upper Body Strength',
      emoji: '💪',
      category: 'Força',
      usageCount: 34,
      isFavorite: true,
      lastUsed: 'Ontem',
      createdAt: '2024-01-10',
      tags: ['Upper', 'Hipertrofia'],
      color: 'sky',
    },
    {
      id: 3,
      type: 'plan',
      name: 'Programa 4 Semanas',
      emoji: '📅',
      category: 'Hipertrofia',
      usageCount: 12,
      isFavorite: false,
      lastUsed: 'Há 3 dias',
      createdAt: '2024-01-05',
      tags: ['Hipertrofia', 'Intermediário'],
      color: 'emerald',
    },
    {
      id: 4,
      type: 'class',
      name: 'HIIT Avançado',
      emoji: '🔥',
      category: 'Cardio',
      usageCount: 28,
      isFavorite: true,
      lastUsed: 'Há 1 semana',
      createdAt: '2024-01-01',
      tags: ['HIIT', 'Grupo', 'Cardio'],
      color: 'purple',
    },
    {
      id: 5,
      type: 'exercise',
      name: 'Bench Press',
      emoji: '🏋️',
      category: 'Força',
      usageCount: 52,
      isFavorite: true,
      lastUsed: 'Há 4 horas',
      createdAt: '2024-01-12',
      tags: ['Peito', 'Força'],
      color: 'red',
    },
    {
      id: 6,
      type: 'workout',
      name: 'Leg Day Massacre',
      emoji: '🦵',
      category: 'Hipertrofia',
      usageCount: 19,
      isFavorite: false,
      lastUsed: 'Há 2 dias',
      createdAt: '2024-01-08',
      tags: ['Pernas', 'Volume'],
      color: 'sky',
    },
  ];

  const categories = [
    { id: 'all', name: 'Todos', count: allContent.length, icon: Library },
    {
      id: 'exercise',
      name: 'Exercícios',
      count: allContent.filter((i) => i.type === 'exercise').length,
      icon: TrendingUp,
    },
    {
      id: 'workout',
      name: 'Treinos',
      count: allContent.filter((i) => i.type === 'workout').length,
      icon: List,
    },
    {
      id: 'plan',
      name: 'Planos',
      count: allContent.filter((i) => i.type === 'plan').length,
      icon: Folder,
    },
    {
      id: 'class',
      name: 'Aulas',
      count: allContent.filter((i) => i.type === 'class').length,
      icon: Grid3x3,
    },
    {
      id: 'favorites',
      name: 'Favoritos',
      count: allContent.filter((i) => i.isFavorite).length,
      icon: Star,
    },
  ];

  const filteredContent = allContent.filter((item) => {
    const matchesCategory =
      filterCategory === 'all' ||
      item.type === filterCategory ||
      (filterCategory === 'favorites' && item.isFavorite);
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exercise':
        return '🏋️';
      case 'workout':
        return '📋';
      case 'plan':
        return '📅';
      case 'class':
        return '👥';
      default:
        return '📄';
    }
  };

  return (
    <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 max-w-7xl mx-auto pb-20 sm:pb-6">
      {/* Header com Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border-2 border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm"
      >
        <div className="flex items-start sm:items-center justify-between gap-4 mb-5 flex-col sm:flex-row">
          <div>
            <h3 className="text-slate-900 mb-1 flex items-center gap-2">
              <Library className="h-5 w-5 text-slate-600" />
              Biblioteca Completa
            </h3>
            <p className="text-sm text-slate-600">
              {filteredContent.length} itens encontrados
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-sky-100 text-sky-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Grid3x3 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-sky-100 text-sky-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Procurar por nome, categoria, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
            />
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-10 pr-8 py-2 text-sm border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all appearance-none cursor-pointer"
              >
                <option value="recent">Mais Recentes</option>
                <option value="popular">Mais Usados</option>
                <option value="name">Nome A-Z</option>
                <option value="favorites">Favoritos</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Categories Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat, index) => {
          const Icon = cat.icon;
          const isActive = filterCategory === cat.id;
          return (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30'
                  : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              {cat.name}
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  isActive ? 'bg-white/20' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {cat.count}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Content Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContent.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className={`group rounded-2xl border-2 border-${item.color}-200 bg-gradient-to-br from-${item.color}-50/50 to-white p-5 shadow-sm hover:shadow-xl transition-all cursor-pointer relative overflow-hidden`}
            >
              {/* Favorite Star */}
              {item.isFavorite && (
                <Star className="absolute top-3 right-3 h-5 w-5 text-amber-500 fill-amber-500" />
              )}

              {/* Icon */}
              <div
                className={`h-12 w-12 rounded-xl bg-${item.color}-100 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}
              >
                {item.emoji}
              </div>

              {/* Name */}
              <h4 className="text-slate-900 mb-2 truncate">{item.name}</h4>

              {/* Meta Info */}
              <div className="flex items-center gap-2 mb-3 text-sm text-slate-600">
                <span className="capitalize">{item.type}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {item.usageCount}x
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {item.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className={`px-2 py-1 rounded-lg text-xs font-medium bg-${item.color}-100 text-${item.color}-700`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="flex-1 px-3 py-2 bg-white border-2 border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                  <Play className="h-4 w-4 inline mr-1" />
                  Abrir
                </button>
                <button className="p-2 bg-white border-2 border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <Copy className="h-4 w-4" />
                </button>
              </div>

              {/* Last Used */}
              <p className="text-xs text-slate-500 mt-3">{item.lastUsed}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredContent.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ x: 4 }}
              className="group rounded-xl border-2 border-slate-200 bg-white p-4 hover:border-sky-300 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div
                  className={`h-12 w-12 rounded-xl bg-${item.color}-100 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform`}
                >
                  {item.emoji}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-slate-900 mb-1 truncate flex items-center gap-2">
                    {item.name}
                    {item.isFavorite && (
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500 shrink-0" />
                    )}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="capitalize">{item.type}</span>
                    <span>•</span>
                    <span>{item.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {item.usageCount}x
                    </span>
                    <span>•</span>
                    <span>{item.lastUsed}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="hidden lg:flex gap-2">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium bg-${item.color}-100 text-${item.color}-700`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                    <Heart className="h-5 w-5 text-slate-400" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                    <Copy className="h-5 w-5 text-slate-400" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                    <Download className="h-5 w-5 text-slate-400" />
                  </button>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-sky-500 transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredContent.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center"
        >
          <Library className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-slate-900 mb-2">Nenhum item encontrado</h3>
          <p className="text-sm text-slate-600">
            Tente ajustar os filtros de pesquisa
          </p>
        </motion.div>
      )}
    </div>
  );
}