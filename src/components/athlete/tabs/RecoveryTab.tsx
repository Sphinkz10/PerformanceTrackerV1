import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { DrawerType } from '@/types/athlete-profile';

interface RecoveryTabProps {
  athleteId: string;
  onOpenDrawer: (drawer: DrawerType, data?: any) => void;
}

export function RecoveryTab({ onOpenDrawer }: RecoveryTabProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
      <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
      <p className="text-sm font-semibold text-slate-600">Dados de Recuperação</p>
      <p className="text-xs text-slate-500 mt-1">HRV, sono, wellness, stress (em desenvolvimento)</p>
    </motion.div>
  );
}
