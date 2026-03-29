import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  X,
  Download,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  BarChart3,
  PieChart,
  Filter,
  Calendar
} from "lucide-react";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface FormAnalyticsModalProps {
  form: any;
  onClose: () => void;
}

// Mock data para analytics
const generateMockData = () => {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
      respostas: Math.floor(Math.random() * 50) + 10,
      completadas: Math.floor(Math.random() * 45) + 8,
      abandonadas: Math.floor(Math.random() * 10)
    };
  });

  const fieldStats = [
    { field: "Nome Completo", responses: 245, completion: 100, avgTime: "12s" },
    { field: "Email", responses: 245, completion: 100, avgTime: "8s" },
    { field: "Telefone", responses: 238, completion: 97, avgTime: "15s" },
    { field: "Data Nascimento", responses: 242, completion: 99, avgTime: "10s" },
    { field: "Objetivos", responses: 230, completion: 94, avgTime: "45s" },
    { field: "Histórico Lesões", responses: 215, completion: 88, avgTime: "2m 15s" }
  ];

  const deviceBreakdown = [
    { name: "Mobile", value: 145, color: "#0ea5e9" },
    { name: "Desktop", value: 78, color: "#8b5cf6" },
    { name: "Tablet", value: 22, color: "#10b981" }
  ];

  const completionFunnel = [
    { step: "Iniciou", count: 298, percentage: 100 },
    { step: "Campo 3", count: 275, percentage: 92 },
    { step: "Campo 5", count: 258, percentage: 87 },
    { step: "Campo 7", count: 250, percentage: 84 },
    { step: "Completou", count: 245, percentage: 82 }
  ];

  return { last30Days, fieldStats, deviceBreakdown, completionFunnel };
};

