/**
 * CALENDAR SETTINGS MODAL
 * Configure calendar preferences and integrations
 * NOW WITH REAL PERSISTENCE via CalendarSettingsContext
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Settings, 
  Calendar, 
  Bell,
  Globe,
  Clock,
  Users,
  Palette,
  Check,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useCalendarSettings } from '../contexts/CalendarSettingsContext';
import { useCalendar } from '../core/CalendarProvider';

interface CalendarSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CalendarSettingsModal({ isOpen, onClose }: CalendarSettingsModalProps) {
  const { settings, updateSettings, resetSettings } = useCalendarSettings();
  const { setView } = useCalendar();
  
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'display'>('general');
  
  // Local state for form (synced with context)
  const [localSettings, setLocalSettings] = useState(settings);
  
  // Sync local state when modal opens or settings change
  useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
    }
  }, [isOpen, settings]);
  
  const handleSave = () => {
    // Update context (which persists to localStorage)
    updateSettings(localSettings);
    
    // Apply defaultView to calendar
    if (localSettings.defaultView !== settings.defaultView) {
      setView(localSettings.defaultView);
    }
    
    toast.success('Configurações guardadas com sucesso!', {
      description: 'As suas preferências foram aplicadas.',
    });
    
    onClose();
  };
  
  const handleReset = () => {
    resetSettings();
    setLocalSettings(settings);
    toast.success('Configurações repostas para padrão');
  };
  
  const tabs = [
    { id: 'general' as const, label: 'Geral', icon: Settings },
    { id: 'notifications' as const, label: 'Notificações', icon: Bell },
    { id: 'display' as const, label: 'Aparência', icon: Palette },
  ];
  
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
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Configurações do Calendário
                  </h2>
                  <p className="text-sm text-slate-600">
                    Personalize o seu calendário
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </motion.button>
            </div>
            
            {/* Tabs */}
            <div className="flex gap-2 p-4 border-b border-slate-200 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </motion.button>
                );
              })}
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'general' && (
                <div className="space-y-6">
                  {/* Week starts on */}
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      A semana começa em
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setLocalSettings({ ...localSettings, weekStartsOn: 1 })}
                        className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          localSettings.weekStartsOn === 1
                            ? 'border-sky-500 bg-sky-50 text-sky-700'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          Segunda-feira
                          {localSettings.weekStartsOn === 1 && (
                            <Check className="h-4 w-4 text-sky-600" />
                          )}
                        </div>
                      </button>
                      <button
                        onClick={() => setLocalSettings({ ...localSettings, weekStartsOn: 0 })}
                        className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          localSettings.weekStartsOn === 0
                            ? 'border-sky-500 bg-sky-50 text-sky-700'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          Domingo
                          {localSettings.weekStartsOn === 0 && (
                            <Check className="h-4 w-4 text-sky-600" />
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                  
                  {/* Default view */}
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Vista padrão
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['week', 'month', 'agenda'] as const).map((view) => (
                        <button
                          key={view}
                          onClick={() => setLocalSettings({ ...localSettings, defaultView: view })}
                          className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                            localSettings.defaultView === view
                              ? 'border-sky-500 bg-sky-50 text-sky-700'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            {view === 'week' && '📅'}
                            {view === 'month' && '📊'}
                            {view === 'agenda' && '📋'}
                            <span className="capitalize">{view === 'week' ? 'Semana' : view === 'month' ? 'Mês' : 'Agenda'}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Working hours */}
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Horário de trabalho
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-600 mb-1">Início</label>
                        <input
                          type="time"
                          value={localSettings.workingHoursStart}
                          onChange={(e) => setLocalSettings({ ...localSettings, workingHoursStart: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-600 mb-1">Fim</label>
                        <input
                          type="time"
                          value={localSettings.workingHoursEnd}
                          onChange={(e) => setLocalSettings({ ...localSettings, workingHoursEnd: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Toggles */}
                  <div className="space-y-3">
                    <ToggleOption
                      label="Mostrar fins de semana"
                      checked={localSettings.showWeekends}
                      onChange={(checked) => setLocalSettings({ ...localSettings, showWeekends: checked })}
                    />
                    
                    {/* Default Event Duration */}
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        Duração padrão de eventos
                      </label>
                      <select
                        value={localSettings.defaultEventDuration}
                        onChange={(e) => setLocalSettings({ ...localSettings, defaultEventDuration: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                      >
                        <option value="30">30 minutos</option>
                        <option value="45">45 minutos</option>
                        <option value="60">1 hora</option>
                        <option value="90">1h 30min</option>
                        <option value="120">2 horas</option>
                      </select>
                    </div>
                    
                    {/* Timezone */}
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        <Globe className="h-4 w-4 inline mr-2" />
                        Fuso horário
                      </label>
                      <select
                        value={localSettings.timezone}
                        onChange={(e) => setLocalSettings({ ...localSettings, timezone: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                      >
                        <option value="Europe/Lisbon">Europa/Lisboa (GMT+0)</option>
                        <option value="Europe/London">Europa/Londres (GMT+0)</option>
                        <option value="Europe/Madrid">Europa/Madrid (GMT+1)</option>
                        <option value="Europe/Paris">Europa/Paris (GMT+1)</option>
                        <option value="America/New_York">América/Nova York (GMT-5)</option>
                        <option value="America/Sao_Paulo">América/São Paulo (GMT-3)</option>
                        <option value="Asia/Tokyo">Ásia/Tóquio (GMT+9)</option>
                      </select>
                    </div>
                    
                    {/* Time Format */}
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        Formato de hora
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setLocalSettings({ ...localSettings, timeFormat: '24h' })}
                          className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                            localSettings.timeFormat === '24h'
                              ? 'border-sky-500 bg-sky-50 text-sky-700'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300'
                          }`}
                        >
                          24 horas
                        </button>
                        <button
                          onClick={() => setLocalSettings({ ...localSettings, timeFormat: '12h' })}
                          className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                            localSettings.timeFormat === '12h'
                              ? 'border-sky-500 bg-sky-50 text-sky-700'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300'
                          }`}
                        >
                          12 horas (AM/PM)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-sky-50 border border-sky-200">
                    <p className="text-sm text-sky-700">
                      Configure como deseja ser notificado sobre eventos e alterações no calendário.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <ToggleOption
                      label="Notificações por email"
                      description="Receber emails sobre novos eventos e alterações"
                      checked={localSettings.emailNotifications}
                      onChange={(checked) => setLocalSettings({ ...localSettings, emailNotifications: checked })}
                    />
                    <ToggleOption
                      label="Notificações push"
                      description="Receber notificações no browser"
                      checked={localSettings.pushNotifications}
                      onChange={(checked) => setLocalSettings({ ...localSettings, pushNotifications: checked })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Notificar antes do evento
                    </label>
                    <select
                      value={localSettings.notifyBefore}
                      onChange={(e) => setLocalSettings({ ...localSettings, notifyBefore: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                    >
                      <option value="5">5 minutos</option>
                      <option value="15">15 minutos</option>
                      <option value="30">30 minutos</option>
                      <option value="60">1 hora</option>
                      <option value="120">2 horas</option>
                      <option value="1440">1 dia</option>
                    </select>
                  </div>
                  
                  {/* Confirmation Settings */}
                  <div className="border-t border-slate-200 pt-6">
                    <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Confirmações de Presença
                    </h3>
                    
                    <div className="space-y-3">
                      <ToggleOption
                        label="Exigir confirmação de atletas"
                        description="Atletas devem confirmar presença nos eventos"
                        checked={localSettings.requireConfirmation}
                        onChange={(checked) => setLocalSettings({ ...localSettings, requireConfirmation: checked })}
                      />
                      
                      {localSettings.requireConfirmation && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-slate-900 mb-2">
                              Auto-confirmar após
                            </label>
                            <select
                              value={localSettings.autoConfirmAfter}
                              onChange={(e) => setLocalSettings({ ...localSettings, autoConfirmAfter: e.target.value })}
                              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                            >
                              <option value="12">12 horas</option>
                              <option value="24">24 horas</option>
                              <option value="48">48 horas</option>
                              <option value="never">Nunca (sempre manual)</option>
                            </select>
                            <p className="text-xs text-slate-600 mt-1">
                              Eventos sem resposta são confirmados automaticamente
                            </p>
                          </div>
                          
                          <ToggleOption
                            label="Enviar lembretes"
                            description="Lembrar atletas que não confirmaram presença"
                            checked={localSettings.sendReminders}
                            onChange={(checked) => setLocalSettings({ ...localSettings, sendReminders: checked })}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'display' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Esquema de cores
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['light', 'dark', 'auto'] as const).map((scheme) => (
                        <button
                          key={scheme}
                          onClick={() => setLocalSettings({ ...localSettings, colorScheme: scheme })}
                          className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                            localSettings.colorScheme === scheme
                              ? 'border-sky-500 bg-sky-50 text-sky-700'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            {scheme === 'light' && '☀️'}
                            {scheme === 'dark' && '🌙'}
                            {scheme === 'auto' && '⚙️'}
                            <span className="capitalize">
                              {scheme === 'light' ? 'Claro' : scheme === 'dark' ? 'Escuro' : 'Auto'}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <ToggleOption
                      label="Modo compacto"
                      description="Reduzir espaçamento para ver mais eventos"
                      checked={localSettings.compactMode}
                      onChange={(checked) => setLocalSettings({ ...localSettings, compactMode: checked })}
                    />
                    <ToggleOption
                      label="Mostrar fotos dos atletas"
                      description="Exibir avatares nos eventos"
                      checked={localSettings.showAthletePhotos}
                      onChange={(checked) => setLocalSettings({ ...localSettings, showAthletePhotos: checked })}
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-end gap-2 p-6 border-t border-slate-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="px-6 py-3 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:border-slate-300 transition-all"
              >
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReset}
                className="px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30 hover:from-sky-400 hover:to-sky-500 transition-all"
              >
                Repor para Padrão
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30 hover:from-sky-400 hover:to-sky-500 transition-all"
              >
                Guardar Alterações
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Toggle Option Component
interface ToggleOptionProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleOption({ label, description, checked, onChange }: ToggleOptionProps) {
  return (
    <div className="flex items-start justify-between p-4 rounded-xl border border-slate-200 hover:border-sky-300 transition-all">
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-900">{label}</p>
        {description && (
          <p className="text-xs text-slate-600 mt-1">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          checked ? 'bg-sky-500' : 'bg-slate-300'
        }`}
      >
        <motion.div
          animate={{ x: checked ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm"
        />
      </button>
    </div>
  );
}