import { LocaleMiddleware } from '@sitecore-content-sdk/nextjs/middleware';
import { locales } from 'src/i18n/config';
import sites from '.sitecore/sites.json';

// Locale middleware - extracts locale from path and sets locale header for App Router
export const localeMiddleware = new LocaleMiddleware({
  locales: [...locales],
  sites,
  skip: () => false,
});
