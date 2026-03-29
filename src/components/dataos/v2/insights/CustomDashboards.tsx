/**
 * CUSTOM DASHBOARDS - Build your own dashboards
 * Drag & drop widgets, save layouts, templates
 */

'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Layout,
  Plus,
  Save,
  Grid3x3,
  BarChart3,
  Activity,
  Users,
  TrendingUp,
  Heart,
  Zap,
  Target,
  Award,
  AlertTriangle,
  Download,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';

type WidgetType =
  | 'metric_card'
  | 'line_chart'
  | 'bar_chart'
  | 'athlete_list'
  | 'risk_alert'
  | 'performance_radar'
  | 'trend_summary';

interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  size: 'small' | 'medium' | 'large';
  data?: any;
}

interface Dashboard {
  id: string;
  name: string;
  description: string;
  widgets: Widget[];
  isDefault: boolean;
}

const WIDGET_TEMPLATES: {
  type: WidgetType;
  label: string;
  icon: any;
  color: string;
  description: string;
}[] = [
  {
    type: 'metric_card',
    label: 'Metric Card',
    icon: BarChart3,
    color: 'sky',
    description: 'Display single metric value',
  },
  {
    type: 'line_chart',
    label: 'Line Chart',
    icon: TrendingUp,
    color: 'emerald',
    description: 'Time series visualization',
  },
  {
    type: 'bar_chart',
    label: 'Bar Chart',
    icon: BarChart3,
    color: 'violet',
    description: 'Compare multiple values',
  },
  {
    type: 'athlete_list',
    label: 'Athlete List',
    icon: Users,
    color: 'amber',
    description: 'List of athletes with metrics',
  },
  {
    type: 'risk_alert',
    label: 'Risk Alerts',
    icon: AlertTriangle,
    color: 'red',
    description: 'High-risk athlete alerts',
  },
  {
    type: 'performance_radar',
    label: 'Performance Radar',
    icon: Target,
    color: 'purple',
    description: 'Multi-dimensional performance',
  },
  {
    type: 'trend_summary',
    label: 'Trend Summary',
    icon: Activity,
    color: 'pink',
    description: 'Quick trend indicators',
  },
];

const MOCK_DASHBOARDS: Dashboard[] = [
  {
    id: 'dash-1',
    name: 'Performance Overview',
    description: 'High-level team performance metrics',
    isDefault: true,
    widgets: [
      { id: 'w1', type: 'metric_card', title: 'Team Average HRV', size: 'small' },
      { id: 'w2', type: 'metric_card', title: 'Training Load (7d)', size: 'small' },
      { id: 'w3', type: 'metric_card', title: 'Wellness Score', size: 'small' },
      { id: 'w4', type: 'line_chart', title: 'HRV Trend (30d)', size: 'large' },
      { id: 'w5', type: 'athlete_list', title: 'Top Performers', size: 'medium' },
      { id: 'w6', type: 'risk_alert', title: 'Risk Alerts', size: 'medium' },
    ],
  },
  {
    id: 'dash-2',
    name: 'Recovery Dashboard',
    description: 'Focus on recovery and wellness',
    isDefault: false,
    widgets: [
      { id: 'w7', type: 'metric_card', title: 'Recovery Score', size: 'small' },
      { id: 'w8', type: 'metric_card', title: 'Sleep Quality', size: 'small' },
      { id: 'w9', type: 'trend_summary', title: 'Recovery Trends', size: 'large' },
      { id: 'w10', type: 'athlete_list', title: 'Athletes Needing Rest', size: 'large' },
    ],
  },
  {
    id: 'dash-3',
    name: 'Risk Management',
    description: 'Injury and overtraining prevention',
    isDefault: false,
    widgets: [
      { id: 'w11', type: 'risk_alert', title: 'Critical Alerts', size: 'large' },
      { id: 'w12', type: 'performance_radar', title: 'Risk Profile', size: 'medium' },
      { id: 'w13', type: 'athlete_list', title: 'High Risk Athletes', size: 'medium' },
      { id: 'w14', type: 'bar_chart', title: 'Risk Distribution', size: 'medium' },
    ],
  },
];

