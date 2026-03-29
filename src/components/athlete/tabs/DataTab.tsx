import { motion } from 'motion/react';
import { Database } from 'lucide-react';
import { DrawerType } from '@/types/athlete-profile';

interface DataTabProps {
  athleteId: string;
  onOpenDrawer: (drawer: DrawerType, data?: any) => void;
}

export function DataTab({ onOpenDrawer }: DataTabProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
      <Database className="w-12 h-12 text-slate-300 mx-auto mb-3" />
      <p className="text-sm font-semibold text-slate-600">Data OS - Métricas Custom</p>
      <p className="text-xs text-slate-500 mt-1">Métricas personalizadas do Data OS 4.0 (em desenvolvimento)</p>
    </motion.div>
  );
}
