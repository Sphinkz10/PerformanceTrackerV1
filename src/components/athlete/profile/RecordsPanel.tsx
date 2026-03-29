/**
 * RECORDS PANEL (Supabase) ✅
 * - Usa metrics + metric_updates (sem /api)
 * - Remove workspace-demo / user-demo
 */

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Trophy, TrendingUp, Star, Award, Zap, Plus } from 'lucide-react';
import { PersonalRecord } from '@/types/athlete-profile';
import { CreateRecordModal, RecordFormData } from '@/components/athlete/modals/CreateRecordModal';
import { RecordDetailsDrawer } from '@/components/athlete/drawers/RecordDetailsDrawer';
import { toast } from 'sonner';
import { useApp } from '@/contexts/AppContext';

interface RecordsPanelProps {
  athleteId: string;
}

type MetricJoin = {
  id: string;
  name: string;
  unit: string | null;
  category: string | null;
  workspace_id: string;
};

type MetricUpdateRow = {
  id: string;
  value: number;
  recorded_at: string;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  metric: MetricJoin | null;
};

export function RecordsPanel({ athleteId }: RecordsPanelProps) {
  const { workspaceId, userId } = useApp();

  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PersonalRecord | null>(null);
  const [recordToEdit, setRecordToEdit] = useState<PersonalRecord | null>(null);

  const fetchRecords = useCallback(async () => {
    if (!athleteId || !workspaceId) return;

    try {
      setIsLoading(true);
      setError(null);

      const { supabase } = await import('@/lib/supabase/client');

      const { data, error } = await supabase
        .from('metric_updates')
        .select(`
          id,
          value,
          recorded_at,
          notes,
          created_by,
          created_at,
          metric:metrics (
            id,
            name,
            unit,
            category,
            workspace_id
          )
        `)
        .eq('athlete_id', athleteId)
        .order('recorded_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      // Filtra por workspace (porque metric_updates não tem workspace_id)
      const rows = (data || []) as MetricUpdateRow[];
      const scoped = rows.filter(r => r.metric?.workspace_id === workspaceId);

      // Mapeia para o formato esperado no UI (records[])
      const mapped = scoped.map(r => ({
        id: r.id,
        workspace_id: r.metric?.workspace_id,
        athlete_id: athleteId,
        metric_name: r.metric?.name,
        display_name: r.metric?.name,
        category: r.metric?.category || 'skill',
        value: r.value,
        unit: r.metric?.unit || '',
        achieved_at: r.recorded_at,
        source: 'manual',
        status: 'active',
        created_by: r.created_by,
        created_at: r.created_at,
        updated_at: null,
        improvement_percentage: 0,
        previous_value: null,
        notes: r.notes,
      }));

      setRecords(mapped);
    } catch (err: any) {
      console.error('Error fetching records:', err);
      setError(err?.message || 'Erro ao carregar recordes');
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  }, [athleteId, workspaceId]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const ensureMetric = async (metricName: string, displayName: string, category?: string, unit?: string) => {
    const { supabase } = await import('@/lib/supabase/client');

    // 1) tenta encontrar
    const { data: existing, error: findErr } = await supabase
      .from('metrics')
      .select('id,name,unit,category,workspace_id')
      .eq('workspace_id', workspaceId)
      .eq('name', metricName)
      .maybeSingle();

    if (findErr) throw findErr;
    if (existing?.id) return existing.id as string;

    // 2) cria se não existir
    const { data: created, error: createErr } = await supabase
      .from('metrics')
      .insert({
        workspace_id: workspaceId,
        name: metricName,
        description: displayName,
        unit: unit || null,
        metric_type: 'performance',
        data_type: 'numeric',
        category: category || null,
        is_active: true,
      })
      .select('id')
      .single();

    if (createErr) throw createErr;
    return created.id as string;
  };

  const handleCreateRecord = async (data: RecordFormData) => {
    try {
      if (!workspaceId) {
        toast.error('Workspace não carregado.');
        return;
      }

      const metricName = data.exerciseName.toLowerCase().replace(/\s+/g, '_');
      const metricId = await ensureMetric(metricName, data.exerciseName, data.category, data.unit);

      const { supabase } = await import('@/lib/supabase/client');

      const { error: insertErr } = await supabase
        .from('metric_updates')
        .insert({
          metric_id: metricId,
          athlete_id: athleteId,
          value: data.value,
          recorded_at: data.achievedDate || new Date().toISOString(),
          notes: data.notes || null,
          created_by: userId || null,
        });

      if (insertErr) throw insertErr;

      await fetchRecords();

      toast.success('🏆 Recorde criado!', {
        description: `${data.exerciseName}: ${data.value} ${data.unit}`,
      });

      setIsCreateModalOpen(false);
    } catch (err: any) {
      console.error('Error creating record:', err);
      toast.error('❌ Erro ao criar recorde', { description: err.message });
    }
  };

  const handleEditRecord = async (data: RecordFormData) => {
    if (!recordToEdit) return;

    try {
      const { supabase } = await import('@/lib/supabase/client');

      const { error: updateErr } = await supabase
        .from('metric_updates')
        .update({
          value: data.value,
          recorded_at: data.achievedDate || new Date().toISOString(),
          notes: data.notes || null,
        })
        .eq('id', recordToEdit.id);

      if (updateErr) throw updateErr;

      await fetchRecords();

      toast.success('✏️ Recorde atualizado!');
      setRecordToEdit(null);
    } catch (err: any) {
      console.error('Error updating record:', err);
      toast.error('❌ Erro ao atualizar recorde', { description: err.message });
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    try {
      const { supabase } = await import('@/lib/supabase/client');

      const { error: delErr } = await supabase
        .from('metric_updates')
        .delete()
        .eq('id', recordId);

      if (delErr) throw delErr;

      await fetchRecords();

      toast.success('🗑️ Recorde eliminado!', {
        description: 'O recorde foi removido com sucesso.',
      });

      setSelectedRecord(null);
    } catch (err: any) {
      console.error('Error deleting record:', err);
      toast.error('❌ Erro ao eliminar recorde', { description: err.message });
    }
  };

  const handleRecordClick = (record: any) => {
    const personalRecord: PersonalRecord = {
      id: record.id,
      workspace_id: record.workspace_id,
      athlete_id: record.athlete_id,
      metric_name: record.metric_name,
      display_name: record.display_name,
      category: record.category,
      value: record.value,
      unit: record.unit,
      achieved_at: record.achieved_at,
      source: record.source,
      status: record.status,
      created_by: record.created_by || userId || 'unknown',
      created_at: record.created_at,
      updated_at: record.updated_at,
      improvement_percentage: record.improvement_percentage || 0,
      previous_value: record.previous_value,
      notes: record.notes,
    };

    setSelectedRecord(personalRecord);
  };

  const athleteName = 'Atleta'; // TODO

  const getTypeColor = (category: string) => {
    switch (category) {
      case 'strength': return 'bg-red-50 text-red-600 border-red-200';
      case 'endurance': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'speed': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'skill': return 'bg-sky-50 text-sky-600 border-sky-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getTypeIcon = (category: string) => {
    switch (category) {
      case 'strength': return Trophy;
      case 'endurance': return Award;
      case 'speed': return Zap;
      default: return Star;
    }
  };

  if (isLoading) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-center py-8">
          <Trophy className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-600">Carregando recordes...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-center py-8">
          <Trophy className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-600">Erro ao carregar recordes: {error}</p>
        </div>
      </motion.div>
    );
  }

  if (records.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-center py-8">
          <Trophy className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-600">Nenhum recorde registado ainda</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Recordes & Marcos</h3>
            <p className="text-xs text-slate-500">{records.length} recordes registados</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Criar</span>
        </motion.button>
      </div>

      <div className="space-y-3">
        {records.map((record, index) => {
          const TypeIcon = getTypeIcon(record.category);

          return (
            <motion.button
              key={record.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              onClick={() => handleRecordClick(record)}
              className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group cursor-pointer text-left"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={`h-8 w-8 rounded-lg border flex items-center justify-center ${getTypeColor(record.category)}`}>
                  <TypeIcon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{record.display_name}</p>
                  <p className="text-xs text-slate-500">{new Date(record.achieved_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">{record.value}{record.unit}</p>
                {record.verified && (
                  <div className="flex items-center gap-1 text-xs text-emerald-600">
                    <TrendingUp className="h-3 w-3" />
                    <span className="font-medium">Verificado</span>
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      <CreateRecordModal
        isOpen={isCreateModalOpen || !!recordToEdit}
        onClose={() => {
          setIsCreateModalOpen(false);
          setRecordToEdit(null);
        }}
        athleteId={athleteId}
        athleteName={athleteName}
        record={recordToEdit}
        onSave={recordToEdit ? handleEditRecord : handleCreateRecord}
      />

      {selectedRecord && (
        <RecordDetailsDrawer
          isOpen={!!selectedRecord}
          onClose={() => setSelectedRecord(null)}
          record={selectedRecord}
          onEdit={(record) => {
            setRecordToEdit(record);
            setSelectedRecord(null);
          }}
          onDelete={handleDeleteRecord}
        />
      )}
    </motion.div>
  );
}
