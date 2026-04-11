import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LunaForm } from './formsTypes';

interface LunaFormsContextType {
  forms: LunaForm[];
  setForms: React.Dispatch<React.SetStateAction<LunaForm[]>>;
  currentFormId: number | null;
  setCurrentFormId: (id: number | null) => void;
  selectedFieldId: number | null;
  setSelectedFieldId: (id: number | null) => void;
  isLeftDrawerOpen: boolean;
  setIsLeftDrawerOpen: (isOpen: boolean) => void;
  isRightDrawerOpen: boolean;
  setIsRightDrawerOpen: (isOpen: boolean) => void;
  toggleLeftDrawer: () => void;
  toggleRightDrawer: () => void;
  closeDrawers: () => void;
}

const initialForms: LunaForm[] = [
  {
    id: 1,
    title: 'Avaliação Inicial',
    description: 'Exemplo',
    fields: [
      { id: 1, type: 'text', label: 'Nome', placeholder: '', required: true }
    ],
    logicRules: [],
    submissions: [],
    published: false,
    isTemplate: false
  }
];

const LunaFormsContext = createContext<LunaFormsContextType | undefined>(undefined);

export const LunaFormsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [forms, setForms] = useState<LunaForm[]>(initialForms);
  const [currentFormId, setCurrentFormId] = useState<number | null>(1);
  const [selectedFieldId, setSelectedFieldId] = useState<number | null>(null);

  const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState(false);
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);

  const toggleLeftDrawer = () => {
    setIsRightDrawerOpen(false);
    setIsLeftDrawerOpen(prev => !prev);
  };

  const toggleRightDrawer = () => {
    setIsLeftDrawerOpen(false);
    setIsRightDrawerOpen(prev => !prev);
  };

  const closeDrawers = () => {
    setIsLeftDrawerOpen(false);
    setIsRightDrawerOpen(false);
  };

  return (
    <LunaFormsContext.Provider value={{
      forms,
      setForms,
      currentFormId,
      setCurrentFormId,
      selectedFieldId,
      setSelectedFieldId,
      isLeftDrawerOpen,
      setIsLeftDrawerOpen,
      isRightDrawerOpen,
      setIsRightDrawerOpen,
      toggleLeftDrawer,
      toggleRightDrawer,
      closeDrawers
    }}>
      {children}
    </LunaFormsContext.Provider>
  );
};

export const useLunaForms = () => {
  const context = useContext(LunaFormsContext);
  if (context === undefined) {
    throw new Error('useLunaForms must be used within a LunaFormsProvider');
  }
  return context;
};
