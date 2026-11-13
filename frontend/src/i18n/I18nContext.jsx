import { createContext, useContext, useMemo, useState } from 'react';
import { translations } from './translations';

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [language, setLanguageState] = useState(() => (
    localStorage.getItem('language') === 'en' ? 'en' : 'fr'
  ));

  const setLanguage = (next) => {
    const value = next === 'en' ? 'en' : 'fr';
    localStorage.setItem('language', value);
    setLanguageState(value);
  };

  const value = useMemo(() => {
    const t = (key, vars) => {
      let text = translations[language][key] || translations.fr[key] || key;
      if (vars) {
        Object.entries(vars).forEach(([name, replacement]) => {
          text = text.replaceAll(`{${name}}`, String(replacement));
        });
      }
      return text;
    };
    return { language, setLanguage, t, locale: language === 'en' ? 'en-GB' : 'fr-FR' };
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
