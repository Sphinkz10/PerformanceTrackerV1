/**
 * TEAM GROUP MANAGER
 * UI for managing team groups with analytics and bulk operations
 */

import { motion, AnimatePresence } from 'motion/react';
import { Users, Plus, Trash2, Edit2, X, UserPlus } from 'lucide-react';
import { TeamGroup } from '@/types/team';
import { MOCK_ATHLETES, MOCK_COACHES } from '../utils/mockData';

interface TeamGroupManagerProps {
  workspaceId: string;
  onSelectGroup: (group: TeamGroup | null) => void;
  selectedGroup: TeamGroup | null;
}

export function TeamGroupManager({
  workspaceId,
  onSelectGroup,
  selectedGroup
}: TeamGroupManagerProps) {
  const {
    groups,
    isLoading,
    createGroup,
    updateGroup,
    deleteGroup,
    getGroupAnalytics,
    bulkSchedule,
  } = useTeamGroups(workspaceId);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBulkScheduleOpen, setIsBulkScheduleOpen] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [groupToEdit, setGroupToEdit] = useState<TeamGroup | null>(null);
  
  // Analytics state
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  
  const handleCreateGroup = async (group: Partial<TeamGroup>) => {
    await createGroup(group);
    setIsCreateModalOpen(false);
  };
  
  const handleUpdateGroup = async (group: Partial<TeamGroup>) => {
    if (groupToEdit) {
      await updateGroup(groupToEdit.id, group);
      setIsEditModalOpen(false);
      setGroupToEdit(null);
    }
  };
  
  const handleDeleteGroup = async (groupId: string) => {
    if (confirm('Tem a certeza que deseja eliminar este grupo?')) {
      await deleteGroup(groupId);
      if (selectedGroup?.id === groupId) {
        onSelectGroup(null);
      }
    }
  };
  
  const handleSelectGroup = async (group: TeamGroup) => {
    onSelectGroup(group);
    
    // Load analytics
    setIsLoadingAnalytics(true);
    try {
      const analytics = await getGroupAnalytics(group.id, {
        start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
        end: format(new Date(), 'yyyy-MM-dd'),
      });
      setAnalytics(analytics);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoadingAnalytics(false);
    }
  };
  
  const handleBulkSchedule = async (operation: any) => {
    const result = await bulkSchedule(operation);
    setIsBulkScheduleOpen(false);
    return result;
  };
  
  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin h-6 w-6 border-2 border-sky-500 border-t-transparent rounded-full mx-auto mb-2" />
        <p className="text-sm text-slate-600">A carregar grupos...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <Users className="h-5 w-5 text-sky-600" />
          Grupos de Equipa
        </h3>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md hover:from-sky-400 hover:to-sky-500 transition-all"
        >
          <Plus className="h-4 w-4" />
          Novo Grupo
        </motion.button>
      </div>
      
      {/* Groups List */}
      {groups.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
          <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-900 mb-1">
            Nenhum grupo criado
          </p>
          <p className="text-xs text-slate-600 mb-4">
            Crie grupos para organizar atletas e agendar em massa
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md hover:from-sky-400 hover:to-sky-500 transition-all"
          >
            <Plus className="h-4 w-4" />
            Criar Primeiro Grupo
          </motion.button>
        </div>
      ) : (
        <div className="space-y-2">
          {groups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleSelectGroup(group)}
              className={`group p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedGroup?.id === group.id
                  ? 'border-sky-300 bg-sky-50/50 shadow-md'
                  : 'border-slate-200 bg-white hover:border-sky-200 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: group.color + '20' }}
                  >
                    <Users className="h-5 w-5" style={{ color: group.color }} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 truncate">
                      {group.name}
                    </h4>
                    {group.description && (
                      <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                        {group.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
                      <span>{group.athlete_ids.length} atletas</span>
                      {group.meta?.category && (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                          {group.meta.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setGroupToEdit(group);
                      setIsEditModalOpen(true);
                    }}
                    className="h-7 w-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center transition-all"
                  >
                    <Edit2 className="h-3.5 w-3.5 text-slate-600" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteGroup(group.id);
                    }}
                    className="h-7 w-7 rounded-lg border border-red-200 bg-white hover:bg-red-50 flex items-center justify-center transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-600" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Selected Group Actions */}
      <AnimatePresence>
        {selectedGroup && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-3 pt-3 border-t border-slate-200"
          >
            <h4 className="text-sm font-semibold text-slate-900">Ações Rápidas</h4>
            
            <div className="grid grid-cols-2 gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsBulkScheduleOpen(true)}
                className="flex items-center gap-2 p-3 rounded-xl border-2 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 transition-all"
              >
                <Zap className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-900">
                  Agendar em Massa
                </span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="flex items-center gap-2 p-3 rounded-xl border-2 border-violet-200 bg-violet-50 hover:bg-violet-100 transition-all"
              >
                <TrendingUp className="h-4 w-4 text-violet-600" />
                <span className="text-sm font-medium text-violet-900">
                  {showAnalytics ? 'Ocultar' : 'Ver'} Analytics
                </span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Analytics Panel */}
      <AnimatePresence>
        {showAnalytics && selectedGroup && analytics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <TeamAnalyticsPanel
              teamGroup={selectedGroup}
              analytics={analytics}
              dateRange={{
                start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
                end: format(new Date(), 'yyyy-MM-dd'),
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Modals */}
      <TeamGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateGroup}
        athletes={MOCK_ATHLETES}
        coaches={MOCK_COACHES}
      />
      
      <TeamGroupModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setGroupToEdit(null);
        }}
        onSave={handleUpdateGroup}
        existingGroup={groupToEdit || undefined}
        athletes={MOCK_ATHLETES}
        coaches={MOCK_COACHES}
      />
      
      {selectedGroup && (
        <BulkTeamScheduleModal
          isOpen={isBulkScheduleOpen}
          onClose={() => setIsBulkScheduleOpen(false)}
          onSchedule={handleBulkSchedule}
          teamGroup={selectedGroup}
        />
      )}
    </div>
  );
}