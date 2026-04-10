import React, { useState } from 'react';
import { Dumbbell, Activity, ChevronDown, ChevronRight, Info } from 'lucide-react';
import styles from './luna.module.css';
import { useLunaStore } from './LunaContext';
import { calculateTotalVolume, calculateIntensity, calculateMuscleDistribution } from './lunaUtils';

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

  const volume = calculateTotalVolume(currentWorkout);
  const intensity = calculateIntensity(currentWorkout);
  const muscleDistribution = calculateMuscleDistribution(currentWorkout);

  return (
    <aside className={`${styles.rightCol} ${styles.glass}`} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Scrollable Properties Area */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {!selectedEx ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24, height: '100%' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: '50%', marginBottom: 16 }}>
              <Info size={24} color="var(--muted)" />
            </div>
            <div style={{ color: 'var(--white)', fontWeight: 500, fontSize: '0.9rem', marginBottom: 8 }}>Nenhum exercício selecionado</div>
            <div style={{ color: 'var(--muted-hi)', fontSize: '0.8rem', maxWidth: 200 }}>Selecione um exercício no workspace para configurar as suas propriedades.</div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>

      {/* Fixed Analyzer at bottom */}
      <div className={styles.analyzer} style={{ marginTop: 'auto', borderTop: '1px solid rgba(142,202,230,0.1)' }}>
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
              <span className={`${styles.analyzerStatValue} ${styles.gold}`}>{volume > 0 ? `${volume.toLocaleString()} kg` : '0 kg'}</span>
            </div>
            <div className={styles.analyzerStat}>
              <span className={styles.analyzerStatLabel}>Intensidade</span>
              <span className={`${styles.analyzerStatValue} ${styles.teal}`}>{intensity}</span>
            </div>
            <div className={styles.analyzerStat}>
              <span className={styles.analyzerStatLabel}>Densidade</span>
              <span className={`${styles.analyzerStatValue} ${styles.orange}`}>N/A</span>
            </div>

            <div className={styles.muscleBars}>
              {muscleDistribution.length > 0 ? (
                muscleDistribution.map((muscle) => (
                  <div key={muscle.name} className={styles.muscleRow}>
                    <div className={styles.muscleRowHead}>{muscle.name} <b>{muscle.percentage}%</b></div>
                    <div className={styles.muscleBar}>
                      <div className={styles.muscleBarFill} style={{ width: `${muscle.percentage}%` }}></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.muscleRow}>
                  <div className={styles.muscleRowHead}>N/A <b>0%</b></div>
                  <div className={styles.muscleBar}>
                    <div className={styles.muscleBarFill} style={{ width: '0%' }}></div>
                  </div>
                </div>
              )}
            </div>

            {muscleDistribution.length > 0 && (
              <div className={styles.recommendation}>
                <div className={styles.recommendationIcon}>
                  <Activity size={12} />
                </div>
                <div className={styles.recommendationText}>
                  <b>Análise:</b> Distribuição calculada com sucesso com base nos exercícios planeados.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
