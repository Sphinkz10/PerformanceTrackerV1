import { useState } from "react";
import { motion } from "motion/react";
import {
  Settings,
  Users,
  Database,
  Zap,
  Shield,
  Globe,
  DollarSign,
  BarChart3,
  Bell,
  Trash2,
  Plus,
  Edit,
  Crown,
  UserPlus,
  MapPin,
  Calendar,
  Package,
  FileText,
  Activity,
  Target,
  TrendingUp,
  Mail,
  Check,
  X
} from "lucide-react";
import { toast } from "sonner";

interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "head_coach" | "assistant" | "analyst" | "viewer";
  avatar?: string;
  joinedAt: string;
}

interface Resource {
  id: string;
  name: string;
  type: "room" | "equipment" | "field";
  capacity?: number;
  status: "active" | "inactive";
}

export function WorkspaceSettings() {
  const [activeTab, setActiveTab] = useState<"general" | "team" | "billing" | "integrations">("general");
  const [workspaceName, setWorkspaceName] = useState("Equipa Principal");
  const [description, setDescription] = useState("Workspace principal para gestão de atletas e treinos");
  const [timezone, setTimezone] = useState("Europe/Lisbon");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  // Helper function for color classes
  const getStatColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string, icon: string }> = {
      emerald: {
        bg: "bg-gradient-to-br from-emerald-50/90 to-white/90",
        icon: "bg-gradient-to-br from-emerald-500 to-emerald-600"
      },
      sky: {
        bg: "bg-gradient-to-br from-sky-50/90 to-white/90",
        icon: "bg-gradient-to-br from-sky-500 to-sky-600"
      },
      violet: {
        bg: "bg-gradient-to-br from-violet-50/90 to-white/90",
        icon: "bg-gradient-to-br from-violet-500 to-violet-600"
      },
      amber: {
        bg: "bg-gradient-to-br from-amber-50/90 to-white/90",
        icon: "bg-gradient-to-br from-amber-500 to-amber-600"
      }
    };
    return colorMap[color] || colorMap.emerald;
  };

  const members: WorkspaceMember[] = [
    {
      id: "1",
      name: "Carlos Silva",
      email: "carlos@performtrack.com",
      role: "owner",
      joinedAt: "Jan 2024"
    },
    {
      id: "2",
      name: "Ana Costa",
      email: "ana@performtrack.com",
      role: "head_coach",
      joinedAt: "Fev 2024"
    },
    {
      id: "3",
      name: "Miguel Santos",
      email: "miguel@performtrack.com",
      role: "assistant",
      joinedAt: "Mar 2024"
    },
    {
      id: "4",
      name: "Sofia Pereira",
      email: "sofia@performtrack.com",
      role: "analyst",
      joinedAt: "Mar 2024"
    }
  ];

  const resources: Resource[] = [
    { id: "1", name: "Sala Principal", type: "room", capacity: 12, status: "active" },
    { id: "2", name: "Studio Outdoor", type: "field", capacity: 20, status: "active" },
    { id: "3", name: "Sala Privada", type: "room", capacity: 4, status: "active" },
    { id: "4", name: "Equipamento Pilates", type: "equipment", status: "active" }
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "owner":
        return { label: "Owner", color: "violet", icon: Crown };
      case "head_coach":
        return { label: "Head Coach", color: "sky", icon: Users };
      case "assistant":
        return { label: "Assistant", color: "emerald", icon: UserPlus };
      case "analyst":
        return { label: "Analyst", color: "amber", icon: BarChart3 };
      case "viewer":
        return { label: "Viewer", color: "slate", icon: Users };
      default:
        return { label: role, color: "slate", icon: Users };
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "room": return MapPin;
      case "field": return Globe;
      case "equipment": return Package;
      default: return MapPin;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white pb-20 sm:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="font-bold text-slate-900 mb-1">⚙️ Configurações do Workspace</h1>
            <p className="text-sm text-slate-600">Gerir equipa, recursos e integrações</p>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toast.success("Configurações salvas!")}
              className="px-6 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 hover:from-emerald-400 hover:to-emerald-500 transition-all"
            >
              <Check className="h-4 w-4 inline mr-2" />
              Salvar Alterações
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "Atletas", value: "24", icon: Users, color: "sky" },
            { label: "Membros da Equipa", value: "4", icon: UserPlus, color: "violet" },
            { label: "Recursos", value: "4", icon: MapPin, color: "emerald" },
            { label: "Automações", value: "8", icon: Zap, color: "amber" }
          ].map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = getStatColorClasses(stat.color);
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-2xl border border-slate-200/80 ${colorClasses.bg} p-4 shadow-sm`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`h-8 w-8 rounded-xl ${colorClasses.icon} flex items-center justify-center`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                </div>
                <p className="font-semibold text-slate-900">{stat.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: "general" as const, label: "Geral", icon: Settings },
            { id: "team" as const, label: "Equipa", icon: Users },
            { id: "billing" as const, label: "Faturação", icon: DollarSign },
            { id: "integrations" as const, label: "Integrações", icon: Zap }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30"
                    : "bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </motion.button>
            );
          })}
        </div>

        {/* Content */}
        {activeTab === "general" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Informações Básicas</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nome do Workspace
                  </label>
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva o propósito deste workspace..."
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300"
                  >
                    <option>Europe/Lisbon</option>
                    <option>Europe/London</option>
                    <option>America/New_York</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Unidades & Preferências</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Sistema de Medida
                  </label>
                  <select className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300">
                    <option>Métrico (kg, cm)</option>
                    <option>Imperial (lbs, inches)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Moeda
                  </label>
                  <select className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300">
                    <option>EUR (€)</option>
                    <option>USD ($)</option>
                    <option>GBP (£)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Formato de Data
                  </label>
                  <select className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Primeira semana começa em
                  </label>
                  <select className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300">
                    <option>Segunda-feira</option>
                    <option>Domingo</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-6">
              <h2 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-600" />
                Zona de Perigo
              </h2>
              <p className="text-sm text-slate-600 mb-4">
                Ações irreversíveis que afetam permanentemente este workspace
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toast.error("Esta ação requer confirmação adicional")}
                className="px-4 py-2 text-sm font-semibold rounded-xl border-2 border-red-200 bg-white text-red-700 hover:bg-red-50 transition-all"
              >
                Eliminar Workspace
              </motion.button>
            </div>
          </div>
        )}

        {activeTab === "team" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-slate-900">Membros da Equipa</h2>
                <p className="text-sm text-slate-600">Gerir permissões e acessos</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowInvite(!showInvite)}
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md hover:from-sky-400 hover:to-sky-500 transition-all"
              >
                <UserPlus className="h-4 w-4 inline mr-2" />
                Convidar Membro
              </motion.button>
            </div>

            {showInvite && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-4"
              >
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="email@exemplo.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                  />
                  <select className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30">
                    <option>Assistant</option>
                    <option>Head Coach</option>
                    <option>Analyst</option>
                    <option>Viewer</option>
                  </select>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      toast.success(`Convite enviado para ${inviteEmail}!`);
                      setInviteEmail("");
                      setShowInvite(false);
                    }}
                    className="px-4 py-2 text-sm font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-all"
                  >
                    Enviar
                  </motion.button>
                </div>
              </motion.div>
            )}

            <div className="space-y-3">
              {members.map((member, index) => {
                const roleBadge = getRoleBadge(member.role);
                const RoleIcon = roleBadge.icon;
                
                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-slate-900">{member.name}</h3>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              roleBadge.color === 'violet' ? 'bg-violet-100 text-violet-700' :
                              roleBadge.color === 'sky' ? 'bg-sky-100 text-sky-700' :
                              roleBadge.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                              roleBadge.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              <RoleIcon className="h-3 w-3" />
                              {roleBadge.label}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600">{member.email}</p>
                          <p className="text-xs text-slate-500">Membro desde {member.joinedAt}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {member.role !== "owner" && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-3 py-2 text-sm font-medium rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-3 py-2 text-sm font-medium rounded-lg bg-red-50 hover:bg-red-100 text-red-700 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </motion.button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="font-semibold text-slate-900 mb-3">Permissões por Role</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Crown className="h-5 w-5 text-violet-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">Owner</p>
                    <p className="text-slate-600">Acesso total, incluindo configurações e faturação</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">Head Coach</p>
                    <p className="text-slate-600">Criar/editar atletas, sessões, templates e relatórios</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <UserPlus className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">Assistant</p>
                    <p className="text-slate-600">Executar sessões, registar dados, ver relatórios</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BarChart3 className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">Analyst</p>
                    <p className="text-slate-600">Acesso a dados, criar relatórios, sem editar atletas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "billing" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Faturação & Pagamentos</h3>
            <p className="text-sm text-slate-600 mb-4">
              Gerir plano, métodos de pagamento e histórico de faturas
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toast.success("Em desenvolvimento")}
              className="px-6 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-400 hover:to-emerald-500 transition-all"
            >
              Gerir Faturação
            </motion.button>
          </div>
        )}

        {activeTab === "integrations" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Integrações Externas</h3>
            <p className="text-sm text-slate-600 mb-4">
              Conecte Google Calendar, Stripe, Zapier e outras ferramentas
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toast.success("Em desenvolvimento")}
              className="px-6 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md hover:from-sky-400 hover:to-sky-500 transition-all"
            >
              Explorar Integrações
            </motion.button>
          </div>
        )}

      </div>
    </div>
  );
}