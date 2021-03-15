import { buildPageTranslateFunction } from "../helpers";
import { CustomTranslation } from "../types";
import { useDictionary, useLanguage } from "./states"

export const useLocalization = (customTranslations: CustomTranslation[] = []) => {
  const [dictionary] = useDictionary();
  const [language] = useLanguage();

  const t = buildPageTranslateFunction(dictionary!, language!, customTranslations);

  return { t, language };
}
