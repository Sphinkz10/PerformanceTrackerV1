import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import pt from '../locales/pt.json';
import en from '../locales/en.json';
import es from '../locales/es.json';
import fr from '../locales/fr.json';

type Language = 'pt' | 'en' | 'es' | 'fr';

const translations = {
  pt,
  en,
  es,
  fr,
};

type I18nContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('pt');

  // Load language from localStorage if available
  useEffect(() => {
    const savedLang = localStorage.getItem('i18n_lang') as Language;
    if (savedLang && translations[savedLang]) {
      setLanguage(savedLang);
    }
  }, []);

  // Save language to localStorage when changed
  useEffect(() => {
    localStorage.setItem('i18n_lang', language);
  }, [language]);

  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to key if translation not found
        console.warn(`Translation missing for key: ${key} in ${language}`);
        return key;
      }
    }

    if (typeof value === 'string') {
      if (params) {
        let interpolated = value;
        for (const [k, v] of Object.entries(params)) {
          interpolated = interpolated.replace(`{${k}}`, v);
        }
        return interpolated;
      }
      return value;
    }

    return key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}
