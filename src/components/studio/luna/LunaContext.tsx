import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LunaWorkout } from './types';

interface LunaState {
  currentWorkout: LunaWorkout | null;
  selectedElement: string | null; // ID of the selected element
  studioMode: 'edit' | 'preview';
}

interface LunaContextType extends LunaState {
  setCurrentWorkout: (workout: LunaWorkout | null) => void;
  setSelectedElement: (id: string | null) => void;
  setStudioMode: (mode: 'edit' | 'preview') => void;
}

const LunaContext = createContext<LunaContextType | undefined>(undefined);

export const LunaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentWorkout, setCurrentWorkout] = useState<LunaWorkout | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [studioMode, setStudioMode] = useState<'edit' | 'preview'>('edit');

  return (
    <LunaContext.Provider
      value={{
        currentWorkout,
        setCurrentWorkout,
        selectedElement,
        setSelectedElement,
        studioMode,
        setStudioMode,
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
