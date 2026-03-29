import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  FileText, 
  Download, 
  Share2, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Calendar,
  Target,
  Activity,
  Clock
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Report {
  id: string;
  athleteId: string;
  athleteName: string;
  type: string;
  period: {
    start: string;
    end: string;
  };
  generatedAt: string;
  insights: {
    title: string;
    type: 'positive' | 'negative' | 'neutral';
    description: string;
  }[];
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    action?: string;
  }[];
  metrics: {
    name: string;
    current: number;
    previous: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
    unit: string;
  }[];
  chartData: {
    date: string;
    load: number;
    readiness: number;
    performance: number;
  }[];
}

interface ReportViewerDrawerProps {
  reportId: string;
  onClose: () => void;
}

export function ReportViewerDrawer({ reportId, onClose }: ReportViewerDrawerProps) {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReport();
  }, [reportId]);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/reports/${reportId}`);
      if (!response.ok) throw new Error('Failed to fetch report');
      const data = await response.json();
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Mock data para desenvolvimento
      setReport(mockReport);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`/api/reports/${reportId}/pdf`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${reportId}.pdf`;
      a.click();
    } catch (err) {
      console.error('Download failed:', err);
      alert('Download PDF will be implemented soon');
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/reports/${reportId}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive': return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'negative': return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: return <Activity className="w-5 h-5 text-sky-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 border-red-300 text-red-700';
      case 'medium': return 'bg-amber-100 border-amber-300 text-amber-700';
      default: return 'bg-sky-100 border-sky-300 text-sky-700';
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <div className="bg-white rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-500 border-t-transparent mx-auto"></div>
          <p className="text-sm text-slate-600 mt-4">Loading report...</p>
        </div>
      </motion.div>
    );
  }

  if (error || !report) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <div className="bg-white rounded-2xl p-8 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-sm font-semibold text-slate-900 text-center">Error loading report</p>
          <p className="text-xs text-slate-600 text-center mt-2">{error}</p>
          <button onClick={onClose} className="mt-4 w-full px-4 py-2 bg-slate-900 text-white rounded-xl">
            Close
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl h-full bg-white shadow-2xl overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{report.type}</h2>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-sm text-slate-500">{report.athleteName}</p>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(report.period.start).toLocaleDateString()} - {new Date(report.period.end).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button 
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-xl hover:from-sky-400 hover:to-sky-500 transition-all"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4">
            {report.metrics.slice(0, 4).map((metric, index) => (
              <motion.div
                key={metric.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white"
              >
                <p className="text-xs font-medium text-slate-500 mb-2">{metric.name}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-slate-900">{metric.current}</p>
                  <span className="text-xs text-slate-500">{metric.unit}</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  ) : metric.trend === 'down' ? (
                    <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                  ) : null}
                  <span className={`text-xs font-medium ${
                    metric.change > 0 ? 'text-emerald-600' : metric.change < 0 ? 'text-red-600' : 'text-slate-500'
                  }`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Performance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl border border-slate-200 bg-white"
          >
            <h3 className="text-sm font-bold text-slate-900 mb-4">Performance Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={report.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }} 
                  stroke="#64748b"
                />
                <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '12px', 
                    fontSize: '12px' 
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="load" stroke="#0ea5e9" strokeWidth={3} name="Training Load" />
                <Line type="monotone" dataKey="readiness" stroke="#10b981" strokeWidth={3} name="Readiness" />
                <Line type="monotone" dataKey="performance" stroke="#8b5cf6" strokeWidth={3} name="Performance" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Key Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-sky-600" />
              Key Insights
            </h3>
            {report.insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border ${
                  insight.type === 'positive' 
                    ? 'bg-emerald-50 border-emerald-200' 
                    : insight.type === 'negative'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-sky-50 border-sky-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{insight.title}</p>
                    <p className="text-xs text-slate-600 mt-1">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Recommendations
            </h3>
            {report.recommendations.map((rec, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border ${getPriorityColor(rec.priority)}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold uppercase tracking-wide">
                        {rec.priority} Priority
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{rec.title}</p>
                    <p className="text-xs text-slate-700 mt-1">{rec.description}</p>
                    {rec.action && (
                      <button className="mt-3 px-3 py-1.5 text-xs font-medium bg-white rounded-lg hover:bg-slate-50 transition-colors">
                        {rec.action}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Footer Info */}
          <div className="pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                Generated {new Date(report.generatedAt).toLocaleString()}
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" />
                Report ID: {report.id}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Mock data para desenvolvimento
const mockReport: Report = {
  id: 'rep_123',
  athleteId: 'ath_1',
  athleteName: 'João Silva',
  type: 'Weekly Performance Report',
  period: {
    start: '2026-01-01',
    end: '2026-01-07'
  },
  generatedAt: '2026-01-07T18:00:00Z',
  insights: [
    {
      title: 'Training Load Optimal',
      type: 'positive',
      description: 'Weekly training load is within the optimal range for performance gains while maintaining recovery capacity.'
    },
    {
      title: 'Readiness Declining',
      type: 'negative',
      description: 'Readiness scores have dropped 15% over the past 3 days. Consider adding an extra recovery session.'
    },
    {
      title: 'Performance Trending Up',
      type: 'positive',
      description: 'Performance metrics show a 12% improvement compared to last week. Current training stimulus is effective.'
    }
  ],
  recommendations: [
    {
      priority: 'high',
      title: 'Add Recovery Session',
      description: 'Insert a low-intensity recovery session tomorrow to prevent overtraining and maintain readiness.',
      action: 'Schedule Recovery'
    },
    {
      priority: 'medium',
      title: 'Monitor Sleep Quality',
      description: 'Sleep duration has been suboptimal (avg 6.2h). Aim for 7-9 hours to improve recovery.',
      action: 'Set Sleep Goal'
    },
    {
      priority: 'low',
      title: 'Increase Protein Intake',
      description: 'Consider increasing protein to 2.0g/kg bodyweight to support current training volume.',
      action: 'View Nutrition Plan'
    }
  ],
  metrics: [
    {
      name: 'Training Load',
      current: 1847,
      previous: 1652,
      change: 11.8,
      trend: 'up',
      unit: 'AU'
    },
    {
      name: 'Readiness',
      current: 72,
      previous: 85,
      change: -15.3,
      trend: 'down',
      unit: '%'
    },
    {
      name: 'Performance',
      current: 88,
      previous: 78,
      change: 12.8,
      trend: 'up',
      unit: '%'
    },
    {
      name: 'Recovery',
      current: 76,
      previous: 74,
      change: 2.7,
      trend: 'up',
      unit: '%'
    }
  ],
  chartData: [
    { date: 'Mon', load: 280, readiness: 85, performance: 78 },
    { date: 'Tue', load: 310, readiness: 82, performance: 80 },
    { date: 'Wed', load: 290, readiness: 79, performance: 83 },
    { date: 'Thu', load: 325, readiness: 75, performance: 85 },
    { date: 'Fri', load: 340, readiness: 72, performance: 88 },
    { date: 'Sat', load: 180, readiness: 73, performance: 87 },
    { date: 'Sun', load: 122, readiness: 76, performance: 86 }
  ]
};
