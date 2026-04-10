import React from 'react';
import {
  Activity,
  Clock,
  TrendingUp,
  Plus,
  GripVertical,
  Settings,
  Trash2,
  ListRestart
} from 'lucide-react';
import styles from './luna.module.css';
import { MOCK_WORKSPACE, LunaBlock } from './types';

interface LunaWorkspaceProps {
  onConfigClick: (exId: string) => void;
}

export const LunaWorkspace: React.FC<LunaWorkspaceProps> = ({ onConfigClick }) => {
  const { title, description, blocks } = MOCK_WORKSPACE;

  const renderBlockIcon = (type: LunaBlock['type']) => {
    switch(type) {
      case 'warmup': return <Activity size={15} />;
      case 'main': return <TrendingUp size={15} />;
      case 'finisher': return <ListRestart size={15} />;
    }
  };

  return (
    <main className={styles.workspace}>
      {/* Workout Header */}
      <div className={`${styles.wkHeader} ${styles.glassStrong}`}>
        <input
          type="text"
          className={styles.wkTitleInput}
          defaultValue={title}
          placeholder="Nome do treino..."
        />
        <input
          type="text"
          className={styles.wkDescInput}
          defaultValue={description}
          placeholder="Descrição..."
        />
        <div className={styles.wkMeta}>
          <div className={`${styles.metaPill} ${styles.gold}`}>
            <Activity size={11} />
            Força
          </div>
          <div className={`${styles.metaPill} ${styles.teal}`}>
            <Clock size={11} />
            60 min
          </div>
          <div className={styles.metaPill}>
            <TrendingUp size={11} />
            Avançado
          </div>
          <div className={styles.metaPill}>
            <Plus size={11} />
            Adicionar tag
          </div>
        </div>
      </div>

      {/* Blocks */}
      {blocks.map(block => (
        <div key={block.id} className={`${styles.block} ${styles.glassStrong}`}>
          <div className={styles.blockHeader}>
            <div className={styles.blockHandle}>
              <GripVertical size={12} />
            </div>
            <div className={`${styles.blockIcon} ${styles[block.type]}`}>
              {renderBlockIcon(block.type)}
            </div>
            <div className={styles.blockInfo}>
              <div className={styles.blockName}>{block.name}</div>
              <div className={styles.blockMeta}>{block.meta}</div>
            </div>
            <div className={styles.blockActions}>
              <button className={styles.blockActionBtn} title="Configurar">
                <Settings size={12} />
              </button>
              <button className={styles.blockActionBtn} title="Apagar">
                <Trash2 size={12} />
              </button>
            </div>
          </div>

          <div className={styles.exList}>
            {block.exercises.map((ex, idx) => (
              <div key={ex.id} className={styles.exItem}>
                <div className={styles.exHandle}>
                  <GripVertical size={10} />
                </div>
                <div className={styles.exNum}>{idx + 1}</div>
                <div className={styles.exInfo}>
                  <div className={styles.exName}>{ex.name}</div>
                  <div className={styles.exParams}>
                    <b>{ex.config.sets}</b> {ex.config.sets > 1 ? 'séries' : 'série'} <span>&middot;</span> <b>{ex.config.reps}</b> {ex.config.reps !== 'rondas' ? 'reps' : ''}
                    {ex.config.weight && (
                      <>
                        <span>&middot;</span> <b>{ex.config.weight}</b>
                      </>
                    )}
                    {ex.config.rpe && (
                      <>
                        <span>&middot;</span> RPE <b>{ex.config.rpe}</b>
                      </>
                    )}
                    {ex.config.rest && (
                      <>
                        <span>&middot;</span> <b>{ex.config.rest}</b>
                      </>
                    )}
                  </div>
                </div>
                <button
                  className={styles.exConfigBtn}
                  onClick={() => onConfigClick(ex.id)}
                >
                  Config
                </button>
              </div>
            ))}
            <button className={styles.addExBtn}>
              <Plus size={12} />
              Adicionar exercício
            </button>
          </div>
        </div>
      ))}

      <button className={styles.addBlockBtn}>
        <Plus size={14} />
        Adicionar Bloco
      </button>

    </main>
  );
};
