import { ReactNode } from "react";

interface CardProps {
  title?: string;
  subtitle?: string;
  accent?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Card({ title, subtitle, accent, action, children, className = "" }: CardProps) {
  return (
    <div className={`rounded-2xl border border-slate-200/80 ${accent || 'bg-white'} p-4 sm:p-5 shadow-sm ${className}`}>
      {(title || action) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && <h3 className="font-semibold text-slate-900">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0 ml-4">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
