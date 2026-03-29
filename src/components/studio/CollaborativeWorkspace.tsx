import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  MessageSquare,
  Clock,
  ArrowLeft,
  Send,
  Video,
  Mic,
  MoreVertical,
  UserPlus,
  Settings as SettingsIcon
} from 'lucide-react';

interface CollaborativeWorkspaceProps {
  onBack?: () => void;
}

interface Collaborator {
  id: number;
  name: string;
  role: string;
  color: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  cursor?: { x: number; y: number };
}

interface ChatMessage {
  id: string;
  user: string;
  avatar: string;
  message: string;
  time: Date;
  type: 'text' | 'system';
}

interface HistoryItem {
  id: string;
  user: string;
  avatar: string;
  action: string;
  time: string;
}

export function CollaborativeWorkspace({ onBack }: CollaborativeWorkspaceProps) {
  const [collaborators] = useState<Collaborator[]>([
    { 
      id: 1, 
      name: 'Dr. Silva', 
      role: 'Head Coach', 
      color: '#3b82f6',
      avatar: '👨‍⚕️',
      status: 'online',
      cursor: { x: 100, y: 200 }
    },
    { 
      id: 2, 
      name: 'Ana Costa', 
      role: 'Fisioterapeuta', 
      color: '#10b981',
      avatar: '🧘‍♀️',
      status: 'online',
      cursor: { x: 300, y: 150 }
    },
    { 
      id: 3, 
      name: 'Carlos Mendes', 
      role: 'Nutricionista', 
      color: '#8b5cf6',
      avatar: '🍎',
      status: 'away',
      cursor: { x: 200, y: 300 }
    },
    { 
      id: 4, 
      name: 'Rita Santos', 
      role: 'Psicóloga', 
      color: '#f59e0b',
      avatar: '🧠',
      status: 'offline'
    },
  ]);

  const [chat, setChat] = useState<ChatMessage[]>([
    {
      id: '1',
      user: 'Dr. Silva',
      avatar: '👨‍⚕️',
      message: 'Acho que devemos aumentar o volume na semana 3',
      time: new Date(Date.now() - 120000),
      type: 'text'
    },
    {
      id: '2',
      user: 'Ana Costa',
      avatar: '🧘‍♀️',
      message: 'Concordo, mas precisamos adicionar mais mobilidade',
      time: new Date(Date.now() - 60000),
      type: 'text'
    },
    {
      id: '3',
      user: 'Sistema',
      avatar: '⚙️',
      message: 'Carlos Mendes alterou o bloco de aquecimento',
      time: new Date(Date.now() - 30000),
      type: 'system'
    },
  ]);

  const [message, setMessage] = useState('');

  const [history] = useState<HistoryItem[]>([
    {
      id: '1',
      user: 'Dr. Silva',
      avatar: '👨‍⚕️',
      action: 'Modificou o agachamento para 4×6',
      time: '2 min'
    },
    {
      id: '2',
      user: 'Ana Costa',
      avatar: '🧘‍♀️',
      action: 'Adicionou exercício de mobilidade de quadril',
      time: '5 min'
    },
    {
      id: '3',
      user: 'Carlos Mendes',
      avatar: '🍎',
      action: 'Comentou sobre o timing de nutrientes',
      time: '12 min'
    },
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: 'Você',
      avatar: '👤',
      message: message.trim(),
      time: new Date(),
      type: 'text'
    };

    setChat([...chat, newMessage]);
    setMessage('');
  };

  const getStatusColor = (status: Collaborator['status']) => {
    switch (status) {
      case 'online': return 'bg-emerald-500';
      case 'away': return 'bg-amber-500';
      case 'offline': return 'bg-slate-400';
    }
  };

  const getStatusText = (status: Collaborator['status']) => {
    switch (status) {
      case 'online': return 'Online';
      case 'away': return 'Ausente';
      case 'offline': return 'Offline';
    }
  };

  return (
    <div className="h-screen flex bg-slate-50">
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex-none p-4 bg-white border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="h-9 w-9 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 text-slate-600" />
              </motion.button>
            )}
            <div>
              <h2 className="text-slate-900">Workspace Colaborativo</h2>
              <p className="text-sm text-slate-600">
                Plano de Preparação - Fase 1
              </p>
            </div>
          </div>

          {/* Active Collaborators */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {collaborators.filter(c => c.status === 'online').map((collab) => (
                <div
                  key={collab.id}
                  className="h-8 w-8 rounded-full bg-white border-2 border-white flex items-center justify-center text-lg shadow-sm"
                  style={{ borderColor: collab.color }}
                  title={collab.name}
                >
                  {collab.avatar}
                </div>
              ))}
            </div>
            
            <button className="px-4 py-2 text-sm border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span className="hidden sm:inline">Chamada</span>
            </button>
          </div>
        </div>

        {/* Canvas Placeholder */}
        <div className="flex-1 bg-gradient-to-br from-slate-100 to-slate-50 relative overflow-hidden">
          {/* Collaborative Cursors */}
          {collaborators
            .filter(c => c.status === 'online' && c.cursor)
            .map((collab) => (
              <motion.div
                key={collab.id}
                className="absolute pointer-events-none"
                style={{
                  left: collab.cursor!.x,
                  top: collab.cursor!.y,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <div className="relative">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 3L19 12L12 13L9 20L5 3Z"
                      fill={collab.color}
                      stroke="white"
                      strokeWidth="2"
                    />
                  </svg>
                  <div
                    className="absolute top-6 left-6 px-2 py-1 text-xs text-white rounded shadow-lg whitespace-nowrap"
                    style={{ backgroundColor: collab.color }}
                  >
                    {collab.name}
                  </div>
                </div>
              </motion.div>
            ))}

          {/* Canvas Content Placeholder */}
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl text-slate-900 mb-2">Modo Colaborativo Ativo</h3>
              <p className="text-slate-600">
                {collaborators.filter(c => c.status === 'online').length} pessoas trabalhando agora
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Collaboration Panel */}
      <div className="w-96 border-l border-slate-200 bg-white flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button className="flex-1 px-4 py-3 text-sm bg-blue-50 text-blue-700 border-b-2 border-blue-600">
            <Users className="h-4 w-4 inline mr-2" />
            Equipa
          </button>
          <button className="flex-1 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50">
            <MessageSquare className="h-4 w-4 inline mr-2" />
            Chat
          </button>
          <button className="flex-1 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50">
            <Clock className="h-4 w-4 inline mr-2" />
            Histórico
          </button>
        </div>

        {/* Team Panel */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-slate-900">
              Colaboradores ({collaborators.length})
            </h3>
            <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
              <UserPlus className="h-4 w-4 text-slate-600" />
            </button>
          </div>

          <div className="space-y-3">
            {collaborators.map((collab) => (
              <div
                key={collab.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-xl">
                    {collab.avatar}
                  </div>
                  <div 
                    className={`absolute bottom-0 right-0 h-3 w-3 ${getStatusColor(collab.status)} rounded-full border-2 border-white`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm text-slate-900 truncate">
                    {collab.name}
                  </div>
                  <div className="text-xs text-slate-600 truncate">
                    {collab.role}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">
                    {getStatusText(collab.status)}
                  </span>
                  <button className="p-1 hover:bg-slate-100 rounded">
                    <MoreVertical className="h-4 w-4 text-slate-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Invite Button */}
          <button className="w-full mt-4 p-3 border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-blue-600 text-sm">
            <UserPlus className="h-4 w-4 inline mr-2" />
            Convidar mais pessoas
          </button>
        </div>

        {/* Chat Section */}
        <div className="flex-none border-t border-slate-200 p-4">
          <h4 className="text-sm text-slate-900 mb-3">💬 Chat Rápido</h4>
          
          <div className="h-48 mb-3 overflow-y-auto space-y-3">
            {chat.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-xl text-sm ${
                  msg.type === 'system'
                    ? 'bg-slate-100 text-slate-600'
                    : msg.user === 'Você'
                    ? 'bg-blue-50 text-slate-900 ml-4'
                    : 'bg-slate-50 text-slate-900 mr-4'
                }`}
              >
                {msg.type === 'text' && (
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span>{msg.avatar}</span>
                      <span className="font-medium text-xs">{msg.user}</span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
                <div>{msg.message}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Digite uma mensagem..."
              className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 transition-all"
            />
            <button
              onClick={handleSendMessage}
              className="px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* History Section */}
        <div className="flex-none border-t border-slate-200 p-4">
          <h4 className="text-sm text-slate-900 mb-3">🕒 Alterações Recentes</h4>
          <div className="space-y-2">
            {history.map((item) => (
              <div key={item.id} className="flex items-start gap-2 text-sm">
                <div className="text-lg">{item.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-slate-900">{item.user}</div>
                  <div className="text-slate-600 text-xs truncate">{item.action}</div>
                </div>
                <div className="text-xs text-slate-500 shrink-0">{item.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
