/**
 * NOTIFICATION PREFERENCES MODAL
 * 
 * Modal for managing user notification preferences
 * - Global enable/disable
 * - Channel preferences (in-app, email, push)
 * - Category-specific toggles
 * - Quiet hours configuration
 * - Digest settings
 * 
 * @module components/notifications/NotificationPreferencesModal
 * @created 20 Janeiro 2026
 * @version 1.0.0
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Bell,
  BellOff,
  Mail,
  Smartphone,
  Clock,
  Calendar,
  AlertCircle,
  Activity,
  FileText,
  Users,
  Brain,
  TrendingUp,
  Heart,
  Award,
  Info,
  Moon,
  Send,
  Loader2,
} from 'lucide-react';
import useNotificationPreferences from '@/hooks/useNotificationPreferences';
import type { CategorySettings } from '@/types/notifications';

// ============================================================================
// TYPES
// ============================================================================

interface NotificationPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  userId: string;
}

// ============================================================================
// CATEGORY METADATA
// ============================================================================

const CATEGORY_CONFIG = {
  pain: {
    label: 'Dor & Desconforto',
    icon: AlertCircle,
    color: 'red',
    description: 'Alertas de relatos de dor de atletas',
  },
  session: {
    label: 'Sessões',
    icon: Activity,
    color: 'emerald',
    description: 'Sessões agendadas e completadas',
  },
  form: {
    label: 'Formulários',
    icon: FileText,
    color: 'sky',
    description: 'Submissões e respostas de formulários',
  },
  athlete: {
    label: 'Atletas',
    icon: Users,
    color: 'violet',
    description: 'Novos atletas e atualizações de perfil',
  },
  calendar: {
    label: 'Calendário',
    icon: Calendar,
    color: 'sky',
    description: 'Eventos e lembretes de calendário',
  },
  decision: {
    label: 'Decisões IA',
    icon: Brain,
    color: 'violet',
    description: 'Sugestões e decisões da IA',
  },
  metric: {
    label: 'Métricas',
    icon: TrendingUp,
    color: 'amber',
    description: 'Limiares de métricas e alertas',
  },
  injury: {
    label: 'Lesões',
    icon: Heart,
    color: 'red',
    description: 'Relatórios e atualizações de lesões',
  },
  record: {
    label: 'Recordes',
    icon: Award,
    color: 'emerald',
    description: 'Novos recordes pessoais',
  },
  system: {
    label: 'Sistema',
    icon: Info,
    color: 'slate',
    description: 'Atualizações do sistema e manutenção',
  },
} as const;

// ============================================================================
// COMPONENT
// ============================================================================

export function NotificationPreferencesModal({
  isOpen,
  onClose,
  workspaceId,
  userId,
}: NotificationPreferencesModalProps) {
  const {
    preferences,
    isLoading,
    isUpdating,
    updatePreferences,
    toggleCategory,
    toggleNotifications,
    toggleEmail,
    togglePush,
    updateQuietHours,
  } = useNotificationPreferences({ workspaceId, userId, enabled: isOpen });

  const [activeTab, setActiveTab] = useState<'channels' | 'categories' | 'schedule'>('channels');

  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Preferências de Notificações
                </h2>
                <p className="text-sm text-slate-600">
                  Personalize como e quando quer ser notificado
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5 text-slate-600" />
            </motion.button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-slate-200 p-4 overflow-x-auto">
            <TabButton
              active={activeTab === 'channels'}
              onClick={() => setActiveTab('channels')}
              icon={Bell}
              label="Canais"
            />
            <TabButton
              active={activeTab === 'categories'}
              onClick={() => setActiveTab('categories')}
              icon={FileText}
              label="Categorias"
            />
            <TabButton
              active={activeTab === 'schedule'}
              onClick={() => setActiveTab('schedule')}
              icon={Clock}
              label="Horários"
            />
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[60vh] p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 text-sky-500 animate-spin" />
              </div>
            ) : preferences ? (
              <>
                {/* Global Toggle */}
                <div className="mb-6 p-4 rounded-xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {preferences.enabled ? (
                        <Bell className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <BellOff className="h-5 w-5 text-slate-400" />
                      )}
                      <div>
                        <p className="font-semibold text-slate-900">
                          Notificações {preferences.enabled ? 'Ativas' : 'Desativadas'}
                        </p>
                        <p className="text-xs text-slate-600">
                          {preferences.enabled
                            ? 'Você receberá notificações configuradas abaixo'
                            : 'Todas as notificações estão pausadas'}
                        </p>
                      </div>
                    </div>
                    <Switch
                      enabled={preferences.enabled}
                      onChange={toggleNotifications}
                      disabled={isUpdating}
                    />
                  </div>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                  {activeTab === 'channels' && (
                    <ChannelsTab
                      preferences={preferences}
                      toggleEmail={toggleEmail}
                      togglePush={togglePush}
                      isUpdating={isUpdating}
                    />
                  )}

                  {activeTab === 'categories' && (
                    <CategoriesTab
                      preferences={preferences}
                      toggleCategory={toggleCategory}
                      isUpdating={isUpdating}
                    />
                  )}

                  {activeTab === 'schedule' && (
                    <ScheduleTab
                      preferences={preferences}
                      updatePreferences={updatePreferences}
                      updateQuietHours={updateQuietHours}
                      isUpdating={isUpdating}
                    />
                  )}
                </AnimatePresence>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-600">Erro ao carregar preferências</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 p-4 bg-slate-50">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-600">
                {isUpdating ? 'A guardar...' : 'Alterações guardadas automaticamente'}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-6 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md hover:from-sky-400 hover:to-sky-500 transition-all"
              >
                Fechar
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// ============================================================================
// TAB BUTTON
// ============================================================================

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}

