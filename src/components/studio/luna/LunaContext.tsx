import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LunaWorkout, LunaWorkspaceExercise, LunaLibraryItem, MOCK_WORKSPACE } from './types';

interface LunaState {
  currentWorkout: LunaWorkout | null;
  selectedElement: string | null; // ID of the selected element
  studioMode: 'edit' | 'preview';
}

interface LunaContextType extends LunaState {
  setCurrentWorkout: (workout: LunaWorkout | null) => void;
  setSelectedElement: (id: string | null) => void;
  setStudioMode: (mode: 'edit' | 'preview') => void;

  // DND Actions
  addExerciseToBlock: (exercise: LunaLibraryItem, targetBlockId: string) => void;
  reorderExercises: (blockId: string, oldIndex: number, newIndex: number) => void;
  moveExerciseBetweenBlocks: (sourceBlockId: string, targetBlockId: string, oldIndex: number, newIndex: number) => void;
}

const LunaContext = createContext<LunaContextType | undefined>(undefined);

export const LunaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentWorkout, setCurrentWorkout] = useState<LunaWorkout | null>(MOCK_WORKSPACE);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [studioMode, setStudioMode] = useState<'edit' | 'preview'>('edit');

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
        setStudioMode,
        addExerciseToBlock,
        reorderExercises,
        moveExerciseBetweenBlocks,
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
