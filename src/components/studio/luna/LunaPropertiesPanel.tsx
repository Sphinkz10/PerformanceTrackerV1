import React, { useState } from 'react';
import { Dumbbell, Activity, ChevronDown, ChevronRight } from 'lucide-react';
import styles from './luna.module.css';

export const LunaPropertiesPanel: React.FC = () => {
  const [analyzerOpen, setAnalyzerOpen] = useState(true);

  return (
    <aside className={`${styles.rightCol} ${styles.glass}`}>
      <div className={styles.propsHeader}>
        <div className={styles.propsHeaderIcon}>
          <Dumbbell size={14} />
        </div>
        <div className={styles.propsHeaderText}>
          <div className={styles.propsHeaderTitle}>Propriedades &middot; Exercício</div>
          <div className={styles.propsHeaderName}>Bench Press</div>
        </div>
      </div>

      <div className={styles.propsBody}>
        <div className={styles.sectionTitle}>Parâmetros</div>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Séries</label>
            <input type="number" className={styles.fieldInput} defaultValue="5" />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Reps</label>
            <input type="number" className={styles.fieldInput} defaultValue="5" />
          </div>
        </div>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Carga (kg)</label>
            <input type="number" className={styles.fieldInput} defaultValue="85" />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>RPE</label>
            <input type="number" className={styles.fieldInput} defaultValue="8" min="1" max="10" />
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Descanso entre séries</label>
          <input type="text" className={styles.fieldInput} defaultValue="2 min 30s" />
        </div>

        <div className={styles.sectionTitle}>Tempo &middot; Cadência</div>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Tempo</label>
            <input type="text" className={styles.fieldInput} defaultValue="3-1-1-0" />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Ordem</label>
            <input type="number" className={styles.fieldInput} defaultValue="1" />
          </div>
        </div>

        <div className={styles.sectionTitle}>Notas Técnicas</div>
        <div className={styles.field}>
          <textarea
            className={styles.fieldInput}
            rows={3}
            style={{ resize: 'vertical' }}
            defaultValue="Foco no controlo excêntrico. Escápulas retraídas durante toda a execução."
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
