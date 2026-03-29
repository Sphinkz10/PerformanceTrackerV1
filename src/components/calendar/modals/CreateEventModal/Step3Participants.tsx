/**
 * STEP 3: PARTICIPANTS
 * Multi-select athletes for the event
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  AlertCircle,
  Loader2,
  AlertTriangle,
  Info,
} from 'lucide-react';

import { CreateEventFormData } from '@/types/calendar';
import { AthleteSelector } from '../../components/AthleteSelector';
import { MOCK_ATHLETES, MockAthlete } from '../../utils/mockData';

interface Step3Props {
  formData: Partial<CreateEventFormData>;
  updateFormData: (updates: Partial<CreateEventFormData>) => void;
  workspaceId: string;
}

type Athlete = MockAthlete;

export function Step3Participants({
  formData,
  updateFormData,
  workspaceId,
}: Step3Props) {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedAthletes = formData.athlete_ids ?? [];
  const maxParticipants = formData.max_participants;

  useEffect(() => {
    fetchAthletes();
  }, [workspaceId]);

  const fetchAthletes = async () => {
    setLoading(true);
    setError(null);

    try {
      // Mock centralizado por agora
      setAthletes(MOCK_ATHLETES as Athlete[]);
    } catch (err) {
      console.error('Error fetching athletes:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const isAtCapacity =
    typeof maxParticipants === 'number' &&
    selectedAthletes.length >= maxParticipants;

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex flex-col items-center justify-center py-12"
      >
        <Loader2 className="h-8 w-8 animate-spin text-sky-500 mb-3" />
        <p className="text-sm font-medium text-slate-700">
          A carregar atletas...
        </p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex flex-col items-center justify-center py-12"
      >
        <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center mb-3">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>

        <p className="text-sm font-semibold text-slate-900 mb-1">
          Erro ao carregar atletas
        </p>

        <p className="text-xs text-slate-600 mb-4">{error}</p>

        <button
          onClick={fetchAthletes}
          className="px-4 py-2 text-sm font-semibold rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition-colors"
        >
          Tentar novamente
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          Adicionar Participantes
        </h3>
        <p className="text-sm text-slate-600">
          Selecione os atletas que participarão neste evento
        </p>
      </div>

      <AthleteSelector
        athletes={athletes}
        selectedAthletes={selectedAthletes}
        maxParticipants={maxParticipants}
        onSelectionChange={(selectedIds) =>
          updateFormData({ athlete_ids: selectedIds })
        }
        showAvailability={true}
        eventDate={formData.start_date}
      />

      {typeof maxParticipants === 'number' && isAtCapacity && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-amber-50 border border-amber-200 p-3"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <p className="text-sm font-medium text-amber-900">
              Capacidade máxima atingida ({maxParticipants} participantes)
            </p>
          </div>
        </motion.div>
      )}

      {athletes.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto mb-3 text-slate-400" />
          <p className="text-sm font-medium text-slate-700 mb-1">
            Nenhum atleta ativo
          </p>
          <p className="text-xs text-slate-500">
            Adicione atletas primeiro no menu Atletas
          </p>
        </div>
      )}

      {selectedAthletes.length === 0 && athletes.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl bg-sky-50 border border-sky-200 p-4"
        >
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-sky-500 flex items-center justify-center shrink-0">
              <Info className="h-4 w-4 text-white" />
            </div>

            <div>
              <h5 className="font-semibold text-sky-900 mb-1">
                Participantes opcionais
              </h5>
              <p className="text-sm text-sky-700">
                Pode criar o evento sem participantes e adicioná-los depois,
                ou selecionar agora os atletas que participarão.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}