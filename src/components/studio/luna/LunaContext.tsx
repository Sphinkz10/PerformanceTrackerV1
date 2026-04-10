import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LunaWorkout, LunaWorkspaceExercise, LunaLibraryItem, MOCK_WORKSPACE, LunaPlan, LunaLibraryWorkout, MOCK_PLAN } from './types';

export type LunaModule = 'Treinos' | 'Planos' | 'Aulas';

interface LunaState {
  activeModule: LunaModule;
  currentPlan: LunaPlan | null;
  currentWorkout: LunaWorkout | null;
  selectedElement: string | null; // ID of the selected element
  studioMode: 'edit' | 'preview';
}

interface LunaContextType extends LunaState {
  setCurrentWorkout: (workout: LunaWorkout | null) => void;
  setSelectedElement: (id: string | null) => void;
  setStudioMode: (mode: 'edit' | 'preview') => void;
  setActiveModule: (module: LunaModule) => void;
  setCurrentPlan: (plan: LunaPlan | null) => void;

  // Plan DND Actions
  addWorkoutToDay: (workout: LunaLibraryWorkout, targetDayId: string) => void;
  reorderWorkoutsInDay: (dayId: string, oldIndex: number, newIndex: number) => void;
  moveWorkoutBetweenDays: (sourceDayId: string, targetDayId: string, oldIndex: number, newIndex: number) => void;

  // DND Actions
  addExerciseToBlock: (exercise: LunaLibraryItem, targetBlockId: string) => void;
  reorderExercises: (blockId: string, oldIndex: number, newIndex: number) => void;
  moveExerciseBetweenBlocks: (sourceBlockId: string, targetBlockId: string, oldIndex: number, newIndex: number) => void;
  updateExerciseConfig,
      addWorkoutToDay,
      reorderWorkoutsInDay,
      moveWorkoutBetweenDays: (blockId: string, exerciseInstanceId: string, updates: Partial<LunaExerciseConfig>) => void;
}

const LunaContext = createContext<LunaContextType | undefined>(undefined);

