import { motion } from 'motion/react';
import { Shield, Clock, Zap, Mail, Bell, AlertCircle, Save } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function AutomationPolicies() {
  const handleSave = () => {
    toast.success('Policies guardadas com sucesso!');
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="font-bold text-xl text-slate-900 mb-2">Global Policies</h2>
        <p className="text-sm text-slate-600">
          Define defaults que aplicam a todas as automações (podem ser sobrescritas individualmente)
        </p>
      </div>

      {/* Quiet Hours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200 bg-white p-6"
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-violet-100 rounded-lg">
            <Clock className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Quiet Hours</h3>
            <p className="text-sm text-slate-600 mt-0.5">
              Horários onde mensagens não são enviadas
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Início</label>
            <input
              type="time"
              defaultValue="22:00"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Fim</label>
            <input
              type="time"
              defaultValue="08:00"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            />
          </div>
        </div>
      </motion.div>

      {/* Rate Limits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-slate-200 bg-white p-6"
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Zap className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Rate Limits</h3>
            <p className="text-sm text-slate-600 mt-0.5">
              Máximo de mensagens por atleta/dia
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Email</span>
            </div>
            <input
              type="number"
              defaultValue="3"
              className="w-20 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-right"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Push</span>
            </div>
            <input
              type="number"
              defaultValue="5"
              className="w-20 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-right"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">SMS</span>
            </div>
            <input
              type="number"
              defaultValue="2"
              className="w-20 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-right"
            />
          </div>
        </div>
      </motion.div>

      {/* Cooldowns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-slate-200 bg-white p-6"
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-sky-100 rounded-lg">
            <Clock className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Cooldowns</h3>
            <p className="text-sm text-slate-600 mt-0.5">
              Tempo mínimo entre mensagens do mesmo tipo
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Mensagens de Marketing
            </label>
            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
              <option>24 horas</option>
              <option>48 horas</option>
              <option>72 horas</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Lembretes de Pagamento
            </label>
            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
              <option>12 horas</option>
              <option>24 horas</option>
              <option>48 horas</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Global Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-slate-200 bg-white p-6"
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Shield className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Global Settings</h3>
            <p className="text-sm text-slate-600 mt-0.5">
              Defaults de segurança e compliance
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">Idempotency (Default ON)</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Evita duplicação de ações
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">Require Simulation</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Workflows devem ser simulados antes de ativar
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">Financial Actions Approval</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Ações financeiras requerem aprovação manual
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
            </label>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Save className="w-5 h-5" />
          Guardar Policies
        </button>
      </div>
    </div>
  );
}
