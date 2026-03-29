import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Save,
  Play,
  Settings,
  Eye,
  Code,
  Layers,
  Zap,
  Mail,
  Clock,
  Users,
  Database,
  Calendar,
  GitBranch,
  Plus,
  Trash2,
  Copy,
  ChevronDown,
  Info
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface WorkflowBuilderProps {
  workflowId: string | null;
  onClose: () => void;
}

export function WorkflowBuilder({ workflowId, onClose }: WorkflowBuilderProps) {
  const [showLibrary, setShowLibrary] = useState(true);
  const [showInspector, setShowInspector] = useState(true);
  const [activeInspectorTab, setActiveInspectorTab] = useState<'config' | 'help' | 'debug'>('config');
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  const swimlanes = [
    { id: 'trigger', label: 'Trigger', color: 'violet' },
    { id: 'control', label: 'Control', color: 'amber' },
    { id: 'communication', label: 'Communication', color: 'sky' },
    { id: 'data', label: 'Data', color: 'emerald' },
    { id: 'calendar', label: 'Calendar', color: 'indigo' }
  ];

  const libraryBlocks = [
    { id: 'send_email', label: 'Send Email', icon: Mail, swimlane: 'communication', color: 'sky' },
    { id: 'send_push', label: 'Send Push', icon: Zap, swimlane: 'communication', color: 'sky' },
    { id: 'delay', label: 'Delay', icon: Clock, swimlane: 'control', color: 'amber' },
    { id: 'if_else', label: 'If/Else', icon: GitBranch, swimlane: 'control', color: 'amber' },
    { id: 'update_field', label: 'Update Field', icon: Database, swimlane: 'data', color: 'emerald' },
    { id: 'create_session', label: 'Create Session', icon: Calendar, swimlane: 'calendar', color: 'indigo' }
  ];

  const canvasBlocks = [
    {
      id: 'block_1',
      type: 'trigger',
      label: 'QUANDO',
      name: 'Session Scheduled',
      swimlane: 'trigger',
      position: { x: 50, y: 50 }
    },
    {
      id: 'block_2',
      type: 'control',
      label: 'ESPERA',
      name: 'Delay 24h',
      swimlane: 'control',
      position: { x: 50, y: 200 }
    },
    {
      id: 'block_3',
      type: 'action',
      label: 'ENTÃO',
      name: 'Send Email',
      swimlane: 'communication',
      position: { x: 50, y: 350 }
    }
  ];

  const handleSave = () => {
    toast.success('Workflow guardado!');
  };

  const handleSimulate = () => {
    toast.info('A simular workflow...');
    setTimeout(() => {
      toast.success('Simulação concluída: 3 destinatários, 0 erros');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-50 to-white flex flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>

          <div>
            <input
              type="text"
              defaultValue="Lembrete Sessão 24h"
              className="font-bold text-lg text-slate-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-sky-300 rounded px-2 py-1"
            />
            <p className="text-xs text-slate-500 px-2">v1.0 • Draft</p>
          </div>

          <div className="flex gap-1 ml-4">
            <button className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-all">
              Draft
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-violet-200 bg-violet-50 text-violet-700 font-semibold text-sm hover:bg-violet-100 transition-all"
          >
            <Play className="w-4 h-4" />
            Simulate
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-sky-200 bg-sky-50 text-sky-700 font-semibold text-sm hover:bg-sky-100 transition-all"
          >
            <Save className="w-4 h-4" />
            Guardar
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all">
            Publicar
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        {/* LIBRARY (Left Panel) */}
        {showLibrary && (
          <div className="w-64 border-r border-slate-200 bg-white overflow-y-auto">
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 mb-1">Block Library</h3>
              <p className="text-xs text-slate-500">Arrasta para o canvas</p>
            </div>

            <div className="p-3 space-y-4">
              {swimlanes.slice(1).map((lane) => {
                const blocks = libraryBlocks.filter(b => b.swimlane === lane.id);
                return (
                  <div key={lane.id}>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-2 px-1">
                      {lane.label}
                    </p>
                    <div className="space-y-1">
                      {blocks.map((block) => {
                        const Icon = block.icon;
                        return (
                          <motion.div
                            key={block.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`
                              flex items-center gap-3 p-3 rounded-lg border-2 border-slate-200
                              bg-white hover:border-${block.color}-300 cursor-move transition-all
                            `}
                          >
                            <div className={`p-1.5 rounded bg-${block.color}-100`}>
                              <Icon className={`w-4 h-4 text-${block.color}-600`} />
                            </div>
                            <span className="text-sm font-medium text-slate-900">{block.label}</span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CANVAS (Center) */}
        <div className="flex-1 overflow-auto bg-slate-50 p-6">
          <div className="min-h-full">
            <div className="relative">
              {/* Swimlane Headers */}
              <div className="flex gap-4 mb-6 sticky top-0 bg-slate-50 pb-3 border-b border-slate-200">
                {swimlanes.map((lane) => (
                  <div key={lane.id} className="flex-1">
                    <div className={`
                      px-3 py-2 rounded-lg bg-gradient-to-r from-${lane.color}-100 to-${lane.color}-50
                      border border-${lane.color}-200
                    `}>
                      <p className={`text-xs font-bold text-${lane.color}-900 uppercase tracking-wide`}>
                        {lane.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Canvas Blocks */}
              <div className="space-y-4">
                {canvasBlocks.map((block, index) => (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedBlock(block.id)}
                    className={`
                      p-5 rounded-xl border-2 bg-white cursor-pointer transition-all hover:shadow-lg
                      ${selectedBlock === block.id
                        ? 'border-sky-500 ring-4 ring-sky-500/20'
                        : 'border-slate-200 hover:border-sky-300'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`
                          px-2 py-0.5 rounded-full text-xs font-bold
                          ${block.type === 'trigger' ? 'bg-violet-100 text-violet-700' :
                            block.type === 'control' ? 'bg-amber-100 text-amber-700' :
                            'bg-sky-100 text-sky-700'
                          }
                        `}>
                          {block.label}
                        </span>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 hover:bg-slate-100 rounded">
                          <Copy className="w-4 h-4 text-slate-600" />
                        </button>
                        <button className="p-1.5 hover:bg-red-100 rounded">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`
                        p-3 rounded-lg
                        ${block.type === 'trigger' ? 'bg-violet-100' :
                          block.type === 'control' ? 'bg-amber-100' :
                          'bg-sky-100'
                        }
                      `}>
                        {block.type === 'trigger' && <Zap className="w-6 h-6 text-violet-600" />}
                        {block.type === 'control' && <Clock className="w-6 h-6 text-amber-600" />}
                        {block.type === 'action' && <Mail className="w-6 h-6 text-sky-600" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900">{block.name}</h4>
                        <p className="text-sm text-slate-500 mt-0.5">
                          {block.type === 'trigger' && 'Quando uma sessão é agendada'}
                          {block.type === 'control' && '24 horas antes do evento'}
                          {block.type === 'action' && 'Enviar email de lembrete'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Add Block Button */}
                <button className="w-full p-6 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:border-sky-400 hover:bg-sky-50 transition-all">
                  <Plus className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-600">Adicionar bloco</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* INSPECTOR (Right Panel) */}
        {showInspector && (
          <div className="w-80 border-l border-slate-200 bg-white flex flex-col">
            {/* Inspector Tabs */}
            <div className="flex border-b border-slate-200">
              {[
                { id: 'config' as const, label: 'Config', icon: Settings },
                { id: 'help' as const, label: 'Help', icon: Info },
                { id: 'debug' as const, label: 'Debug', icon: Code }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveInspectorTab(tab.id)}
                    className={`
                      flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-all
                      ${activeInspectorTab === tab.id
                        ? 'text-sky-600 border-b-2 border-sky-600 bg-sky-50'
                        : 'text-slate-600 hover:bg-slate-50'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Inspector Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeInspectorTab === 'config' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3">Basic</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Destinatários
                        </label>
                        <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                          <option>Atleta da sessão</option>
                          <option>Coach responsável</option>
                          <option>Equipa completa</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Template
                        </label>
                        <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                          <option>Lembrete padrão</option>
                          <option>Lembrete urgente</option>
                          <option>Custom</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {}}
                    className="w-full flex items-center justify-between px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm font-medium text-amber-900 hover:bg-amber-100 transition-colors"
                  >
                    <span>Mostrar Advanced</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              )}

              {activeInspectorTab === 'help' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">O que é</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Envia um email automático para o atleta com detalhes da sessão agendada.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Quando usar</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• Lembretes de sessões</li>
                      <li>• Confirmações</li>
                      <li>• Updates importantes</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg">
                    <p className="text-xs font-semibold text-sky-900 mb-1">💡 Exemplo</p>
                    <p className="text-sm text-sky-800">
                      "Olá {'{'}athlete.name{'}'}, tens treino amanhã às {'{'}session.time{'}'}!"
                    </p>
                  </div>
                </div>
              )}

              {activeInspectorTab === 'debug' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Last Run</h4>
                    <p className="text-sm text-slate-600">Há 2 horas • Success</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Step Logs</h4>
                    <div className="p-3 bg-slate-900 rounded-lg">
                      <pre className="text-xs text-emerald-400 font-mono">
{`[INFO] Email sent
To: joao@example.com
Status: Delivered
Time: 234ms`}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