export const LunaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentWorkout, setCurrentWorkout] = useState<LunaWorkout | null>(MOCK_WORKSPACE);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [activeModule,
      currentPlan,
      studioMode, setStudioMode] = useState<'edit' | 'preview'>('edit');
  const [activeModule, setActiveModule] = useState<LunaModule>('Treinos');
  const [currentPlan, setCurrentPlan] = useState<LunaPlan | null>(MOCK_PLAN);

  const addExerciseToBlock = (exercise: LunaLibraryItem, targetBlockId: string) => {
    setCurrentWorkout(prev => {
      if (!prev) return prev;

      const newExercise: LunaWorkspaceExercise = {
        id: `ex-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        libraryId: exercise.id,
        name: exercise.name,
        config: { sets: 3, reps: '10' } // default config
      };

      return {
        ...prev,
        blocks: prev.blocks.map(block =>
          block.id === targetBlockId
            ? { ...block, exercises: [...block.exercises, newExercise] }
            : block
        )
      };
    });
  };

  const reorderExercises = (blockId: string, oldIndex: number, newIndex: number) => {
    setCurrentWorkout(prev => {
      if (!prev) return prev;

      return {
        ...prev,
        blocks: prev.blocks.map(block => {
          if (block.id !== blockId) return block;

          const newExercises = Array.from(block.exercises);
          const [movedItem] = newExercises.splice(oldIndex, 1);
          newExercises.splice(newIndex, 0, movedItem);

          return { ...block, exercises: newExercises };
        })
      };
    });
  };



  const addWorkoutToDay = (workout: LunaLibraryWorkout, targetDayId: string) => {
    setCurrentPlan(prev => {
      if (!prev) return prev;
      const newPlan = { ...prev, weeks: [...prev.weeks] };
      for (const week of newPlan.weeks) {
        const dayIndex = week.days.findIndex(d => d.id === targetDayId);
        if (dayIndex !== -1) {
          const newDays = [...week.days];
          newDays[dayIndex] = {
            ...newDays[dayIndex],
            workouts: [
              ...newDays[dayIndex].workouts,
              { instanceId: `pw-${Date.now()}`, workoutId: workout.id, name: workout.name }
            ]
          };
          week.days = newDays;
          break;
        }
      }
      return newPlan;
    });
  };

  const reorderWorkoutsInDay = (dayId: string, oldIndex: number, newIndex: number) => {
    setCurrentPlan(prev => {
      if (!prev) return prev;
      const newPlan = { ...prev, weeks: [...prev.weeks] };
      for (const week of newPlan.weeks) {
        const dayIndex = week.days.findIndex(d => d.id === dayId);
        if (dayIndex !== -1) {
          const newDays = [...week.days];
          const workouts = [...newDays[dayIndex].workouts];
          const [movedItem] = workouts.splice(oldIndex, 1);
          workouts.splice(newIndex, 0, movedItem);
          newDays[dayIndex] = { ...newDays[dayIndex], workouts };
          week.days = newDays;
          break;
        }
      }
      return newPlan;
    });
  };

  const moveWorkoutBetweenDays = (sourceDayId: string, targetDayId: string, oldIndex: number, newIndex: number) => {
    setCurrentPlan(prev => {
      if (!prev) return prev;
      const newPlan = { ...prev, weeks: [...prev.weeks] };

      let sourceDay: any, targetDay: any, sourceWeekIndex = -1, targetWeekIndex = -1, sourceDayIndex = -1, targetDayIndex = -1;

      newPlan.weeks.forEach((w, wi) => {
        const sdi = w.days.findIndex(d => d.id === sourceDayId);
        if (sdi !== -1) { sourceWeekIndex = wi; sourceDayIndex = sdi; sourceDay = { ...w.days[sdi], workouts: [...w.days[sdi].workouts] }; }

        const tdi = w.days.findIndex(d => d.id === targetDayId);
        if (tdi !== -1) { targetWeekIndex = wi; targetDayIndex = tdi; targetDay = { ...w.days[tdi], workouts: [...w.days[tdi].workouts] }; }
      });

      if (sourceDay && targetDay) {
        const [movedItem] = sourceDay.workouts.splice(oldIndex, 1);
        targetDay.workouts.splice(newIndex, 0, movedItem);

        newPlan.weeks[sourceWeekIndex].days[sourceDayIndex] = sourceDay;
        newPlan.weeks[targetWeekIndex].days[targetDayIndex] = targetDay;
      }
      return newPlan;
    });
  };

  const updateExerciseConfig = (blockId: string, exerciseInstanceId: string, updates: Partial<LunaExerciseConfig>) => {
    setCurrentWorkout(prev => {
      if (!prev) return prev;

      return {
        ...prev,
        blocks: prev.blocks.map(block => {
          if (block.id !== blockId) return block;

          return {
            ...block,
            exercises: block.exercises.map(ex => {
              if (ex.id !== exerciseInstanceId) return ex;
              return {
                ...ex,
                config: { ...ex.config, ...updates }
              };
            })
          };
        })
      };
    });
  };

  const moveExerciseBetweenBlocks = (sourceBlockId: string, targetBlockId: string, oldIndex: number, newIndex: number) => {
    setCurrentWorkout(prev => {
      if (!prev) return prev;

      let movedItem: LunaWorkspaceExercise | null = null;

      // Remove from source
      const withRemoved = prev.blocks.map(block => {
        if (block.id === sourceBlockId) {
          const newExercises = Array.from(block.exercises);
          movedItem = newExercises.splice(oldIndex, 1)[0];
          return { ...block, exercises: newExercises };
        }
        return block;
      });

      if (!movedItem) return prev;

      // Add to target
      return {
        ...prev,
        blocks: withRemoved.map(block => {
          if (block.id === targetBlockId) {
            const newExercises = Array.from(block.exercises);
            newExercises.splice(newIndex, 0, movedItem as LunaWorkspaceExercise);
            return { ...block, exercises: newExercises };
          }
          return block;
        })
      };
    });
  };

  return (
    <LunaContext.Provider
      value={{
        currentWorkout,
        setCurrentWorkout,
        selectedElement,
        setSelectedElement,
        studioMode,
        setActiveModule,
      setCurrentPlan,
      setStudioMode,
        addExerciseToBlock,
        reorderExercises,
        moveExerciseBetweenBlocks,
        updateExerciseConfig,
      }}
    >
      {children}
    </LunaContext.Provider>
  );
};

export const useLunaStore = (): LunaContextType => {
  const context = useContext(LunaContext);
  if (context === undefined) {
    throw new Error('useLunaStore must be used within a LunaProvider');
  }
  return context;
};
