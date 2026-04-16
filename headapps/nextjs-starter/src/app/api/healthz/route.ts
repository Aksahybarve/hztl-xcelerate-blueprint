import { NextResponse } from 'next/server';

/**
 * Health check endpoint used by Sitecore XM Cloud (when running as editing host)
 * and other deployment scenarios.
 */
export function GET() {
  return NextResponse.json({ status: 'healthy' });
}
