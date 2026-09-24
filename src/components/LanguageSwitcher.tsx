import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-full border border-slate-200 dark:border-slate-700/80 text-xs font-semibold select-none">
      <button
        type="button"
        onClick={() => setLanguage('fr')}
        className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
          language === 'fr'
            ? 'bg-[#031632] text-[#C5A059] shadow-sm font-bold'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
        title="Passer en Français"
      >
        <span>🇫🇷</span>
        <span>FR</span>
      </button>

      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
          language === 'en'
            ? 'bg-[#031632] text-[#C5A059] shadow-sm font-bold'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
        title="Switch to English"
      >
        <span>🇬🇧</span>
        <span>EN</span>
      </button>
    </div>
  );
};
