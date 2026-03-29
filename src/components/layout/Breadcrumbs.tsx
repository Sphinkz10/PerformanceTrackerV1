import { ChevronRight, Home } from "lucide-react";
import { motion } from "motion/react";

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <div className="flex items-center gap-2 text-sm mb-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={items[0]?.onClick}
        className="flex items-center gap-1 text-slate-600 hover:text-sky-600 transition-colors"
      >
        <Home className="h-4 w-4" />
      </motion.button>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 text-slate-400" />
          {index === items.length - 1 ? (
            <span className="font-medium text-slate-900">{item.label}</span>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={item.onClick}
              className="text-slate-600 hover:text-sky-600 transition-colors"
            >
              {item.label}
            </motion.button>
          )}
        </div>
      ))}
    </div>
  );
}
