import { NextPageContext, NextPage } from 'next';

export type CustomTranslationIsMatch = (value: any) => boolean;
export type CustomTranslationTranslate = (lang: string, value: any) => string;

export type Translate = (value: any, params?: {[key: string]: string}) => string;

export interface CustomTranslation {
  isMatch: CustomTranslationIsMatch,
  translate: CustomTranslationTranslate
}

export interface Settings {
  customTranslations: CustomTranslation[]
}

export type BuildDictionary =
  (language: string, usedSources: string[]) => Promise<{[key: string]: string}>;

export type GetLanguage =
(context: NextPageContext, oldProps: any) => string;

export type UsedSources = string[];

export interface WithNextLocalizationParams {
  settings: Settings,
  buildDictionary: BuildDictionary, 
  getLanguage: GetLanguage,
  usedSources: UsedSources, 
  page: NextPage
}

export type WithNextLocalization<T> = (
  settings: Settings,
  buildDictionary: BuildDictionary, 
  getLanguage: GetLanguage,
  usedSources: UsedSources, 
  page: T
) => T;

export type Dictionary = { [key: string]: string };

export interface WrapperPageProps {
  dictionary: Dictionary,
  language: string,
}

export type BuildPageTranslateFunction = (
  dictionary: Dictionary,
  language: string,
  customTranslations: CustomTranslation[]
) => Translate;
