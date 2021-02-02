import { isNil, replace } from 'ramda';

import { BuildPageTranslateFunction } from './types';

export const buildPageTranslateFunction: BuildPageTranslateFunction =
  (dictionary, language, customTranslations) => (value: string, params: any = {}): string => {
    // Check if value matches a custom translator
    const customTranslationInfo = customTranslations.find(({ isMatch }) => isMatch(value));
    if (customTranslationInfo != null) {
      return customTranslationInfo.translate(language, value);
    }

    // Assume the matched value is a template, and try to substitute its params
    const template: string = value.split('.').reduce<any>((dict, key) => dict[key], dictionary);

    if (isNil(template)) {
      throw new Error(`Value [${value}] was not found in dictionary or in custom translations`);
    }

    // Extract template params
    const parameterRegex = /@\{([\w\d-]+)\}/g;
    const templateParameters: string[] = template.match(parameterRegex)?.map(replace(/[{}@]/g, '')) ?? [];

    const receivedParameters = Object.keys(params);

    // Check that all the required template parameters are sent with the template
    templateParameters.forEach(templateParameter => {
      if (!receivedParameters.includes(templateParameter)) {
        throw new Error(`Parameter [${templateParameter}] was not found when attempting to translate [${value}]`);
      }
    });

    // Substitute all the params (if any) in the given template
    const finalValue = templateParameters.reduce(
      (sentence, paramName) => sentence.replace(RegExp(`@{${paramName}}`, 'g'), params[paramName]),
      template,
    );

    return finalValue;
  };
