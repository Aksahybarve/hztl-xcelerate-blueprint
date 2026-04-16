// Global
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';

const useDictionary = () => {
  const t = useTranslations();

  const getDictionaryValue = useCallback(
    (key: string, fallback?: string) => {
      try {
        return t(key) ?? fallback;
      } catch {
        return fallback ?? key;
      }
    },
    [t]
  );

  return {
    getDictionaryValue,
  };
};

export default useDictionary;
