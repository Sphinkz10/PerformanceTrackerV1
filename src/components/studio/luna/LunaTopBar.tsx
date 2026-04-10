import React, { useState } from 'react';
import {
  ArrowLeft,
  Activity,
  Dumbbell,
  Layout,
  Calendar,
  Cpu,
  Calculator,
  Award,
  Clock,
  BarChart2,
  Edit3,
  Eye,
  SlidersHorizontal,
  Save
} from 'lucide-react';
import styles from './luna.module.css';

interface LunaTopBarProps {
  onCalcClick: () => void;
  onDistClick: () => void;
  onSaveClick: () => void;
}

const MODULES = ['Exercícios', 'Treinos', 'Planos', 'Aulas', 'IA'];

export const LunaTopBar: React.FC<LunaTopBarProps> = ({ onCalcClick, onDistClick, onSaveClick }) => {
  const [activeModule, setActiveModule] = useState('Treinos');
  const [activeMode, setActiveMode] = useState<'Edit' | 'Preview'>('Edit');

  return (
    <header className={`${styles.topbar} ${styles.glass}`}>
      <div className={styles.tbLeft}>
        <button className={styles.btnIcon} title="Voltar">
          <ArrowLeft size={16} />
        </button>
        <div className={styles.studioBrand}>
          <div className={styles.studioBrandIcon}>
            <Activity size={14} color="#023047" strokeWidth={2.5} />
          </div>
          <div className={styles.studioBrandText}>
            Design Studio
            <small>LUNA.OS</small>
          </div>
        </div>
      </div>

      <div className={styles.tbCenter}>
        <div className={styles.modules}>
          {MODULES.map((modName) => {
            let Icon = Dumbbell;
            if (modName === 'Exercícios') Icon = Dumbbell;
            if (modName === 'Treinos') Icon = Activity;
            if (modName === 'Planos') Icon = Layout;
            if (modName === 'Aulas') Icon = Calendar;
            if (modName === 'IA') Icon = Cpu;

            return (
              <button
                key={modName}
                className={`${styles.moduleBtn} ${activeModule === modName ? styles.active : ''}`}
                onClick={() => setActiveModule(modName)}
              >
                <Icon size={13} />
                {modName}
              </button>
            );
          })}
          <button className={styles.moduleBtn} onClick={onCalcClick}>
            <Calculator size={13} />
            Calc
          </button>
        </div>
      </div>

      <div className={styles.tbRight}>
        <div className={styles.statsPill}>
          <div className={`${styles.statItem} ${styles.gold}`}>
            <Award size={11} />
            <span>8</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={`${styles.statItem} ${styles.teal}`}>
            <Clock size={11} />
            <span>24</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={`${styles.statItem} ${styles.orange}`}>
            <BarChart2 size={11} />
            <span>3</span>
          </div>
        </div>
        <div className={styles.modeToggle}>
          <button
            className={`${styles.modeBtn} ${activeMode === 'Edit' ? styles.active : ''}`}
            onClick={() => setActiveMode('Edit')}
          >
            <Edit3 size={11} />
            Edit
          </button>
          <button
            className={`${styles.modeBtn} ${activeMode === 'Preview' ? styles.active : ''}`}
            onClick={() => setActiveMode('Preview')}
          >
            <Eye size={11} />
            Preview
          </button>
        </div>
        <button className={styles.btnIcon} onClick={onDistClick} title="Ver Distribuição">
          <SlidersHorizontal size={16} />
        </button>
        <button className={styles.btnSave} onClick={onSaveClick}>
          <Save size={13} />
          Salvar
        </button>
      </div>
    </header>
  );
};
