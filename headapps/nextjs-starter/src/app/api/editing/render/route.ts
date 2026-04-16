import { createEditingRenderRouteHandlers } from '@sitecore-content-sdk/nextjs/route-handler';

/**
 * This Next.js API route is used to handle GET and POST requests from Sitecore editors.
 * GET requests are used with Metadata editing mode while POST ones are used with Chromes(legacy) mode.
 */
export const { GET, POST, OPTIONS } = createEditingRenderRouteHandlers({});
