import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export interface revalidateRequest {
  url?: string;
  secret?: string;
  siteName?: string;
}

export async function POST(request: NextRequest) {
  console.info('On Demand Revalidation is called');
  const revalidateRequest = (await request.json()) as revalidateRequest;
  let revalidated = false;
  console.info('revalidateRequest', revalidateRequest);

  if (revalidateRequest.secret !== process.env.ISR_REVALIDATE_SECRET) {
    console.info('Failed to revalidate, reason : secret does not match ');
    return NextResponse.json({ revalidated: false, error: 'Invalid secret' }, { status: 401 });
  }

  try {
    let pathToClear = '/';
    if (revalidateRequest) {
      pathToClear = revalidateRequest?.url || '';
    }
    if (pathToClear === '') {
      return NextResponse.json({ revalidated: false, error: 'No path provided' }, { status: 400 });
    }

    // In App Router, paths are structured as /<site>/<locale>/<path>
    const pathSegments = pathToClear.split('/').filter(Boolean);
    const hasLanguagePrefix = /^[a-z]{2}$/.test(pathSegments[0] || '');
    const languagePrefix = hasLanguagePrefix ? pathSegments[0] : '';
    const remainingSegments = hasLanguagePrefix ? pathSegments.slice(1) : pathSegments;

    // App Router multisite uses /<site>/<locale>/<path> structure
    const structuredPath = revalidateRequest.siteName
      ? `/${revalidateRequest.siteName}${languagePrefix ? `/${languagePrefix}` : ''}/${remainingSegments.join('/')}`
      : `/${pathSegments.join('/')}`;

    console.info('structured path for revalidation:', structuredPath);
    revalidatePath(structuredPath);
    revalidated = true;

    return NextResponse.json({ revalidated, path: structuredPath });
  } catch (err) {
    console.error('error on revalidateRequest', err);
    return NextResponse.json(
      { revalidated: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
