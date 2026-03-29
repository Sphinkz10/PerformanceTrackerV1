/**
 * SESSION DETAILS DRAWER - SEMANA 2 ENHANCED ✅
 * Drawer melhorado para mostrar detalhes completos da sessão
 * 
 * Features:
 * - Snapshot data (immutable)
 * - Exercise breakdown
 * - Athlete performance
 * - Personal records achieved
 * - Charts & visualizations
 * 
 * @since Semana 2 - Athlete Profile 100%
 */

import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Calendar, Clock, TrendingUp, Users, Dumbbell, 
  Award, Activity, BarChart3, CheckCircle, AlertCircle 
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner@2.0.3';

interface SessionDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  athleteId?: string; // If viewing from athlete profile
}

export function SessionDetailsDrawer({ isOpen, onClose, sessionId, athleteId }: SessionDetailsDrawerProps) {
  const [sessionData, setSessionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'exercises' | 'athletes'>('overview');

  // Fetch session details
  useEffect(() => {
    if (isOpen && sessionId) {
      fetchSessionDetails();
    }
  }, [isOpen, sessionId]);

  async function fetchSessionDetails() {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/sessions/${sessionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch session details');
      }

      const data = await response.json();
      setSessionData(data.session);
    } catch (error: any) {
      console.error('Error fetching session:', error);
      toast.error('Erro ao carregar sessão', {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className=\"fixed inset-0 bg-black/50 z-40\"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className=\"fixed right-0 top-0 h-full w-full sm:w-[600px] lg:w-[800px] bg-white shadow-2xl z-50 overflow-y-auto\"
          >
            {/* Header */}
            <div className=\"sticky top-0 bg-white border-b border-slate-200 p-4 sm:p-6 z-10\">
              <div className=\"flex items-start justify-between gap-4\">
                <div className=\"flex-1\">
                  {isLoading ? (
                    <div className=\"animate-pulse\">
                      <div className=\"h-6 bg-slate-200 rounded w-48 mb-2\"></div>
                      <div className=\"h-4 bg-slate-200 rounded w-32\"></div>
                    </div>
                  ) : (
                    <>
                      <h2 className=\"text-xl font-bold text-slate-900 mb-1\">
                        {sessionData?.title || 'Sessão'}
                      </h2>
                      <div className=\"flex items-center gap-3 text-sm text-slate-600\">
                        <div className=\"flex items-center gap-1\">
                          <Calendar className=\"h-4 w-4\" />
                          <span>{sessionData?.scheduled_date ? new Date(sessionData.scheduled_date).toLocaleDateString('pt-PT') : '-'}</span>
                        </div>
                        <div className=\"flex items-center gap-1\">
                          <Clock className=\"h-4 w-4\" />
                          <span>{sessionData?.start_time || '-'}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className=\"p-2 rounded-xl hover:bg-slate-100 transition-colors\"
                >
                  <X className=\"h-5 w-5 text-slate-600\" />
                </motion.button>
              </div>

              {/* Tabs */}
              {!isLoading && (
                <div className=\"flex gap-2 mt-4 overflow-x-auto pb-2\">
                  <TabButton
                    active={activeTab === 'overview'}
                    onClick={() => setActiveTab('overview')}
                    icon={Activity}
                    label=\"Visão Geral\"
                  />
                  <TabButton
                    active={activeTab === 'exercises'}
                    onClick={() => setActiveTab('exercises')}
                    icon={Dumbbell}
                    label=\"Exercícios\"
                  />
                  {!athleteId && ( // Only show if not filtered by athlete
                    <TabButton
                      active={activeTab === 'athletes'}
                      onClick={() => setActiveTab('athletes')}
                      icon={Users}
                      label=\"Atletas\"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Content */}
            <div className=\"p-4 sm:p-6 space-y-6\">
              {isLoading ? (
                <LoadingSkeleton />
              ) : (
                <>
                  {activeTab === 'overview' && <OverviewTab session={sessionData} athleteId={athleteId} />}
                  {activeTab === 'exercises' && <ExercisesTab session={sessionData} athleteId={athleteId} />}
                  {activeTab === 'athletes' && !athleteId && <AthletesTab session={sessionData} />}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// TAB BUTTON COMPONENT
// ============================================================================

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: any;
  label: string;
}

function TabButton({ active, onClick, icon: Icon, label }: TabButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
        active
          ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      }`}
    >
      <Icon className=\"h-4 w-4\" />
      {label}
    </motion.button>
  );
}

// ============================================================================
// OVERVIEW TAB
// ============================================================================

function OverviewTab({ session, athleteId }: { session: any; athleteId?: string }) {
  // Get athlete-specific data if athleteId provided
  const athleteData = athleteId 
    ? session.session_athletes?.find((sa: any) => sa.athlete_id === athleteId)
    : null;

  return (
    <div className=\"space-y-4\">
      {/* Status Badge */}
      <div className=\"flex items-center gap-2\">
        <StatusBadge status={session.status} />
        {session.type && (
          <span className=\"px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700\">
            {session.type}
          </span>
        )}
      </div>

      {/* Description */}
      {session.description && (
        <div className=\"rounded-xl border border-slate-200 bg-slate-50 p-4\">
          <p className=\"text-sm text-slate-700\">{session.description}</p>
        </div>
      )}

      {/* Key Stats */}
      <div className=\"grid grid-cols-2 gap-3\">
        <StatCard
          icon={TrendingUp}
          label=\"Volume Total\"
          value={athleteData?.volume_total || session.total_volume || 0}
          unit=\"AU\"
          color=\"emerald\"
        />
        <StatCard
          icon={Activity}
          label=\"RPE Médio\"
          value={athleteData?.avg_rpe || session.avg_rpe || 0}
          unit=\"/10\"
          color=\"amber\"
        />
        <StatCard
          icon={Clock}
          label=\"Duração\"
          value={session.duration || 0}
          unit=\"min\"
          color=\"sky\"
        />
        <StatCard
          icon={Dumbbell}
          label=\"Exercícios\"
          value={session.snapshot_data?.workout?.exercises?.length || 0}
          unit=\"\"
          color=\"violet\"
        />
      </div>

      {/* Personal Records Achieved */}
      {athleteData?.personal_records_achieved && athleteData.personal_records_achieved.length > 0 && (
        <div className=\"rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-4\">
          <div className=\"flex items-center gap-2 mb-3\">
            <Award className=\"h-5 w-5 text-amber-600\" />
            <h4 className=\"font-bold text-slate-900\">Recordes Alcançados</h4>
          </div>
          <div className=\"space-y-2\">
            {athleteData.personal_records_achieved.map((pr: any, index: number) => (
              <div key={index} className=\"flex items-center justify-between py-2 border-b border-amber-100 last:border-0\">
                <span className=\"text-sm font-medium text-slate-900\">{pr.name}</span>
                <span className=\"text-sm font-bold text-amber-600\">{pr.value} {pr.unit}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {session.notes && (
        <div className=\"rounded-xl border border-slate-200 bg-white p-4\">
          <h4 className=\"text-sm font-bold text-slate-900 mb-2\">Notas</h4>
          <p className=\"text-sm text-slate-600\">{session.notes}</p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// EXERCISES TAB
// ============================================================================

function ExercisesTab({ session, athleteId }: { session: any; athleteId?: string }) {
  const exercises = session.snapshot_data?.workout?.exercises || [];
  
  if (exercises.length === 0) {
    return (
      <div className=\"text-center py-12\">
        <Dumbbell className=\"h-12 w-12 text-slate-300 mx-auto mb-3\" />
        <p className=\"text-sm text-slate-600\">Nenhum exercício registado</p>
      </div>
    );
  }

  return (
    <div className=\"space-y-4\">
      {exercises.map((exercise: any, index: number) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className=\"rounded-xl border border-slate-200 bg-white p-4\"
        >
          <div className=\"flex items-start justify-between mb-3\">
            <div>
              <h4 className=\"font-bold text-slate-900\">{exercise.name}</h4>
              {exercise.notes && (
                <p className=\"text-xs text-slate-600 mt-1\">{exercise.notes}</p>
              )}
            </div>
            <span className=\"px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700\">
              {exercise.sets?.length || 0} séries
            </span>
          </div>

          {/* Sets */}
          {exercise.sets && exercise.sets.length > 0 && (
            <div className=\"space-y-2\">
              {exercise.sets.map((set: any, setIndex: number) => (
                <div 
                  key={setIndex}
                  className=\"flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg text-sm\"
                >
                  <span className=\"font-medium text-slate-600\">Série {setIndex + 1}</span>
                  <div className=\"flex items-center gap-4 text-slate-900\">
                    {set.reps && <span>{set.reps} reps</span>}
                    {set.weight && <span>{set.weight}kg</span>}
                    {set.distance && <span>{set.distance}m</span>}
                    {set.duration && <span>{set.duration}s</span>}
                    {set.rpe && (
                      <span className=\"font-bold text-amber-600\">RPE {set.rpe}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// ============================================================================
// ATHLETES TAB
// ============================================================================

function AthletesTab({ session }: { session: any }) {
  const athletes = session.session_athletes || [];

  if (athletes.length === 0) {
    return (
      <div className=\"text-center py-12\">
        <Users className=\"h-12 w-12 text-slate-300 mx-auto mb-3\" />
        <p className=\"text-sm text-slate-600\">Nenhum atleta registado</p>
      </div>
    );
  }

  return (
    <div className=\"space-y-3\">
      {athletes.map((athlete: any, index: number) => (
        <motion.div
          key={athlete.athlete_id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className=\"rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow\"
        >
          <div className=\"flex items-center justify-between mb-3\">
            <div className=\"flex items-center gap-3\">
              <div className=\"h-10 w-10 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center\">
                <span className=\"text-white font-bold text-sm\">
                  {athlete.athlete?.name?.charAt(0) || '?'}
                </span>
              </div>
              <div>
                <p className=\"font-bold text-slate-900\">{athlete.athlete?.name || 'Atleta'}</p>
                <p className=\"text-xs text-slate-600\">#{athlete.athlete_id.slice(0, 8)}</p>
              </div>
            </div>
            {athlete.status && (
              <StatusBadge status={athlete.status} />
            )}
          </div>

          {/* Stats Grid */}
          <div className=\"grid grid-cols-3 gap-2\">
            <div className=\"text-center p-2 rounded-lg bg-emerald-50\">
              <p className=\"text-xs text-emerald-600 font-medium mb-1\">Volume</p>
              <p className=\"text-sm font-bold text-slate-900\">{athlete.volume_total || 0}</p>
            </div>
            <div className=\"text-center p-2 rounded-lg bg-amber-50\">
              <p className=\"text-xs text-amber-600 font-medium mb-1\">RPE</p>
              <p className=\"text-sm font-bold text-slate-900\">{athlete.avg_rpe || 0}</p>
            </div>
            <div className=\"text-center p-2 rounded-lg bg-sky-50\">
              <p className=\"text-xs text-sky-600 font-medium mb-1\">Sets</p>
              <p className=\"text-sm font-bold text-slate-900\">{athlete.total_sets || 0}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string; icon: any }> = {
    completed: { label: 'Completo', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
    scheduled: { label: 'Agendado', color: 'bg-sky-100 text-sky-700', icon: Calendar },
    in_progress: { label: 'Em Progresso', color: 'bg-amber-100 text-amber-700', icon: Clock },
    cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-700', icon: AlertCircle },
  };

  const { label, color, icon: Icon } = config[status] || config.scheduled;

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}>
      <Icon className=\"h-3 w-3\" />
      {label}
    </div>
  );
}

interface StatCardProps {
  icon: any;
  label: string;
  value: number;
  unit: string;
  color: 'emerald' | 'amber' | 'sky' | 'violet';
}

function StatCard({ icon: Icon, label, value, unit, color }: StatCardProps) {
  const colors = {
    emerald: 'from-emerald-500 to-emerald-600 text-emerald-600',
    amber: 'from-amber-500 to-amber-600 text-amber-600',
    sky: 'from-sky-500 to-sky-600 text-sky-600',
    violet: 'from-violet-500 to-violet-600 text-violet-600',
  };

  const colorClass = colors[color];
  const [gradient, textColor] = colorClass.split(' ').slice(0, 2).join(' ').split(' ');

  return (
    <div className=\"rounded-xl border border-slate-200 bg-white p-3\">
      <div className=\"flex items-center gap-2 mb-2\">
        <div className={`h-6 w-6 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <Icon className=\"h-3 w-3 text-white\" />
        </div>
        <p className=\"text-xs font-medium text-slate-600\">{label}</p>
      </div>
      <p className={`text-xl font-bold ${textColor}`}>
        {value}{unit}
      </p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className=\"space-y-4 animate-pulse\">
      <div className=\"h-20 bg-slate-200 rounded-xl\"></div>
      <div className=\"grid grid-cols-2 gap-3\">
        <div className=\"h-24 bg-slate-200 rounded-xl\"></div>
        <div className=\"h-24 bg-slate-200 rounded-xl\"></div>
        <div className=\"h-24 bg-slate-200 rounded-xl\"></div>
        <div className=\"h-24 bg-slate-200 rounded-xl\"></div>
      </div>
      <div className=\"h-32 bg-slate-200 rounded-xl\"></div>
    </div>
  );
}
