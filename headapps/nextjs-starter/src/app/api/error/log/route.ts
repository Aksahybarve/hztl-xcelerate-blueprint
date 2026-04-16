import { NextRequest, NextResponse } from 'next/server';
import scConfig from 'sitecore.config';
import client from 'lib/sitecore-client';

/**
 * API route for logging client-side errors and returning the server error page path.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('language') || scConfig.defaultLanguage;
  const error = searchParams.get('error');

  if (error) {
    console.error('Client side error:');
    try {
      console.error(JSON.parse(error));
    } catch {
      console.error(error);
    }
  }

  const errorPages = await client.getErrorPages({
    site: scConfig.defaultSite,
    locale: locale,
  });

  return new NextResponse(errorPages?.serverErrorPagePath, {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });
}
