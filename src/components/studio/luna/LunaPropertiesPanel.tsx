import React, { useState } from 'react';
import { Dumbbell, Activity, ChevronDown, ChevronRight, Info } from 'lucide-react';
import styles from './luna.module.css';
import { useLunaStore } from './LunaContext';

export const LunaPropertiesPanel: React.FC = () => {
  const [analyzerOpen, setAnalyzerOpen] = useState(true);
  const { currentWorkout, selectedElement, updateExerciseConfig } = useLunaStore();

  let selectedEx = null;
  let selectedBlockId = null;

  if (currentWorkout && selectedElement) {
    for (const block of currentWorkout.blocks) {
      const ex = block.exercises.find((e) => e.id === selectedElement);
      if (ex) {
        selectedEx = ex;
        selectedBlockId = block.id;
        break;
      }
    }
  }

  const handleChange = (field: string, value: any) => {
    if (selectedEx && selectedBlockId) {
      updateExerciseConfig(selectedBlockId, selectedEx.id, { [field]: value });
    }
  };

  if (!selectedEx) {
    return (
      <aside className={`${styles.rightCol} ${styles.glass}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24 }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: '50%', marginBottom: 16 }}>
          <Info size={24} color="var(--muted)" />
        </div>
        <div style={{ color: 'var(--white)', fontWeight: 500, fontSize: '0.9rem', marginBottom: 8 }}>Nenhum exercício selecionado</div>
        <div style={{ color: 'var(--muted-hi)', fontSize: '0.8rem', maxWidth: 200 }}>Selecione um exercício no workspace para configurar as suas propriedades.</div>
      </aside>
    );
  }

  return (
    <aside className={`${styles.rightCol} ${styles.glass}`}>
      <div className={styles.propsHeader}>
        <div className={styles.propsHeaderIcon}>
          <Dumbbell size={14} />
        </div>
        <div className={styles.propsHeaderText}>
          <div className={styles.propsHeaderTitle}>Propriedades &middot; Exercício</div>
          <div className={styles.propsHeaderName}>{selectedEx.name}</div>
        </div>
      </div>

      <div className={styles.propsBody}>
        <div className={styles.sectionTitle}>Parâmetros</div>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Séries</label>
            <input type="number" className={styles.fieldInput} value={selectedEx.config.sets || ''} onChange={(e) => handleChange('sets', Number(e.target.value))} />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Reps</label>
            <input type="text" className={styles.fieldInput} value={selectedEx.config.reps || ''} onChange={(e) => handleChange('reps', e.target.value)} />
          </div>
        </div>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Carga (kg)</label>
            <input type="text" className={styles.fieldInput} value={selectedEx.config.weight || ''} onChange={(e) => handleChange('weight', e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>RPE</label>
            <input type="number" className={styles.fieldInput} value={selectedEx.config.rpe || ''} min="1" max="10" onChange={(e) => handleChange('rpe', Number(e.target.value))} />
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Descanso entre séries</label>
          <input type="text" className={styles.fieldInput} value={selectedEx.config.rest || ''} onChange={(e) => handleChange('rest', e.target.value)} />
        </div>

        <div className={styles.sectionTitle}>Tempo &middot; Cadência</div>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Tempo</label>
            <input type="text" className={styles.fieldInput} value={selectedEx.config.cadence || ''} onChange={(e) => handleChange('cadence', e.target.value)} />
          </div>
          {/* Ordem input left out as it is not part of config yet */}
        </div>

        <div className={styles.sectionTitle}>Notas Técnicas</div>
        <div className={styles.field}>
          <textarea
            className={styles.fieldInput}
            rows={3}
            style={{ resize: 'vertical' }}
            value={selectedEx.config.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
          />
        </div>
      </div>

      <div className={styles.analyzer}>
        <button
          className={styles.analyzerToggle}
          onClick={() => setAnalyzerOpen(!analyzerOpen)}
        >
          <div className={styles.analyzerToggleLeft}>
            <Activity size={12} />
            Health Check
          </div>
          {analyzerOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </button>

        {analyzerOpen && (
          <div className={styles.analyzerContent}>
            <div className={styles.analyzerStat}>
              <span className={styles.analyzerStatLabel}>Volume Total</span>
              <span className={`${styles.analyzerStatValue} ${styles.gold}`}>2,850 kg</span>
            </div>
            <div className={styles.analyzerStat}>
              <span className={styles.analyzerStatLabel}>Intensidade</span>
              <span className={`${styles.analyzerStatValue} ${styles.teal}`}>Alta</span>
            </div>
            <div className={styles.analyzerStat}>
              <span className={styles.analyzerStatLabel}>Densidade</span>
              <span className={`${styles.analyzerStatValue} ${styles.orange}`}>68%</span>
            </div>

            <div className={styles.muscleBars}>
              <div className={styles.muscleRow}>
                <div className={styles.muscleRowHead}>Peito <b>40%</b></div>
                <div className={styles.muscleBar}><div className={styles.muscleBarFill} style={{ width: '40%' }}></div></div>
              </div>
              <div className={styles.muscleRow}>
                <div className={styles.muscleRowHead}>Pernas <b>35%</b></div>
                <div className={styles.muscleBar}><div className={styles.muscleBarFill} style={{ width: '35%' }}></div></div>
              </div>
              <div className={styles.muscleRow}>
                <div className={styles.muscleRowHead}>Costas <b>20%</b></div>
                <div className={styles.muscleBar}><div className={styles.muscleBarFill} style={{ width: '20%' }}></div></div>
              </div>
              <div className={styles.muscleRow}>
                <div className={styles.muscleRowHead}>Core <b>5%</b></div>
                <div className={styles.muscleBar}><div className={styles.muscleBarFill} style={{ width: '5%' }}></div></div>
              </div>
            </div>

            <div className={styles.recommendation}>
              <div className={styles.recommendationIcon}>
                <Activity size={12} />
              </div>
              <div className={styles.recommendationText}>
                <b>Sugestão:</b> Considera adicionar trabalho de pulling para equilibrar o volume Push/Pull.
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
