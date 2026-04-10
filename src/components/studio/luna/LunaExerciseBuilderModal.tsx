import React, { useState } from 'react';
import { X, Save, Dumbbell, Circle, Activity } from 'lucide-react';
import styles from './luna.module.css';
import { useLunaStore } from './LunaContext';
import { LunaLibraryItem } from './types';
import toast from 'react-hot-toast';

interface LunaExerciseBuilderModalProps {
  onExerciseCreated?: () => void;
}

export const LunaExerciseBuilderModal: React.FC<LunaExerciseBuilderModalProps> = ({ onExerciseCreated }) => {
  const { isExerciseBuilderOpen, closeExerciseBuilder, addNewExerciseToLibrary } = useLunaStore();

  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('Peito');
  const [equipment, setEquipment] = useState('Halteres');

  if (!isExerciseBuilderOpen) return null;

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error('O nome do exercício é obrigatório');
      return;
    }

    // Determine type and color based on equipment/muscle group logic
    let type: 'compound' | 'isolation' | 'bodyweight' = 'isolation';
    let color: 'teal' | 'orange' | 'gold' = 'teal';

    if (equipment === 'Peso Corporal') {
      type = 'bodyweight';
      color = 'gold';
    } else if (['Barra', 'Halteres'].includes(equipment)) {
      type = 'compound';
      color = 'orange';
    }

    const newExercise: LunaLibraryItem = {
      id: `local-ex-${Date.now()}`,
      name: name.trim(),
      category: `${muscleGroup} • ${equipment}`,
      type,
      color,
    };

    addNewExerciseToLibrary(newExercise);

    // Show toast message (can be customized)
    if (onExerciseCreated) {
      onExerciseCreated();
    } else {
      toast.success('Exercício criado!');
    }

    // Reset and close
    setName('');
    setMuscleGroup('Peito');
    setEquipment('Halteres');
    closeExerciseBuilder();
  };

  const handleClose = () => {
    setName('');
    setMuscleGroup('Peito');
    setEquipment('Halteres');
    closeExerciseBuilder();
  };

  return (
    <div className={`${styles.modalBackdrop} ${styles.open}`}>
      <div className={styles.modal} style={{ maxWidth: '400px' }}>
        <div className={styles.modalHeader}>
          <h2>
            <Dumbbell size={16} />
            Novo Exercício
          </h2>
          <button className={styles.modalClose} onClick={handleClose}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Nome do Exercício</label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="Ex: Supino Inclinado"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Grupo Muscular</label>
            <select
              className={styles.formSelect}
              value={muscleGroup}
              onChange={(e) => setMuscleGroup(e.target.value)}
            >
              <option value="Peito">Peito</option>
              <option value="Costas">Costas</option>
              <option value="Pernas">Pernas</option>
              <option value="Ombros">Ombros</option>
              <option value="Braços">Braços</option>
              <option value="Core">Core</option>
              <option value="Cardio">Cardio</option>
              <option value="Corpo Inteiro">Corpo Inteiro</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Equipamento</label>
            <select
              className={styles.formSelect}
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
            >
              <option value="Halteres">Halteres</option>
              <option value="Barra">Barra</option>
              <option value="Máquina">Máquina</option>
              <option value="Peso Corporal">Peso Corporal</option>
              <option value="Cabos">Cabos</option>
              <option value="Kettlebell">Kettlebell</option>
              <option value="Nenhum">Nenhum</option>
            </select>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={handleClose}>
            Cancelar
          </button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleCreate}>
            <Save size={14} />
            Criar Exercício
          </button>
        </div>
      </div>
    </div>
  );
};
