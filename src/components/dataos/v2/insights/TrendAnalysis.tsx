/**
 * TREND ANALYSIS - Temporal trend analysis
 * Time series, moving averages, forecasting, seasonality
 */

'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Download,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

type TimeRange = '7d' | '30d' | '90d' | '1y';
type MetricType = 'hrv' | 'load' | 'wellness' | 'performance';

const METRICS = [
  { id: 'hrv' as const, label: 'HRV', color: '#0ea5e9', unit: 'ms' },
  { id: 'load' as const, label: 'Training Load', color: '#f59e0b', unit: 'AU' },
  { id: 'wellness' as const, label: 'Wellness Score', color: '#10b981', unit: '/10' },
  { id: 'performance' as const, label: 'Performance', color: '#8b5cf6', unit: '%' },
];

// Generate mock time series data
const generateTimeSeriesData = (metric: MetricType, range: TimeRange) => {
  const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365;
  const data = [];
  
  let baseValue = 60;
  let trend = 0.1; // Slight upward trend
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    
    // Add seasonality (weekly pattern)
    const dayOfWeek = date.getDay();
    const seasonality = dayOfWeek === 0 || dayOfWeek === 6 ? -5 : 0; // Lower on weekends
    
    // Add random noise
    const noise = (Math.random() - 0.5) * 10;
    
    // Calculate value with trend
    const value = baseValue + (i * trend) + seasonality + noise;
    
    // Moving average (7-day)
    const movingAvgStart = Math.max(0, i - 6);
    const movingAvgData = data.slice(movingAvgStart, i + 1);
    const movingAvg = movingAvgData.length > 0
      ? movingAvgData.reduce((sum, d) => sum + d.value, 0) / movingAvgData.length
      : value;
    
    data.push({
      date: date.toLocaleDateString('pt-PT', { month: 'short', day: 'numeric' }),
      fullDate: date.toISOString(),
      value: Math.round(value),
      movingAvg: Math.round(movingAvg),
      forecast: i >= days - 7 ? Math.round(value + 5 + Math.random() * 5) : null,
    });
  }
  
  return data;
};

