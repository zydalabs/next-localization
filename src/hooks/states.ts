import { useGlobalState } from "@zyda/swr-internal-state";

export const useDictionary = () => useGlobalState<Record<string, string>>('@zyda/next-localization:current-dictionary', {});
export const useLanguage = () => useGlobalState<string>('@zyda/next-localization:current-language');