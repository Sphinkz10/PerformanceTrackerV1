import { useLibraryStore } from '../store/useLibraryStore'
import { filterAssets } from '../engine/filterAssets'
import { computeAssetScore } from '../engine/score'

export default function LibraryPage() {
  const {
    assets,
    search,
    activeTab,
    setSearch,
    setTab,
    sortBy,
    setSort
  } = useLibraryStore()

  const filtered = filterAssets(assets, search, activeTab)

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    if (sortBy === 'stress') return b.stressScore - a.stressScore
    if (sortBy === 'usage') return b.usageCount - a.usageCount
    return computeAssetScore(b) - computeAssetScore(a)
  })

  return (
    <div className="h-screen flex flex-col bg-surf-bg p-6 lg:p-10">
      {/* HEADER */}
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-display text-white">Library Vault</h1>
          <p className="text-white/50 text-sm mt-1">Todos os teus exercícios, treinos e planos num ecossistema único</p>
        </div>

        <div className="flex gap-4 items-center">
          <select
            value={sortBy}
            onChange={(e) => setSort(e.target.value as any)}
            className="bg-surf-inner border border-white/10 text-white/70 text-sm px-4 py-2.5 rounded-xl hover:border-white/20 transition-colors focus:outline-none"
          >
            <option value="recent">Recentes</option>
            <option value="stress">Stress</option>
            <option value="usage">Uso</option>
          </select>

          <button className="bg-teal-500 hover:bg-teal-400 text-black font-label px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all">
            + Novo Asset
          </button>
        </div>
      </header>

      {/* CONTROLOS */}
      <div className="flex gap-3 mb-8 items-center bg-surf-inner border border-white/5 p-2 rounded-2xl w-fit xl:w-full">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar exercícios, músculos, tags..."
          className="w-full min-w-[300px] bg-transparent px-4 py-2 text-white/90 focus:outline-none placeholder:text-white/30 text-sm"
        />

        <div className="flex bg-surf-bg rounded-xl border border-white/5 p-1 shrink-0">
          {['all', 'exercise', 'workout', 'plan'].map(tab => (
            <button
              key={tab}
              onClick={() => setTab(tab as any)}
              className={`px-5 py-2 rounded-lg text-xs font-label capitalize transition-all ${
                activeTab === tab ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/70'
              }`}
            >
              {tab === 'all' ? 'Todos' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 overflow-y-auto custom-scrollbar pb-10">
        {sorted.map(asset => (
          <div
            key={asset.id}
            className="bg-surf-inner border border-white/5 rounded-2xl p-5 hover:border-teal-500/50 transition-all group flex flex-col hover:shadow-[0_0_30px_rgba(20,184,166,0.05)] cursor-default"
          >
            {/* META HEADER */}
            <div className="flex justify-between items-center mb-3">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-label tracking-widest uppercase
                ${asset.type === 'exercise' ? 'bg-blue-500/10 text-blue-400' :
                  asset.type === 'workout' ? 'bg-teal-500/10 text-teal-400' : 
                  'bg-amber-500/10 text-amber-400'}`}>
                {asset.type}
              </span>
              <span className="text-white/30 text-[10px]">v.1.0</span>
            </div>

            {/* TITLE */}
            <h3 className="text-white font-display text-xl mb-4 truncate group-hover:text-teal-50">
              {asset.title}
            </h3>

            {/* STRESS BAR */}
            <div className="mb-4">
               <div className="flex justify-between items-end mb-1.5">
                  <span className="text-white/40 text-[10px] font-label uppercase">Stress Sistémico</span>
                  <span className="text-teal-400/80 text-[10px]">{asset.stressScore} / 100</span>
               </div>
               <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                 <div
                   className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all"
                   style={{ width: `${Math.min(asset.stressScore, 100)}%` }}
                 />
               </div>
            </div>

            {/* TAGS */}
            <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
              {asset.tags.map(t => (
                <span key={t} className="text-[10px] bg-white/5 text-white/60 px-2 py-1 rounded">
                  {t}
                </span>
              ))}
            </div>

            {/* META FLOOR */}
            <div className="flex justify-between items-center text-xs text-white/50 border-t border-white/5 pt-3">
              <span className="flex items-center gap-1">⏱️ {asset.usageCount} Usos</span>
              <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${
                asset.riskLevel === 'high'
                  ? 'bg-red-500/10 text-red-400'
                  : asset.riskLevel === 'medium'
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'bg-teal-500/10 text-teal-400'
              }`}>
                RISCO: {asset.riskLevel.toUpperCase()}
              </span>
            </div>

            {/* ACTIONS OVERLAY */}
            <div className="absolute inset-0 bg-surf-bg/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all rounded-2xl flex items-center justify-center gap-2 p-4 pointer-events-none group-hover:pointer-events-auto">
              <button className="bg-teal-500 text-black font-label text-xs px-4 py-2 rounded-xl hover:bg-teal-400 hover:scale-105 transition-all">
                Usar Agora
              </button>
              <button className="bg-white/10 text-white font-label text-xs px-4 py-2 rounded-xl hover:bg-white/20 transition-all border border-white/5">
                Editar
              </button>
            </div>
          </div>
        ))}

        {sorted.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
            <span className="text-4xl mb-4">🗄️</span>
            <h3 className="text-white text-lg font-display mb-1">Nenhum Asset Encontrado</h3>
            <p className="text-white/40 text-sm">A tua pesquisa não retornou nenhum ativo fisiológico.</p>
          </div>
        )}
      </div>
    </div>
  )
}
