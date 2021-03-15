# Next Localization
This package exposes a higher order component that wraps [Next](https://nextjs.org)'s app or pages, to provide translation function to them along side with the current app language.

This package is optimized to work with serverless next build (on vercel or netlify or lambda function or whatever platform). Other alternatives such as i18n would be more optimized for usage with server-based next application, but we found they do not work properly with serverless build.

## API
This package `withNextLocalization` (explained below) higher order component as a default export. It also exports `useLocalization` hook as a named export.

### withNextLocalization
As stated above, the localization is done through a Higher Order Component (HOC) that wraps the entire Next page and provides it with a translation function as a prop. That HOC accepts 5 parameters and they are as follows:
1. `settings` object.
1. `buildDictionary` Function.
1. `getLanguage` Function.
1. `usedSources` Array of strings.
1. `page`: Next.js page that needs to be localized.

Explaining these parameters makes more sense if they are explained from the last to the first:
`Page`: This is just the page that needs to be localized. The result of the localization HOC is another Next.js page that wraps this page, and does no changes to its rendering, only provides 2 props to the original page: `t` function that is used for translation, and `lang` string that indicates the used language.

`usedSources`: Each page may require a different set of strings to be used in the localization of that page, theses sources are listed in this array, and are passed to `buildDictionary` function that is described later on. This parameter is used to limit the amount of fetched resources and also to reduce the resulting dictionary so that each page does not contain a lot of useless strings.

`getLanguage`: This is a function that accepts `PageContext` or `AppContext` as localization can be used to wrap the whole Next app, and also accepts an object that contains all props that were initially returned by the page's `getInitialProps`. This function is expected to return a string value that is treated as the language (no constraints on the string), that value is later passed to the `buildDictionary` function and to the wrapped page. So while there are no constraints on the string that can be returned, the rest of the app should be able to handle all the possible returned values. This function is how you tell the app what language it should use to localize the page.

`buildDictionary`: This is an `async` function that accepts the result of the `getLanguage` function and the value of `usedSources` in the mentioned order. This function is responsible for providing the dictionary that is used to translate the wrapped page. In case the page required some keys that cannot be found in the dictionary an exception will be thrown.

`settings`: This is the main settings for the localization. For now, it only contains 1 key: `customTranslation` (more on that later).

The HOC function is [curried](https://en.wikipedia.org/wiki/Currying). And it's intended to be used as follows: A specialized version of the HOC should be created and that specialized version should be used with the pages. An example for that specialized version is to use it to always provide some values for the HOC like `settings`, `buildDictionary`, and `getLanguage`.

So the resulting code would be something like the following:
```ts
// The specialized version
const withLocalization = withNextLocalization(
  {
    customTranslations: [ /* custom translations ... */ ]
  },
  myDictionaryBuilder,
  getLocalizationLanguage
);

// Its usage in some app page...
const MyPage = ({ t: Translate, lang: string, /* some other props from Next */ }) => {
  /* Page logic ... */
};

export withLocalization(MyPage);
```

### useLocalization
This is custom hook that returns an object of `{ t: (string) => string, lang: string }` which are the same props that get passed to the localized page.

The hook accepts one optional argument:
  - `customTranslation`: The same object that is passed to the localization HOC, defaults to empty array.
