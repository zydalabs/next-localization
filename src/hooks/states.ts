import { useGlobalState } from '@zyda/swr-internal-state';
import { Translate } from '../types';

export const useLanguage = () => useGlobalState<string>('@zyda/next-localization:current-language');
export const useTranslate = () => useGlobalState<Translate>('@zyda/next-localization:current-t-function');
