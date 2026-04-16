import { createRobotsRouteHandler } from '@sitecore-content-sdk/nextjs/route-handler';
import scClient from 'lib/sitecore-client';
import sites from '.sitecore/sites.json';

/**
 * API route for serving robots.txt
 * Generates and returns robots.txt content dynamically based on the resolved site name.
 */
export const { GET } = createRobotsRouteHandler({
  client: scClient,
  sites,
});
