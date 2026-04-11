import { arrayMove } from '@dnd-kit/sortable';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { LunaForm } from './formsTypes';
import { fetcher, createLunaForm, updateLunaForm, deleteLunaForm } from './lunaFormsApi';

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
  reorderFields: (activeId: number | string, overId: number | string) => void;
  previewFormId: number | null;
  setPreviewFormId: (id: number | null) => void;
  isLoading: boolean;
  error: any;
  saveForm: (formId: number) => Promise<void>;
  deleteFormContext: (formId: number) => Promise<void>;
  createNewForm: () => Promise<void>;
}

const LunaFormsContext = createContext<LunaFormsContextType | undefined>(undefined);

export const LunaFormsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: apiForms, error, isLoading } = useSWR<LunaForm[]>('/api/forms', fetcher);

  const [forms, setForms] = useState<LunaForm[]>([]);
  const [currentFormId, setCurrentFormId] = useState<number | null>(null);
  const [selectedFieldId, setSelectedFieldId] = useState<number | null>(null);

  const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState(false);
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);
  const [previewFormId, setPreviewFormId] = useState<number | null>(null);

  useEffect(() => {
    if (apiForms) {
      setForms(apiForms);
      if (apiForms.length > 0 && currentFormId === null) {
          setCurrentFormId(apiForms[0].id);
      }
    }
  }, [apiForms]);


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

  const reorderFields = (activeId: number | string, overId: number | string) => {
    if (activeId !== overId && currentFormId !== null) {
      setForms((prevForms) => {
        return prevForms.map((form) => {
          if (form.id === currentFormId) {
            const oldIndex = form.fields.findIndex((f) => f.id === activeId);
            const newIndex = form.fields.findIndex((f) => f.id === overId);
            return {
              ...form,
              fields: arrayMove(form.fields, oldIndex, newIndex),
            };
          }
          return form;
        });
      });
    }
  };

  const saveForm = async (formId: number) => {
    const formToSave = forms.find(f => f.id === formId);
    if (!formToSave) return;
    try {
      // Check if it's a new unsaved form locally (e.g., negative ID or whatever logic you prefer)
      // Since our new forms might not exist on the backend yet, we can use create or update
      // For simplicity, assuming if it doesn't exist on backend it will fail PUT, but we use updateLunaForm.
      // If it's a completely new form, we could handle it via createNewForm.
      await updateLunaForm(formId, formToSave);
      await mutate('/api/forms');
    } catch (e) {
      console.error("Error saving form", e);
      throw e;
    }
  };

  const deleteFormContext = async (formId: number) => {
    try {
      await deleteLunaForm(formId);
      const newForms = forms.filter(f => f.id !== formId);
      setForms(newForms);
      if (currentFormId === formId) {
          setCurrentFormId(newForms[0]?.id || null);
      }
      await mutate('/api/forms');
    } catch (e) {
      console.error("Error deleting form", e);
      throw e;
    }
  };

  const createNewForm = async () => {
    const newFormBase = {
      title: 'Novo formulário',
      description: '',
      fields: [],
      logicRules: [],
      submissions: [],
      published: false,
      isTemplate: false
    };
    try {
      const createdForm = await createLunaForm(newFormBase);
      setForms(prev => [...prev, createdForm]);
      setCurrentFormId(createdForm.id);
      await mutate('/api/forms');
    } catch (e) {
       console.error("Error creating form", e);
       throw e;
    }
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
      closeDrawers,
      reorderFields,
      previewFormId,
      setPreviewFormId,
      isLoading,
      error,
      saveForm,
      deleteFormContext,
      createNewForm
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
