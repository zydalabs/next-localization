import React from 'react';
import { curry } from 'ramda';
import { NextPageContext } from 'next';
import { AppContext } from 'next/app';

import { WithNextLocalization, WrapperPageProps } from './types';
import { buildPageTranslateFunction } from './helpers';

/**
* @param settings
* @param settings.customTranslations Tries to perform custom translation with
*                                                           values that match `isMatch` function.
* @param buildDictionary takes language and used sources and returns a promise of mapping object.
* @param getLanguage takes the context and the initial props of the given
*                                  page and returns a the language as a string.
* @param usedSources the sources that are used to translate the given page.
* @param page the page that is wrapped by this HOC in order to enable translation.
*
* @returns new page wraps old page and passes to it `t` function and `lang` string as props.
*/
const HOC: WithNextLocalization<Function & { getInitialProps?: Function }> = (
  { customTranslations = []},
  buildDictionary,
  getLanguage,
  usedSources,
  page,
) => {
  // Clone old page into a new functional component
  const OldPage = page.bind({});

  const NewPage: typeof page = ({ dictionary, language, ...otherProps }: WrapperPageProps) => {
    const translate = buildPageTranslateFunction(dictionary, language, customTranslations);
    return (<OldPage t={translate} lang={language} {...otherProps} />);
  };

  NewPage.getInitialProps = async (context: NextPageContext | AppContext) => {
    let oldProps: any;
    if (page.getInitialProps !== undefined) {
      oldProps = await page.getInitialProps(context);
      delete OldPage.getInitialProps; // .getInitialProps cannot be attached to a component inside the page/app
    }

    // Handle the case when wrapping the app
    const pageContext = 'ctx' in context ? context.ctx : context;

    const language = getLanguage(pageContext, oldProps);
    const dictionary = await buildDictionary(language, usedSources);

    return { dictionary, language, ...oldProps };
  };

  return NewPage;
}

/**
 * Higher order component that accepts a page and returns a new page with the translation props.
 *
 * This allows the original page to have the props of `{ t, lang }` where `t` is the translation function
 * and `lang` is the specified language as returned by the `getLanguage` function.
 */
const withNextLocalization = curry(HOC);

export default withNextLocalization;
