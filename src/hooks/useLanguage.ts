import { useAppStore } from '@/store/useAppStore';
import { translations, TranslationKey } from '@/i18n/translations';

export const useLanguage = () => {
  const { language, setLanguage } = useAppStore();

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  return {
    language,
    setLanguage,
    toggleLanguage,
    t,
  };
};