function TabButton({ active, onClick, icon: Icon, label }: TabButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
        active
          ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30'
          : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-300'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </motion.button>
  );
}

// ============================================================================
// CHANNELS TAB
// ============================================================================

interface ChannelsTabProps {
  preferences: any;
  toggleEmail: () => void;
  togglePush: () => void;
  isUpdating: boolean;
}

function ChannelsTab({ preferences, toggleEmail, togglePush, isUpdating }: ChannelsTabProps) {
  return (
    <motion.div
      key="channels"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-3"
    >
      <ChannelCard
        icon={Bell}
        title="In-App"
        description="Notificações dentro da plataforma"
        enabled={preferences.inAppEnabled}
        onChange={() => {}}
        disabled={true}
        color="sky"
        badge="Sempre ativo"
      />

      <ChannelCard
        icon={Mail}
        title="Email"
        description="Receber notificações por email"
        enabled={preferences.emailEnabled}
        onChange={toggleEmail}
        disabled={isUpdating}
        color="emerald"
        badge={preferences.emailEnabled ? undefined : 'Brevemente'}
      />

      <ChannelCard
        icon={Smartphone}
        title="Push"
        description="Notificações push no navegador"
        enabled={preferences.pushEnabled}
        onChange={togglePush}
        disabled={isUpdating}
        color="violet"
        badge="Brevemente"
      />
    </motion.div>
  );
}

// ============================================================================
// CATEGORIES TAB
// ============================================================================

interface CategoriesTabProps {
  preferences: any;
  toggleCategory: (category: keyof CategorySettings) => void;
  isUpdating: boolean;
}

function CategoriesTab({ preferences, toggleCategory, isUpdating }: CategoriesTabProps) {
  return (
    <motion.div
      key="categories"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-3"
    >
      {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
        const category = key as keyof CategorySettings;
        const Icon = config.icon;

        return (
          <CategoryCard
            key={category}
            icon={Icon}
            title={config.label}
            description={config.description}
            enabled={preferences.categorySettings[category]}
            onChange={() => toggleCategory(category)}
            disabled={isUpdating || !preferences.enabled}
            color={config.color}
          />
        );
      })}
    </motion.div>
  );
}

// ============================================================================
// SCHEDULE TAB
// ============================================================================

interface ScheduleTabProps {
  preferences: any;
  updatePreferences: (updates: any) => void;
  updateQuietHours: (quietHours: any) => void;
  isUpdating: boolean;
}

