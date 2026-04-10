import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Clock, Target } from 'lucide-react';
import { useLuna } from './LunaContext';
import styles from './luna.module.css';

// Sortable item for a workout inside a day
const SortableWorkout = ({ workout, id }: { workout: any, id: string }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id,
    data: { type: 'plan-workout', workout }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={styles.planWorkoutItem}
    >
      <div {...attributes} {...listeners} className={styles.dragHandle}>
        <GripVertical size={16} />
      </div>
      <div className={styles.planWorkoutInfo}>
        <h4>{workout.name}</h4>
      </div>
    </div>
  );
};

// Droppable area for a single day
const DayBlock = ({ day }: { day: any }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: day.id,
    data: { type: 'plan-day', day }
  });

  return (
    <div className={styles.planDayBlock}>
      <h3 className={styles.planDayHeader}>{day.name}</h3>
      <div
        ref={setNodeRef}
        className={`${styles.planDayDropzone} ${isOver ? styles.dragOver : ''}`}
      >
        <SortableContext items={day.workouts.map((w: any) => w.instanceId)} strategy={verticalListSortingStrategy}>
          {day.workouts.length === 0 ? (
            <div className={styles.emptyDayPlaceholder}>
              Arraste treinos para aqui
            </div>
          ) : (
            day.workouts.map((workout: any) => (
              <SortableWorkout key={workout.instanceId} id={workout.instanceId} workout={workout} />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
};

export const LunaPlansCanvas: React.FC = () => {
  const { currentPlan } = useLuna();

  if (!currentPlan) return null;

  return (
    <div className={styles.plansCanvas}>
      <div className={styles.plansHeader}>
        <h2>{currentPlan.name}</h2>
        <div className={styles.plansMeta}>
          <span className={styles.planMetaItem}><Clock size={16} /> {currentPlan.durationWeeks} Semanas</span>
          <span className={styles.planMetaItem}><Target size={16} /> Hipertrofia</span>
        </div>
      </div>

      <div className={styles.plansTimeline}>
        {currentPlan.weeks.map(week => (
          <div key={week.id} className={styles.planWeek}>
            <h3 className={styles.planWeekHeader}>Semana {week.weekNumber}</h3>
            <div className={styles.planWeekGrid}>
              {week.days.map(day => (
                <DayBlock key={day.id} day={day} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
