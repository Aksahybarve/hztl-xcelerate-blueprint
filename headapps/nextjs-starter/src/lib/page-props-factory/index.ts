import { CustomSitecorePageProps } from 'lib/page-props';

export interface Plugin {
  /**
   * Detect order when the plugin should be called, e.g. 0 - will be called first (can be a plugin which data is required for other plugins)
   */
  order: number;
  /**
   * A function which will be called during page props enrichment
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  exec(props: CustomSitecorePageProps, context: any): Promise<CustomSitecorePageProps>;
}
