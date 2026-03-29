import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import type { Metric, MetricUpdate } from '@/types/metrics';

interface MetricChartContainerProps {
  data: MetricUpdate[];
  metric: Metric;
  baseline?: number;
  showZones?: boolean;
  height?: number;
}

interface ChartDataPoint {
  date: string;
  value: number;
  zone: 'green' | 'yellow' | 'red';
  formattedDate: string;
  notes?: string;
}

export function MetricChartContainer({
  data,
  metric,
  baseline,
  showZones = true,
  height = 300,
}: MetricChartContainerProps) {
  // Transform data for chart
  const chartData: ChartDataPoint[] = data.map((update) => ({
    date: format(new Date(update.timestamp), 'dd/MM'),
    value: update.value,
    zone: update.zone || 'green',
    formattedDate: format(new Date(update.timestamp), 'dd MMM yyyy'),
    notes: update.notes,
  }));

  // Calculate zone ranges based on baseline
  const baselineValue = baseline || metric.baseline || 0;
  const lowerThreshold = metric.lowerThreshold || baselineValue * 0.85;
  const upperThreshold = metric.upperThreshold || baselineValue * 1.15;

  // Zone ranges
  const greenMin = lowerThreshold;
  const greenMax = upperThreshold;
  const yellowMinLow = lowerThreshold * 0.9;
  const yellowMaxHigh = upperThreshold * 1.1;

  // Find data range for Y-axis
  const values = chartData.map((d) => d.value);
  const minValue = Math.min(...values, yellowMinLow);
  const maxValue = Math.max(...values, yellowMaxHigh);
  const padding = (maxValue - minValue) * 0.1;

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          {/* Grid */}
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

          {/* Axes */}
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#64748b' }}
            stroke="#94a3b8"
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#64748b' }}
            stroke="#94a3b8"
            domain={[minValue - padding, maxValue + padding]}
            label={{
              value: metric.unit,
              angle: -90,
              position: 'insideLeft',
              style: { fontSize: 12, fill: '#64748b' },
            }}
          />

          {/* Tooltip */}
          <Tooltip content={<CustomTooltip metric={metric} />} />

          {/* Zone bands */}
          {showZones && (
            <>
              {/* Red zone (below lower threshold) */}
              <ReferenceArea
                y1={minValue - padding}
                y2={yellowMinLow}
                fill="#ef4444"
                fillOpacity={0.1}
                strokeOpacity={0}
              />
              {/* Yellow zone (low) */}
              <ReferenceArea
                y1={yellowMinLow}
                y2={greenMin}
                fill="#f59e0b"
                fillOpacity={0.1}
                strokeOpacity={0}
              />
              {/* Green zone */}
              <ReferenceArea
                y1={greenMin}
                y2={greenMax}
                fill="#10b981"
                fillOpacity={0.1}
                strokeOpacity={0}
              />
              {/* Yellow zone (high) */}
              <ReferenceArea
                y1={greenMax}
                y2={yellowMaxHigh}
                fill="#f59e0b"
                fillOpacity={0.1}
                strokeOpacity={0}
              />
              {/* Red zone (above upper threshold) */}
              <ReferenceArea
                y1={yellowMaxHigh}
                y2={maxValue + padding}
                fill="#ef4444"
                fillOpacity={0.1}
                strokeOpacity={0}
              />
            </>
          )}

          {/* Baseline line */}
          {baselineValue && (
            <ReferenceLine
              y={baselineValue}
              stroke="#64748b"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{
                value: 'Baseline',
                position: 'right',
                fill: '#64748b',
                fontSize: 11,
              }}
            />
          )}

          {/* Data line */}
          <Line
            type="monotone"
            dataKey="value"
            stroke="#0ea5e9"
            strokeWidth={3}
            dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, fill: '#0ea5e9' }}
            animationDuration={800}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Custom Tooltip Component
function CustomTooltip({ active, payload, metric }: any) {
  if (!active || !payload || !payload[0]) return null;

  const data = payload[0].payload as ChartDataPoint;
  const zoneColor =
    data.zone === 'green' ? '#10b981' : data.zone === 'yellow' ? '#f59e0b' : '#ef4444';
  const zoneLabel =
    data.zone === 'green' ? '🟢 Normal' : data.zone === 'yellow' ? '🟡 Atenção' : '🔴 Alerta';

  return (
    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xl">
      <p className="text-xs font-semibold text-slate-600 mb-1">{data.formattedDate}</p>
      <p className="text-2xl font-bold mb-1" style={{ color: zoneColor }}>
        {data.value} {metric.unit}
      </p>
      <p className="text-xs font-medium" style={{ color: zoneColor }}>
        {zoneLabel}
      </p>
      {data.notes && (
        <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
          {data.notes}
        </p>
      )}
    </div>
  );
}
