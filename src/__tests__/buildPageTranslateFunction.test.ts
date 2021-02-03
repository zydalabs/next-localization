import { isNil } from 'ramda';

import { buildPageTranslateFunction } from '../helpers';

const dictionary = {
  ar:{
    "title": "عنوان المتجر",
    "subTitle": "عنوان المتجر الفرعي",
    "price":"السعر: @{amount}",
    "storeNotFound": {
      "title": "المتجر غير موجود",
      "subTitle": "المتجر الذي تبحث عنه غير موجود",
      "errors": {
        "one": "خطأ ١"
      }
    }
  },
  en: {
    "title": "Store Title",
    "subTitle": "Store SubTitle",
    "price":"price: @{amount}",
    "storeNotFound": {
      "title": "Store not found",
      "subTitle": "The store your are looking for not found",
      "errors": {
        "one": "error 1"
      }
    }
  }
};

type LocalizeCurrency = (lang: string, value: {amount: number, currency: string}) => string;
export const localizeCurrency: LocalizeCurrency = (lang, { amount, currency }) => {
  let locale;
  if (lang === 'ar') {
    locale = 'ar-EG';
  } else {
    locale = 'en-US';
  }

  return Number(amount).toLocaleString(locale, { style: 'currency', currency });
};

describe('Translate function', () => {
  it('should return the value that match the key', () => {
    let language = 'en';
    let t = buildPageTranslateFunction(dictionary[language], language, []);
    expect(t('title')).toMatch(dictionary.en.title);
    language = 'ar';
    t = buildPageTranslateFunction(dictionary[language], language, []);
    expect(t('subTitle')).toMatch(dictionary.ar.subTitle);
  });

  it('should return the value even in nested objects', () => {
    let language = 'en';
    let t = buildPageTranslateFunction(dictionary[language], language, []);
    expect(t('storeNotFound.title')).toMatch(dictionary.en.storeNotFound.title);
    expect(t('storeNotFound.errors.one')).toMatch(dictionary.en.storeNotFound.errors.one);
  });

  it('should return the value after applying the custom translation functions if needed', () => {
    let language = 'en';
    let t = buildPageTranslateFunction(
      dictionary[language],
      language, 
      [{ isMatch: v => typeof v === 'object' && !isNil(v.amount) && !isNil(v.currency), translate: localizeCurrency }]
    );
    expect(t('price', { amount: t({amount: '123', currency: 'EGP'})})).toMatch("price: EGP 123.00");
  });
}) 