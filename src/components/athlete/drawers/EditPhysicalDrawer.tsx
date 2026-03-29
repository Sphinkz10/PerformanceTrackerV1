import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Ruler, Weight, Droplet, Dumbbell } from 'lucide-react';
import { AthletePhysicalData } from '@/types/athlete-profile';

interface EditPhysicalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  athleteId: string;
  athleteName: string;
  athleteAvatar: string;
  physicalData: AthletePhysicalData;
  onSave: (updates: any) => void;
}

export function EditPhysicalDrawer({
  isOpen,
  onClose,
  athleteId,
  athleteName,
  athleteAvatar,
  physicalData,
  onSave
}: EditPhysicalDrawerProps) {
  const [formData, setFormData] = useState({
    height_cm: physicalData?.height_cm || '',
    weight_kg: physicalData?.weight_kg || '',
    body_fat_percentage: physicalData?.body_fat_percentage || '',
    lean_mass_kg: physicalData?.lean_mass_kg || '',
    wingspan_cm: physicalData?.wingspan_cm || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert strings to numbers
    const updates = {
      height_cm: formData.height_cm ? Number(formData.height_cm) : undefined,
      weight_kg: formData.weight_kg ? Number(formData.weight_kg) : undefined,
      body_fat_percentage: formData.body_fat_percentage ? Number(formData.body_fat_percentage) : undefined,
      lean_mass_kg: formData.lean_mass_kg ? Number(formData.lean_mass_kg) : undefined,
      wingspan_cm: formData.wingspan_cm ? Number(formData.wingspan_cm) : undefined,
      last_physical_update: new Date().toISOString(),
      physical_data_source: 'manual'
    };

    onSave(updates);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Auto-calculate lean mass if weight and body fat are set
    if (field === 'weight_kg' || field === 'body_fat_percentage') {
      const weight = field === 'weight_kg' ? Number(value) : Number(formData.weight_kg);
      const bodyFat = field === 'body_fat_percentage' ? Number(value) : Number(formData.body_fat_percentage);

      if (weight && bodyFat) {
        const leanMass = weight * (1 - bodyFat / 100);
        setFormData(prev => ({ ...prev, lean_mass_kg: leanMass.toFixed(1) }));
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg h-full bg-white shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Editar Dados Físicos</h2>
                <p className="text-sm text-slate-500 mt-0.5">{athleteName}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Height */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
                  <Ruler className="w-4 h-4 text-sky-600" />
                  Altura (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.height_cm}
                  onChange={(e) => handleChange('height_cm', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                  placeholder="178.5"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
                  <Weight className="w-4 h-4 text-emerald-600" />
                  Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight_kg}
                  onChange={(e) => handleChange('weight_kg', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300 transition-all"
                  placeholder="75.5"
                />
              </div>

              {/* Body Fat % */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
                  <Droplet className="w-4 h-4 text-amber-600" />
                  % Gordura Corporal
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.body_fat_percentage}
                  onChange={(e) => handleChange('body_fat_percentage', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-300 transition-all"
                  placeholder="12.5"
                />
              </div>

              {/* Lean Mass (auto-calculated) */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
                  <Dumbbell className="w-4 h-4 text-indigo-600" />
                  Massa Magra (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.lean_mass_kg}
                  onChange={(e) => handleChange('lean_mass_kg', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300 transition-all"
                  placeholder="66.1"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Calculado automaticamente com base no peso e % gordura
                </p>
              </div>

              {/* Wingspan */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
                  <Ruler className="w-4 h-4 text-slate-600" />
                  Envergadura (cm) <span className="text-xs font-normal text-slate-500">(opcional)</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.wingspan_cm}
                  onChange={(e) => handleChange('wingspan_cm', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500/30 focus:border-slate-300 transition-all"
                  placeholder="182.0"
                />
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-slate-200 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-500 to-violet-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                  <Save className="w-5 h-5" />
                  Guardar
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}