export function TrendAnalysis() {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('hrv');
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [showMovingAvg, setShowMovingAvg] = useState(true);
  const [showForecast, setShowForecast] = useState(true);

  const metric = METRICS.find((m) => m.id === selectedMetric)!;
  const data = generateTimeSeriesData(selectedMetric, timeRange);

  // Calculate trend statistics
  const firstValue = data[0]?.value || 0;
  const lastValue = data[data.length - 1]?.value || 0;
  const change = lastValue - firstValue;
  const changePercent = ((change / firstValue) * 100).toFixed(1);
  const isPositive = change > 0;

  const avgValue = Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length);
  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const volatility = Math.round(maxValue - minValue);

  // Detect anomalies (values > 2 std dev from mean)
  const stdDev = Math.sqrt(
    data.reduce((sum, d) => sum + Math.pow(d.value - avgValue, 2), 0) / data.length
  );
  const anomalies = data.filter((d) => Math.abs(d.value - avgValue) > 2 * stdDev);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap gap-3">
          {/* Metric Selector */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-slate-700 mb-2">Metric</label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as MetricType)}
              className="w-full px-4 py-2 text-sm border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300 transition-all"
            >
              {METRICS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Time Range */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">Time Range</label>
            <div className="flex gap-2">
              {(['7d', '30d', '90d', '1y'] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 text-sm rounded-xl transition-all ${
                    timeRange === range
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">Options</label>
            <div className="flex gap-2">
              <button
                onClick={() => setShowMovingAvg(!showMovingAvg)}
                className={`px-3 py-2 text-xs rounded-lg transition-all ${
                  showMovingAvg
                    ? 'bg-sky-100 text-sky-700 border-2 border-sky-300'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                MA (7d)
              </button>
              <button
                onClick={() => setShowForecast(!showForecast)}
                className={`px-3 py-2 text-xs rounded-lg transition-all ${
                  showForecast
                    ? 'bg-violet-100 text-violet-700 border-2 border-violet-300'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                Forecast
              </button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl bg-gradient-to-br ${
              isPositive ? 'from-emerald-50 to-white border-2 border-emerald-200' : 'from-red-50 to-white border-2 border-red-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <p className="text-xs text-slate-500">Trend</p>
            </div>
            <p className={`text-2xl font-semibold ${isPositive ? 'text-emerald-900' : 'text-red-900'}`}>
              {isPositive ? '+' : ''}
              {changePercent}%
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {isPositive ? '+' : ''}
              {change} {metric.unit}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-xl bg-gradient-to-br from-sky-50 to-white border-2 border-sky-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-sky-600" />
              <p className="text-xs text-slate-500">Average</p>
            </div>
            <p className="text-2xl font-semibold text-sky-900">{avgValue}</p>
            <p className="text-xs text-slate-500 mt-1">{metric.unit}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-white border-2 border-violet-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-violet-600" />
              <p className="text-xs text-slate-500">Range</p>
            </div>
            <p className="text-2xl font-semibold text-violet-900">
              {minValue}-{maxValue}
            </p>
            <p className="text-xs text-slate-500 mt-1">Volatility: {volatility}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-white border-2 border-amber-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <p className="text-xs text-slate-500">Anomalies</p>
            </div>
            <p className="text-2xl font-semibold text-amber-900">{anomalies.length}</p>
            <p className="text-xs text-slate-500 mt-1">Outliers detected</p>
          </motion.div>
        </div>

        {/* Main Chart */}
        <div className="p-5 rounded-2xl bg-white border-2 border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">
              {metric.label} Trend Analysis
            </h3>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={metric.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={metric.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                stroke="#64748b"
                interval={Math.floor(data.length / 10)}
              />
              <YAxis tick={{ fontSize: 11 }} stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              
              {/* Average reference line */}
              <ReferenceLine y={avgValue} stroke="#64748b" strokeDasharray="5 5" label="Avg" />
              
              {/* Actual values */}
              <Area
                type="monotone"
                dataKey="value"
                stroke={metric.color}
                strokeWidth={2}
                fill="url(#colorValue)"
                name={metric.label}
              />
              
              {/* Moving average */}
              {showMovingAvg && (
                <Line
                  type="monotone"
                  dataKey="movingAvg"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="7-day MA"
                />
              )}
              
              {/* Forecast */}
              {showForecast && (
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={false}
                  name="Forecast"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Trend Insights */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-200">
            <h3 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Trend Insights
            </h3>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-white border border-emerald-200">
                <p className="text-sm text-emerald-900">
                  {isPositive ? '📈' : '📉'} {metric.label} is trending{' '}
                  <strong>{isPositive ? 'upward' : 'downward'}</strong> by {Math.abs(change)}{' '}
                  {metric.unit} ({changePercent}%)
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-emerald-200">
                <p className="text-sm text-emerald-900">
                  📊 Current value ({lastValue}) is{' '}
                  <strong>
                    {lastValue > avgValue ? 'above' : 'below'} average
                  </strong>{' '}
                  by {Math.abs(lastValue - avgValue)} {metric.unit}
                </p>
              </div>
              {volatility > 20 && (
                <div className="p-3 rounded-xl bg-white border border-amber-200">
                  <p className="text-sm text-amber-900">
                    ⚠️ High volatility detected (range: {volatility}). Consider investigating causes.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Anomalies */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-red-50 to-white border-2 border-red-200">
            <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Anomalies Detected
            </h3>
            {anomalies.length > 0 ? (
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {anomalies.map((anomaly, index) => (
                  <div key={index} className="p-3 rounded-xl bg-white border border-red-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-900">{anomaly.date}</span>
                      <span className="text-sm font-bold text-red-600">
                        {anomaly.value} {metric.unit}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {Math.abs(anomaly.value - avgValue).toFixed(0)} {metric.unit} from average
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-white border border-emerald-200 text-center">
                <p className="text-sm text-emerald-900">
                  ✅ No anomalies detected in this period
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
