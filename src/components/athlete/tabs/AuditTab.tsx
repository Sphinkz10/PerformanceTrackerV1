import { motion } from 'motion/react';
import { Shield, User, Clock, FileText } from 'lucide-react';

interface AuditTabProps {
  athleteId: string;
}

export function AuditTab({ athleteId }: AuditTabProps) {
  // Mock audit log
  const auditLog = [
    { id: '1', action: 'updated', entity: 'athlete', description: 'Peso atualizado: 74.5kg → 75.5kg', actor: 'Coach João', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: '2', action: 'created', entity: 'personal_record', description: 'Novo recorde: Back Squat 1RM 150kg', actor: 'Sistema', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    { id: '3', action: 'updated', entity: 'dashboard_config', description: 'Dashboard configurado', actor: 'Coach João', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) }
  ];

  const actionColors: Record<string, string> = {
    created: 'emerald',
    updated: 'sky',
    deleted: 'red',
    viewed: 'slate'
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-violet-600" />
        <h3 className="font-bold text-slate-900">Audit Trail</h3>
        <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs font-bold rounded-full">
          {auditLog.length}
        </span>
      </div>

      <div className="space-y-2">
        {auditLog.map((log, index) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl border-2 border-slate-200 bg-white"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 bg-${actionColors[log.action]}-100 rounded-lg`}>
                <FileText className={`w-4 h-4 text-${actionColors[log.action]}-600`} />
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900 mb-1">
                  {log.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {log.actor}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {log.timestamp.toLocaleString('pt-PT')}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
