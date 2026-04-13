import React from 'react';
import { Clock, GripVertical, Settings, Trash2 } from 'lucide-react';
import styles from './luna.module.css';
import { useLunaStore } from './LunaContext';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { LunaClassSegment } from './types';

const SortableClassSegment: React.FC<{ segment: LunaClassSegment; idx: number }> = ({ segment, idx }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: segment.instanceId,
    data: {
      type: 'ClassSegment',
      segment,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.block} ${styles.glassStrong} ${isDragging ? styles.isDragging : ''}`}
    >
      <div className={styles.blockHeader}>
        <div className={styles.blockHandle} {...attributes} {...listeners}>
          <GripVertical size={12} />
        </div>
        <div className={`${styles.blockIcon} ${styles[segment.color]}`}>
          <Clock size={15} />
        </div>
        <div className={styles.blockInfo}>
          <div className={styles.blockName}>{segment.name}</div>
          <div className={styles.blockMeta}>{segment.duration} min &middot; {segment.type}</div>
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
    </div>
  );
};

export const LunaClassesCanvas: React.FC = () => {
  const { currentClass } = useLunaStore();

  const { setNodeRef, isOver } = useDroppable({
    id: 'classes-canvas',
    data: {
      type: 'ClassesCanvas',
    },
  });

  if (!currentClass) return null;

  const totalTime = currentClass.segments.reduce((acc, seg) => acc + seg.duration, 0);

  return (
    <main className={styles.workspace}>
      <div className={`${styles.wkHeader} ${styles.glassStrong}`}>
        <input
          type="text"
          className={styles.wkTitleInput}
          defaultValue={currentClass.title}
          placeholder="Nome da Aula..."
        />
        <input
          type="text"
          className={styles.wkDescInput}
          defaultValue={currentClass.description}
          placeholder="Descrição..."
        />
        <div className={styles.wkMeta}>
          <div className={`${styles.metaPill} ${styles.teal}`}>
            <Clock size={11} />
            {totalTime} min
          </div>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`${styles.planGrid} ${isOver ? styles.droppableActive : ''}`}
        style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        {currentClass.segments.length === 0 && (
          <div style={{ color: 'var(--muted-hi)', textAlign: 'center', padding: '2rem' }}>
            Arraste segmentos de aula da biblioteca para começar
          </div>
        )}

        <SortableContext
          items={currentClass.segments.map(s => s.instanceId)}
          strategy={verticalListSortingStrategy}
        >
          {currentClass.segments.map((seg, idx) => (
            <SortableClassSegment key={seg.instanceId} segment={seg} idx={idx} />
          ))}
        </SortableContext>
      </div>
    </main>
  );
};
