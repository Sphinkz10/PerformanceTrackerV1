import { DashboardWidget, AthleteAnalyticsSummary } from '@/types/athlete-profile';
import { KPICardWidget } from './KPICardWidget';
import { LineChartWidget } from './LineChartWidget';
import { BarChartWidget } from './BarChartWidget';
import { LoadReadinessWidget } from './LoadReadinessWidget';
import { RecentSessionsWidget } from './RecentSessionsWidget';
import { RecoveryStatusWidget } from './RecoveryStatusWidget';
import { AdherenceGaugeWidget } from './AdherenceGaugeWidget';
import { ReportWidget } from './ReportWidget';
import { AlertCircle } from 'lucide-react';

interface WidgetRendererProps {
  widget: DashboardWidget;
  analytics: AthleteAnalyticsSummary | null;
  athleteId: string;
  isConfiguring: boolean;
  onUpdate: (updates: Partial<DashboardWidget>) => void;
  onRemove: () => void;
  onOpenReport?: (reportId: string) => void;
}

export function WidgetRenderer({
  widget,
  analytics,
  athleteId,
  isConfiguring,
  onUpdate,
  onRemove,
  onOpenReport
}: WidgetRendererProps) {
  // Common props for all widgets
  const commonProps = {
    config: widget.config,
    analytics,
    athleteId,
    isConfiguring,
    onUpdate: (config: any) => onUpdate({ config }),
    onRemove
  };

  // Render specific widget type
  switch (widget.type) {
    case 'kpi_card':
      return <KPICardWidget {...commonProps} />;

    case 'line_chart':
      return <LineChartWidget {...commonProps} />;

    case 'bar_chart':
      return <BarChartWidget {...commonProps} />;

    case 'load_readiness':
      return <LoadReadinessWidget {...commonProps} />;

    case 'recent_sessions':
      return <RecentSessionsWidget {...commonProps} />;

    case 'recovery_status':
      return <RecoveryStatusWidget {...commonProps} />;

    case 'adherence_gauge':
      return <AdherenceGaugeWidget {...commonProps} />;

    case 'report_widget':
      return (
        <ReportWidget
          {...commonProps}
          onOpenReport={onOpenReport}
        />
      );

    default:
      return (
        <div className="h-full flex items-center justify-center bg-red-50 border-2 border-red-200 rounded-xl p-4">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-red-700">Widget desconhecido</p>
            <p className="text-xs text-red-600">{widget.type}</p>
          </div>
        </div>
      );
  }
}