export function FormAnalyticsModal({ form, onClose }: FormAnalyticsModalProps) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  
  const { last30Days, fieldStats, deviceBreakdown, completionFunnel } = generateMockData();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const exportToCSV = () => {
    const headers = ["Data", "Respostas", "Completadas", "Abandonadas"];
    const rows = last30Days.map(d => [d.date, d.respostas, d.completadas, d.abandonadas]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${form.name}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    toast.success("Analytics exportadas para CSV!");
  };

  const totalResponses = last30Days.reduce((acc, d) => acc + d.respostas, 0);
  const avgResponsesPerDay = Math.round(totalResponses / last30Days.length);
  const completionRate = form.completionRate;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-sky-50 to-white">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Analytics: {form.name}</h2>
              <p className="text-sm text-slate-600">{form.responses} respostas totais</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </motion.button>
            <button
              onClick={onClose}
              className="h-9 w-9 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[calc(90vh-100px)] overflow-y-auto">
          
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex gap-2">
              {[
                { value: "7d" as const, label: "7 dias" },
                { value: "30d" as const, label: "30 dias" },
                { value: "90d" as const, label: "90 dias" }
              ].map(option => (
                <button
                  key={option.value}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                    timeRange === option.value
                      ? "border-sky-400 bg-sky-100 text-sky-700"
                      : "border-slate-200 bg-white text-slate-700 hover:border-sky-300"
                  }`}
                  onClick={() => setTimeRange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <button
                className={`p-2 rounded-lg border-2 transition-all ${
                  chartType === "line"
                    ? "border-sky-400 bg-sky-100"
                    : "border-slate-200 bg-white hover:border-sky-300"
                }`}
                onClick={() => setChartType("line")}
              >
                <TrendingUp className="h-4 w-4 text-sky-600" />
              </button>
              <button
                className={`p-2 rounded-lg border-2 transition-all ${
                  chartType === "bar"
                    ? "border-sky-400 bg-sky-100"
                    : "border-slate-200 bg-white hover:border-sky-300"
                }`}
                onClick={() => setChartType("bar")}
              >
                <BarChart3 className="h-4 w-4 text-sky-600" />
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Total Respostas",
                value: totalResponses.toString(),
                icon: Users,
                color: "emerald",
                trend: "+12% vs anterior"
              },
              {
                label: "Média por Dia",
                value: avgResponsesPerDay.toString(),
                icon: TrendingUp,
                color: "sky",
                trend: `${avgResponsesPerDay} respostas/dia`
              },
              {
                label: "Taxa Conclusão",
                value: `${completionRate}%`,
                icon: CheckCircle,
                color: "violet",
                trend: `${Math.round(totalResponses * (completionRate / 100))} completadas`
              },
              {
                label: "Tempo Médio",
                value: form.avgTime,
                icon: Clock,
                color: "amber",
                trend: "↓ -15s vs anterior"
              }
            ].map((stat, index) => {
              const Icon = stat.icon;
              const colors = {
                emerald: "from-emerald-50 to-white bg-gradient-to-br border-emerald-200",
                sky: "from-sky-50 to-white bg-gradient-to-br border-sky-200",
                violet: "from-violet-50 to-white bg-gradient-to-br border-violet-200",
                amber: "from-amber-50 to-white bg-gradient-to-br border-amber-200"
              };
              const iconColors = {
                emerald: "from-emerald-500 to-emerald-600",
                sky: "from-sky-500 to-sky-600",
                violet: "from-violet-500 to-violet-600",
                amber: "from-amber-500 to-amber-600"
              };

              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-xl border ${colors[stat.color as keyof typeof colors]} p-4`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${iconColors[stat.color as keyof typeof iconColors]} flex items-center justify-center`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-xs font-medium text-slate-600">{stat.label}</p>
                  </div>
                  <p className="font-bold text-slate-900 mb-0.5">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.trend}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Timeline Chart */}
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Respostas ao Longo do Tempo</h3>
              <ResponsiveContainer width="100%" height={250}>
                {chartType === "line" ? (
                  <LineChart data={last30Days}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#64748b" />
                    <YAxis tick={{ fontSize: 11 }} stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        fontSize: "12px"
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Line
                      type="monotone"
                      dataKey="respostas"
                      stroke="#0ea5e9"
                      strokeWidth={3}
                      name="Respostas"
                    />
                    <Line
                      type="monotone"
                      dataKey="completadas"
                      stroke="#10b981"
                      strokeWidth={3}
                      name="Completadas"
                    />
                    <Line
                      type="monotone"
                      dataKey="abandonadas"
                      stroke="#ef4444"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Abandonadas"
                    />
                  </LineChart>
                ) : (
                  <BarChart data={last30Days}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#64748b" />
                    <YAxis tick={{ fontSize: 11 }} stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        fontSize: "12px"
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar dataKey="respostas" fill="#0ea5e9" name="Respostas" />
                    <Bar dataKey="completadas" fill="#10b981" name="Completadas" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Device Breakdown */}
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Distribuição por Dispositivo</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RechartsPie>
                  <Pie
                    data={deviceBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {deviceBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPie>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4">
                {deviceBreakdown.map(device => (
                  <div key={device.name} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: device.color }}
                    />
                    <span className="text-xs text-slate-600">
                      {device.name}: {device.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Completion Funnel */}
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Funil de Completamento</h3>
              <div className="space-y-3">
                {completionFunnel.map((step, index) => (
                  <div key={step.step}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-700">{step.step}</span>
                      <span className="text-sm font-semibold text-slate-900">
                        {step.count} ({step.percentage}%)
                      </span>
                    </div>
                    <div className="h-8 bg-slate-100 rounded-lg overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${step.percentage}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className={`h-full rounded-lg ${
                          index === 0 ? "bg-gradient-to-r from-sky-400 to-sky-500" :
                          index === completionFunnel.length - 1 ? "bg-gradient-to-r from-emerald-400 to-emerald-500" :
                          "bg-gradient-to-r from-violet-400 to-violet-500"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Field Statistics */}
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Estatísticas por Campo</h3>
              <div className="space-y-2 max-h-[280px] overflow-y-auto">
                {fieldStats.map((field, index) => (
                  <motion.div
                    key={field.field}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{field.field}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-500">
                          {field.responses} respostas
                        </span>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="text-xs text-emerald-600">
                          {field.completion}% completado
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Tempo médio</p>
                      <p className="text-sm font-semibold text-slate-900">{field.avgTime}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}