export function CustomDashboards() {
  const [dashboards, setDashboards] = useState<Dashboard[]>(MOCK_DASHBOARDS);
  const [selectedDashboardId, setSelectedDashboardId] = useState<string>(MOCK_DASHBOARDS[0].id);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showWidgetPalette, setShowWidgetPalette] = useState(false);

  const selectedDashboard = dashboards.find((d) => d.id === selectedDashboardId)!;

  const handleAddWidget = (widgetType: WidgetType) => {
    const newWidget: Widget = {
      id: `w-${Date.now()}`,
      type: widgetType,
      title: WIDGET_TEMPLATES.find((t) => t.type === widgetType)!.label,
      size: 'medium',
    };

    setDashboards((prev) =>
      prev.map((dash) =>
        dash.id === selectedDashboardId
          ? { ...dash, widgets: [...dash.widgets, newWidget] }
          : dash
      )
    );

    setShowWidgetPalette(false);
  };

  const handleRemoveWidget = (widgetId: string) => {
    setDashboards((prev) =>
      prev.map((dash) =>
        dash.id === selectedDashboardId
          ? { ...dash, widgets: dash.widgets.filter((w) => w.id !== widgetId) }
          : dash
      )
    );
  };

  const handleCreateDashboard = () => {
    const newDashboard: Dashboard = {
      id: `dash-${Date.now()}`,
      name: `Dashboard ${dashboards.length + 1}`,
      description: 'Custom dashboard',
      widgets: [],
      isDefault: false,
    };

    setDashboards((prev) => [...prev, newDashboard]);
    setSelectedDashboardId(newDashboard.id);
    setIsEditMode(true);
  };

  const handleDeleteDashboard = (dashboardId: string) => {
    if (dashboards.find((d) => d.id === dashboardId)?.isDefault) {
      alert('⚠️ Cannot delete default dashboard');
      return;
    }

    setDashboards((prev) => prev.filter((d) => d.id !== dashboardId));
    setSelectedDashboardId(MOCK_DASHBOARDS[0].id);
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-slate-900">Custom Dashboards</h2>
            <p className="text-sm text-slate-500 mt-1">
              Build personalized dashboards with drag & drop widgets
            </p>
          </div>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditMode(!isEditMode)}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-xl transition-all ${
                isEditMode
                  ? 'bg-violet-500 text-white shadow-lg'
                  : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-violet-300'
              }`}
            >
              {isEditMode ? <Eye className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              {isEditMode ? 'View Mode' : 'Edit Mode'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateDashboard}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg hover:from-emerald-400 hover:to-emerald-500 transition-all"
            >
              <Plus className="h-4 w-4" />
              New Dashboard
            </motion.button>
          </div>
        </div>

        {/* Dashboard Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {dashboards.map((dashboard) => {
            const isSelected = selectedDashboardId === dashboard.id;

            return (
              <div key={dashboard.id} className="relative group">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedDashboardId(dashboard.id)}
                  className={`flex items-center gap-2 px-6 py-3 text-sm rounded-xl transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30'
                      : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-amber-300'
                  }`}
                >
                  <Layout className="h-4 w-4" />
                  {dashboard.name}
                  {dashboard.isDefault && (
                    <span className="px-2 py-0.5 rounded bg-white/20 text-xs">Default</span>
                  )}
                </motion.button>

                {/* Delete button (only in edit mode) */}
                {isEditMode && !dashboard.isDefault && (
                  <button
                    onClick={() => handleDeleteDashboard(dashboard.id)}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Dashboard Info */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-amber-900">{selectedDashboard.name}</h3>
              <p className="text-sm text-amber-700 mt-1">{selectedDashboard.description}</p>
            </div>
            <span className="text-xs text-amber-600">
              {selectedDashboard.widgets.length} widgets
            </span>
          </div>
        </div>

        {/* Widget Palette (Edit Mode) */}
        {isEditMode && (
          <div className="p-5 rounded-2xl bg-white border-2 border-dashed border-violet-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Widget Library</h3>
              <button
                onClick={() => setShowWidgetPalette(!showWidgetPalette)}
                className="text-sm text-violet-600 hover:text-violet-700"
              >
                {showWidgetPalette ? 'Hide' : 'Show'} widgets
              </button>
            </div>

            {showWidgetPalette && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {WIDGET_TEMPLATES.map((template) => {
                  const Icon = template.icon;

                  return (
                    <motion.button
                      key={template.type}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddWidget(template.type)}
                      className={`p-4 rounded-xl text-center bg-${template.color}-50 border-2 border-${template.color}-200 hover:border-${template.color}-400 transition-all`}
                    >
                      <Icon className={`h-6 w-6 mx-auto mb-2 text-${template.color}-600`} />
                      <p className="text-xs font-medium text-slate-900 mb-1">
                        {template.label}
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {template.description}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Dashboard Grid */}
        {selectedDashboard.widgets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedDashboard.widgets.map((widget, index) => (
              <WidgetCard
                key={widget.id}
                widget={widget}
                index={index}
                isEditMode={isEditMode}
                onRemove={() => handleRemoveWidget(widget.id)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-2xl bg-white border-2 border-dashed border-slate-200 text-center">
            <Grid3x3 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-slate-900 mb-2">Empty Dashboard</h3>
            <p className="text-sm text-slate-500 mb-4">
              {isEditMode
                ? 'Click "Show widgets" to add your first widget'
                : 'Switch to Edit Mode to add widgets'}
            </p>
            {!isEditMode && (
              <button
                onClick={() => setIsEditMode(true)}
                className="px-4 py-2 rounded-xl bg-violet-500 text-white text-sm hover:bg-violet-600 transition-colors"
              >
                Enable Edit Mode
              </button>
            )}
          </div>
        )}

        {/* Actions */}
        {isEditMode && selectedDashboard.widgets.length > 0 && (
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
            >
              <Download className="h-4 w-4" />
              Export
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                alert('💾 Dashboard saved!');
                setIsEditMode(false);
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg hover:from-emerald-400 hover:to-emerald-500 transition-all"
            >
              <Save className="h-4 w-4" />
              Save Dashboard
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// WIDGET CARD Component
// ============================================================

function WidgetCard({
  widget,
  index,
  isEditMode,
  onRemove,
}: {
  widget: Widget;
  index: number;
  isEditMode: boolean;
  onRemove: () => void;
}) {
  const template = WIDGET_TEMPLATES.find((t) => t.type === widget.type)!;
  const Icon = template.icon;

  const sizeClasses = {
    small: 'md:col-span-1',
    medium: 'md:col-span-1',
    large: 'md:col-span-2 lg:col-span-2',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className={`relative group ${sizeClasses[widget.size]}`}
    >
      <div
        className={`h-full p-5 rounded-2xl bg-gradient-to-br from-${template.color}-50 to-white border-2 border-${template.color}-200 transition-all ${
          isEditMode ? 'hover:border-${template.color}-400' : ''
        }`}
      >
        {/* Remove button (edit mode only) */}
        {isEditMode && (
          <button
            onClick={onRemove}
            className="absolute top-3 right-3 h-7 w-7 rounded-lg bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}

        {/* Widget Header */}
        <div className="flex items-center gap-2 mb-4">
          <div
            className={`h-8 w-8 rounded-lg bg-gradient-to-br from-${template.color}-500 to-${template.color}-600 flex items-center justify-center`}
          >
            <Icon className="h-4 w-4 text-white" />
          </div>
          <h4 className="font-semibold text-slate-900">{widget.title}</h4>
        </div>

        {/* Widget Content (Mock) */}
        <div className="space-y-3">
          {widget.type === 'metric_card' && (
            <div>
              <p className="text-4xl font-bold text-slate-900">
                {Math.floor(Math.random() * 100)}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                +{Math.floor(Math.random() * 20)}% vs last week
              </p>
            </div>
          )}

          {widget.type === 'athlete_list' && (
            <div className="space-y-2">
              {['João Silva', 'Maria Santos', 'Pedro Costa'].map((name, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white">
                  <span className="text-sm text-slate-900">{name}</span>
                  <span className="text-sm font-bold text-emerald-600">
                    {Math.floor(Math.random() * 100)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {widget.type === 'risk_alert' && (
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-red-100 border border-red-300">
                <p className="text-sm font-medium text-red-900">Ana Rodrigues</p>
                <p className="text-xs text-red-700">High injury risk</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-100 border border-amber-300">
                <p className="text-sm font-medium text-amber-900">João Silva</p>
                <p className="text-xs text-amber-700">Overtraining detected</p>
              </div>
            </div>
          )}

          {(widget.type === 'line_chart' ||
            widget.type === 'bar_chart' ||
            widget.type === 'performance_radar' ||
            widget.type === 'trend_summary') && (
            <div className="h-32 flex items-center justify-center bg-white rounded-lg border-2 border-dashed border-slate-200">
              <p className="text-sm text-slate-400">{template.label} placeholder</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