function ScheduleTab({
  preferences,
  updatePreferences,
  updateQuietHours,
  isUpdating,
}: ScheduleTabProps) {
  const [quietHoursEnabled, setQuietHoursEnabled] = React.useState(
    preferences.quietHours.enabled
  );
  const [startTime, setStartTime] = React.useState(preferences.quietHours.start);
  const [endTime, setEndTime] = React.useState(preferences.quietHours.end);

  const handleQuietHoursToggle = async () => {
    const newEnabled = !quietHoursEnabled;
    setQuietHoursEnabled(newEnabled);

    await updateQuietHours({
      enabled: newEnabled,
      start: startTime,
      end: endTime,
      timezone: preferences.quietHours.timezone,
    });
  };

  const handleTimeChange = async () => {
    await updateQuietHours({
      enabled: quietHoursEnabled,
      start: startTime,
      end: endTime,
      timezone: preferences.quietHours.timezone,
    });
  };

  return (
    <motion.div
      key="schedule"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-4"
    >
      {/* Quiet Hours */}
      <div className="p-4 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Moon className="h-5 w-5 text-slate-600" />
            <div>
              <p className="font-semibold text-slate-900">Horário Silencioso</p>
              <p className="text-xs text-slate-600">
                Pausar notificações durante certas horas
              </p>
            </div>
          </div>
          <Switch
            enabled={quietHoursEnabled}
            onChange={handleQuietHoursToggle}
            disabled={isUpdating}
          />
        </div>

        {quietHoursEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-3"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">
                  Início
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  onBlur={handleTimeChange}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Fim</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  onBlur={handleTimeChange}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Digest Settings */}
      <div className="p-4 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Send className="h-5 w-5 text-slate-600" />
            <div>
              <p className="font-semibold text-slate-900">Resumo Diário</p>
              <p className="text-xs text-slate-600">
                Receber resumo consolidado de notificações
              </p>
            </div>
          </div>
          <Switch
            enabled={preferences.digestEnabled}
            onChange={() =>
              updatePreferences({ digestEnabled: !preferences.digestEnabled })
            }
            disabled={isUpdating}
          />
        </div>

        {preferences.digestEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-3"
          >
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">
                Frequência
              </label>
              <select
                value={preferences.digestFrequency}
                onChange={(e) =>
                  updatePreferences({ digestFrequency: e.target.value as any })
                }
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all appearance-none cursor-pointer"
              >
                <option value="hourly">A cada hora</option>
                <option value="daily">Diariamente</option>
                <option value="weekly">Semanalmente</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">
                Horário de envio
              </label>
              <input
                type="time"
                value={preferences.digestTime}
                onChange={(e) => updatePreferences({ digestTime: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
              />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

interface ChannelCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
  disabled: boolean;
  color: string;
  badge?: string;
}

function ChannelCard({
  icon: Icon,
  title,
  description,
  enabled,
  onChange,
  disabled,
  color,
  badge,
}: ChannelCardProps) {
  return (
    <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`h-10 w-10 rounded-xl bg-gradient-to-br from-${color}-500 to-${color}-600 flex items-center justify-center`}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-slate-900">{title}</p>
              {badge && (
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
                  {badge}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600">{description}</p>
          </div>
        </div>
        <Switch enabled={enabled} onChange={onChange} disabled={disabled} />
      </div>
    </div>
  );
}

interface CategoryCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
  disabled: boolean;
  color: string;
}

function CategoryCard({
  icon: Icon,
  title,
  description,
  enabled,
  onChange,
  disabled,
  color,
}: CategoryCardProps) {
  return (
    <div className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className={`h-4 w-4 text-${color}-600`} />
          <div>
            <p className="text-sm font-semibold text-slate-900">{title}</p>
            <p className="text-xs text-slate-600">{description}</p>
          </div>
        </div>
        <Switch enabled={enabled} onChange={onChange} disabled={disabled} size="sm" />
      </div>
    </div>
  );
}

interface SwitchProps {
  enabled: boolean;
  onChange: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

function Switch({ enabled, onChange, disabled = false, size = 'md' }: SwitchProps) {
  const dimensions = size === 'sm' ? 'h-5 w-9' : 'h-6 w-11';
  const knobSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  return (
    <button
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex ${dimensions} items-center rounded-full transition-colors ${
        enabled ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-slate-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <motion.span
        animate={{ x: enabled ? (size === 'sm' ? 18 : 22) : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={`inline-block ${knobSize} transform rounded-full bg-white shadow-md`}
      />
    </button>
  );
}
