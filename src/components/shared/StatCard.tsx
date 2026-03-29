import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
  trendPositive?: boolean;
  color?: "emerald" | "sky" | "amber" | "violet" | "red";
  delay?: number;
  action?: () => void;
}

const colorClasses = {
  emerald: {
    gradient: "bg-gradient-to-br from-emerald-50/90 to-white/90",
    iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
  },
  sky: {
    gradient: "bg-gradient-to-br from-sky-50/90 to-white/90",
    iconBg: "bg-gradient-to-br from-sky-500 to-sky-600",
  },
  amber: {
    gradient: "bg-gradient-to-br from-amber-50/90 to-white/90",
    iconBg: "bg-gradient-to-br from-amber-500 to-amber-600",
  },
  violet: {
    gradient: "bg-gradient-to-br from-violet-50/90 to-white/90",
    iconBg: "bg-gradient-to-br from-violet-500 to-violet-600",
  },
  red: {
    gradient: "bg-gradient-to-br from-red-50/30 to-white/90",
    iconBg: "bg-gradient-to-br from-red-500 to-red-600",
  },
};

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendPositive = true,
  color = "emerald",
  delay = 0,
  action,
}: StatCardProps) {
  const colors = colorClasses[color];

  const content = (
    <>
      <div className="flex items-center gap-2 mb-2">
        <div className={`h-8 w-8 rounded-xl ${colors.iconBg} flex items-center justify-center`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
      </div>
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
      {trend && (
        <p className={`text-xs font-medium mt-1 ${trendPositive ? 'text-emerald-600' : 'text-red-600'}`}>
          {trend}
        </p>
      )}
    </>
  );

  if (action) {
    return (
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={action}
        className={`w-full text-left rounded-2xl border border-slate-200/80 ${colors.gradient} p-4 shadow-sm hover:shadow-md transition-all cursor-pointer`}
      >
        {content}
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`rounded-2xl border border-slate-200/80 ${colors.gradient} p-4 shadow-sm`}
    >
      {content}
    </motion.div>
  );
}