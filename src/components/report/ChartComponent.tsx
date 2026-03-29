import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ChartComponentProps {
  config: {
    title: string;
    chartType: "line" | "bar" | "area" | "pie";
    data: any[];
    xField?: string;
    yField?: string;
    colors?: string[];
  };
  isEditing?: boolean;
}

const DEFAULT_COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

export function ChartComponent({ config, isEditing = false }: ChartComponentProps) {
  const { title, chartType, data, xField = "name", yField = "value", colors = DEFAULT_COLORS } = config;

  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50 rounded-lg">
        <p className="text-sm text-slate-400">Sem dados para exibir</p>
      </div>
    );
  }

  const renderChart = () => {
    switch (chartType) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey={xField} 
                tick={{ fontSize: 12 }} 
                stroke="#64748b"
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                stroke="#64748b"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '12px', 
                  fontSize: '12px' 
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line 
                type="monotone" 
                dataKey={yField} 
                stroke={colors[0]} 
                strokeWidth={3}
                dot={{ fill: colors[0], r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "bar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey={xField} 
                tick={{ fontSize: 12 }} 
                stroke="#64748b"
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                stroke="#64748b"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '12px', 
                  fontSize: '12px' 
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar 
                dataKey={yField} 
                fill={colors[0]}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case "area":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[0]} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={colors[0]} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey={xField} 
                tick={{ fontSize: 12 }} 
                stroke="#64748b"
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                stroke="#64748b"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '12px', 
                  fontSize: '12px' 
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area 
                type="monotone" 
                dataKey={yField} 
                stroke={colors[0]} 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey={yField}
                nameKey={xField}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={(entry) => `${entry[xField]}: ${entry[yField]}`}
                labelLine={true}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '12px', 
                  fontSize: '12px' 
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col min-h-[200px]">
      {title && (
        <h3 className="text-sm font-semibold text-slate-900 mb-3">{title}</h3>
      )}
      <div className="flex-1 min-h-[150px]">
        {renderChart()}
      </div>
    </div>
  );
}