import { createSitemapRouteHandler } from '@sitecore-content-sdk/nextjs/route-handler';
import scClient from 'lib/sitecore-client';
import sites from '.sitecore/sites.json';

/**
 * API route for generating sitemap.xml
 * Dynamically generates and serves the sitemap XML for your site.
 */
export const { GET } = createSitemapRouteHandler({
  client: scClient,
  sites,
});
