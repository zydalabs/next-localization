import { Translate } from '../types';
import { useLanguage, useTranslate } from './states';

export const useLocalization = (): { t: Translate, lang: string } => {
  const [translate] = useTranslate();
  const [language] = useLanguage();

  return { t: translate!, lang: language! };
}
