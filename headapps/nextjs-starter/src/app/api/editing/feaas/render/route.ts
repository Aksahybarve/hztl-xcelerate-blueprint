import { FEAASRenderMiddleware } from '@sitecore-content-sdk/nextjs/editing';
import { NextRequest } from 'next/server';

/**
 * This Next.js API route is used to handle GET requests from Sitecore Component Builder.
 * The FEAASRenderMiddleware enables Preview Mode and redirects to /feaas/render page.
 */
const handler = new FEAASRenderMiddleware().getHandler();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(req: NextRequest): Promise<any> {
  return handler(
    req as unknown as Parameters<typeof handler>[0],
    {} as Parameters<typeof handler>[1]
  );
}
