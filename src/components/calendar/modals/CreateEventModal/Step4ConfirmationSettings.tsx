/**
 * STEP 4: CONFIRMATION SETTINGS & RECURRENCE
 * Configurações de confirmações, notificações e recorrência
 */

import React, { useCallback } from 'react';
import { motion } from 'motion/react';
import { Bell, Mail, QrCode, Clock, AlertCircle, Repeat } from 'lucide-react';
import { CreateEventFormData } from '@/types/calendar';
import { RecurrenceSettings, type RecurrencePattern } from '../../components/RecurrenceSettings';

interface Step4ConfirmationSettingsProps {
  formData: Partial<CreateEventFormData>;
  updateFormData: (data: Partial<CreateEventFormData>) => void;
}

export function Step4ConfirmationSettings({
  formData,
  updateFormData,
}: Step4ConfirmationSettingsProps) {
  const confirmationSettings = formData.confirmation_settings || {
    auto_send: true,
    hours_before: 24,
    require_check_in: false,
    enable_reminders: true,
    reminder_hours_before: 2,
  };

  const updateSettings = (updates: Partial<typeof confirmationSettings>) => {
    updateFormData({
      confirmation_settings: {
        ...confirmationSettings,
        ...updates,
      },
    });
  };

  const hasParticipants = formData.athlete_ids && formData.athlete_ids.length > 0;

  const handleRecurrenceChange = useCallback(
    (pattern: RecurrencePattern | null) => {
      updateFormData({ recurrence_pattern: pattern });
    },
    [updateFormData]
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          ⚙️ Configurações de Confirmação
        </h3>
        <p className="text-sm text-slate-600">
          Configure como e quando os participantes serão notificados
        </p>
      </div>

      {/* Warning if no participants */}
      {!hasParticipants && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-amber-50 border border-amber-200"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900">
                Nenhum participante selecionado
              </p>
              <p className="text-sm text-amber-700 mt-1">
                As configurações de confirmação só serão aplicadas se adicionar participantes no passo anterior.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Auto Send Toggle */}
      <div className="rounded-xl border-2 border-slate-200 bg-white p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shrink-0">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900 mb-1">
                Enviar Confirmações Automaticamente
              </h4>
              <p className="text-sm text-slate-600">
                Notificar participantes via email/app quando o evento for criado
              </p>
            </div>
          </div>
          <button
            onClick={() => updateSettings({ auto_send: !confirmationSettings.auto_send })}
            className={`relative h-6 w-11 rounded-full transition-colors ${confirmationSettings.auto_send ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
          >
            <motion.div
              animate={{ x: confirmationSettings.auto_send ? 20 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 h-4 w-4 rounded-full bg-white"
            />
          </button>
        </div>

        {/* Hours Before (when auto_send is ON) */}
        {confirmationSettings.auto_send && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-slate-200"
          >
            <label className="block text-sm font-medium text-slate-700 mb-2">
              ⏰ Enviar quantas horas antes do evento?
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[24, 48, 72, 168].map((hours) => (
                <button
                  key={hours}
                  onClick={() => updateSettings({ hours_before: hours })}
                  className={`px-3 py-2 text-sm font-semibold rounded-xl border-2 transition-all ${confirmationSettings.hours_before === hours
                      ? 'bg-sky-500 border-sky-500 text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-sky-300'
                    }`}
                >
                  {hours === 168 ? '7 dias' : `${hours}h`}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              💡 Recomendado: 24h para treinos, 48h para avaliações
            </p>
          </motion.div>
        )}
      </div>

      {/* QR Code Check-in */}
      <div className="rounded-xl border-2 border-slate-200 bg-white p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shrink-0">
              <QrCode className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900 mb-1">
                Exigir Check-in com QR Code
              </h4>
              <p className="text-sm text-slate-600">
                Participantes devem escanear QR code ao chegar no local
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              updateSettings({ require_check_in: !confirmationSettings.require_check_in })
            }
            className={`relative h-6 w-11 rounded-full transition-colors ${confirmationSettings.require_check_in ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
          >
            <motion.div
              animate={{ x: confirmationSettings.require_check_in ? 20 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 h-4 w-4 rounded-full bg-white"
            />
          </button>
        </div>
      </div>

      {/* Reminders */}
      <div className="rounded-xl border-2 border-slate-200 bg-white p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shrink-0">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900 mb-1">
                Enviar Lembretes Automáticos
              </h4>
              <p className="text-sm text-slate-600">
                Lembrar participantes que ainda não confirmaram presença
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              updateSettings({ enable_reminders: !confirmationSettings.enable_reminders })
            }
            className={`relative h-6 w-11 rounded-full transition-colors ${confirmationSettings.enable_reminders ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
          >
            <motion.div
              animate={{ x: confirmationSettings.enable_reminders ? 20 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 h-4 w-4 rounded-full bg-white"
            />
          </button>
        </div>

        {/* Reminder timing (when enabled) */}
        {confirmationSettings.enable_reminders && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-slate-200"
          >
            <label className="block text-sm font-medium text-slate-700 mb-2">
              ⏰ Lembrar quantas horas antes do evento?
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 4, 6].map((hours) => (
                <button
                  key={hours}
                  onClick={() => updateSettings({ reminder_hours_before: hours })}
                  className={`px-3 py-2 text-sm font-semibold rounded-xl border-2 transition-all ${confirmationSettings.reminder_hours_before === hours
                      ? 'bg-amber-500 border-amber-500 text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-amber-300'
                    }`}
                >
                  {hours}h
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              💡 Apenas para quem ainda não confirmou presença
            </p>
          </motion.div>
        )}
      </div>

      {/* Timeline Preview */}
      {confirmationSettings.auto_send && formData.start_date && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-slate-600" />
            <h4 className="font-semibold text-slate-900 text-sm">
              Timeline de Notificações
            </h4>
          </div>
          <div className="space-y-2">
            {/* Confirmation send time */}
            <div className="flex items-center gap-3 text-sm">
              <div className="h-2 w-2 rounded-full bg-sky-500" />
              <span className="text-slate-600">
                Confirmação enviada{' '}
                <span className="font-semibold text-slate-900">
                  {new Date(
                    formData.start_date.getTime() -
                    confirmationSettings.hours_before * 60 * 60 * 1000
                  ).toLocaleString('pt-PT', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </span>
            </div>

            {/* Reminder time */}
            {confirmationSettings.enable_reminders && (
              <div className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-slate-600">
                  Lembrete enviado{' '}
                  <span className="font-semibold text-slate-900">
                    {new Date(
                      formData.start_date.getTime() -
                      confirmationSettings.reminder_hours_before * 60 * 60 * 1000
                    ).toLocaleString('pt-PT', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </span>
              </div>
            )}

            {/* Event time */}
            <div className="flex items-center gap-3 text-sm">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-slate-600">
                Evento inicia{' '}
                <span className="font-semibold text-slate-900">
                  {formData.start_date.toLocaleString('pt-PT', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Skip option */}
      <div className="text-center">
        <button
          onClick={() =>
            updateSettings({
              auto_send: false,
              require_check_in: false,
              enable_reminders: false,
            })
          }
          className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors"
        >
          ⏭️ Pular configurações (sem confirmações)
        </button>
      </div>

      {/* Recurrence Settings */}
      <div className="pt-6 border-t border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shrink-0">
            <Repeat className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Recorrência</h3>
            <p className="text-sm text-slate-600">
              Tornar este um evento recorrente (opcional)
            </p>
          </div>
        </div>

        <RecurrenceSettings
          startDate={
            formData.start_date
              ? formData.start_date.toISOString().split('T')[0]
              : new Date().toISOString().split('T')[0]
          }
          initialPattern={formData.recurrence_pattern || null}
          onChange={handleRecurrenceChange}
        />
      </div>
    </motion.div>
  );
}