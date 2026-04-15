import { Page } from '@sitecore-content-sdk/nextjs';
import { CustomSitecorePageProps } from 'lib/page-props';
import { pageLanguagesPlugin } from './plugins/page-languages';
import { siteSettingsPlugin } from './plugins/site-settings';
import { svgCachePlugin } from './plugins/svg-cache';
import { Plugin } from '.';

export type EnrichPageContextOptions = {
  site: string;
  locale: string;
};

/**
 * App Router equivalent of the page-props-factory pipeline.
 * Reuses existing plugins to enrich the Page object with
 * languages, site settings, SVG cache, etc.
 */
export async function enrichPageContextForAppRouter(
  page: Page,
  options: EnrichPageContextOptions
): Promise<Page> {
  const enrichedPage = {
    ...page,
    siteName: page.siteName ?? options.site,
    locale: page.locale ?? options.locale,
  };

  let props: CustomSitecorePageProps = {
    page: enrichedPage,
    notFound: false,
  };

  const plugins: Plugin[] = [pageLanguagesPlugin, svgCachePlugin, siteSettingsPlugin];

  for (const plugin of plugins.sort((a, b) => a.order - b.order)) {
    try {
      // Plugins require a context arg per the Plugin interface, but the enrichment
      // plugins (page-languages, svg-cache, site-settings) don't use it.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      props = await plugin.exec(props, {} as any);
    } catch (error) {
      console.warn(`Plugin ${plugin.constructor.name} failed:`, error);
    }
  }

  const resultPage = props.page!;
  const context = resultPage.layout.sitecore.context as Record<string, unknown>;

  // Default variantId when not personalized
  if (context.variantId === undefined || context.variantId === null) {
    context.variantId = '_default';
  }

  return resultPage;
}
