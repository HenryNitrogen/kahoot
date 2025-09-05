'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, detectLanguage, detectLanguageByIP, setLanguage as saveLanguage, getTranslation } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    async function initLanguage() {
      try {
        // 首先检查本地存储
        const savedLang = localStorage.getItem('language') as Language;
        if (savedLang && ['en', 'zh'].includes(savedLang)) {
          setLanguageState(savedLang);
          return;
        }

        // 使用IP地理位置检测
        const detectedLang = await detectLanguageByIP();
        setLanguageState(detectedLang);
      } catch (error) {
        console.warn('Language detection failed, using fallback');
        const fallbackLang = detectLanguage();
        setLanguageState(fallbackLang);
      }
    }

    initLanguage();
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    saveLanguage(lang);
  };

  const t = (key: string) => getTranslation(language, key);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
