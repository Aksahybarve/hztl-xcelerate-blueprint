import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { WebhookRequestBody } from 'lib/webhook/revalidate/type';
import { fetchItemUrl } from 'lib/webhook/revalidate/admin-utils';
import { RevalidationService } from 'lib/webhook/revalidate/revalidate-service';
import { waitUntil } from '@vercel/functions';

export interface revalidateRequestHeaders {
  secret?: string;
}

interface WebhookResponse {
  revalidated: boolean;
  error?: string;
}

const BATCH_SIZE = Number(process.env.PROCESS_BATCH_SIZE || '25');

async function processRevalidationBatches(
  updates: WebhookRequestBody['updates'],
  revalidationService: RevalidationService
) {
  try {
    const layoutUpdates = revalidationService.processLayoutUpdates(updates);

    const urls = await Promise.all(
      layoutUpdates.map(async ({ identifier, entity_culture }) => {
        try {
          return await fetchItemUrl(identifier.replace('-layout', ''), entity_culture);
        } catch (error) {
          console.log(`Failed to fetch item URL: ${error}`);
          return null;
        }
      })
    );

    const validUrls = urls.filter((url): url is NonNullable<typeof url> => url !== null);

    for (let i = 0; i < validUrls.length; i += BATCH_SIZE) {
      const batch = validUrls.slice(i, i + BATCH_SIZE);
      try {
        for (const url of batch) {
          if (!url?.url?.path) continue;
          const pathToClear = buildPathToClear(url);
          revalidatePath(pathToClear);
          console.log(`Successfully revalidated: ${pathToClear}`);
        }
        console.log(
          `Processed batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(
            validUrls.length / BATCH_SIZE
          )}`
        );
      } catch (error) {
        console.error(`Error processing batch ${Math.floor(i / BATCH_SIZE) + 1}:`, error);
      }
    }

    console.log('Revalidation completed successfully');
  } catch (error) {
    console.error('Revalidation process failed:', error);
  }
}

function buildPathToClear(url: {
  url: { path: string };
  language?: string;
  slug?: string;
  slugAncestor?: string;
}): string {
  if (url.slug) {
    return `/${url.language}/${url.slugAncestor}/${url.slug.charAt(0)}/${url.slug}`;
  }

  const domain = process.env.REVALIDATE_BASE_URL;
  const cleanPath = url.url.path.replace(/^\/+/, '').replace(new RegExp(`^${domain}\/`), '');

  return `/${url.language}/${cleanPath}`.replace(/\/+/g, '/');
}

export async function POST(request: NextRequest): Promise<NextResponse<WebhookResponse>> {
  const revalidationService = new RevalidationService(process.env.ISR_REVALIDATE_SECRET || '');

  try {
    if (!revalidationService.isWebhookEnabled()) {
      console.log('Webhook processing is disabled');
      return NextResponse.json({
        revalidated: false,
        error: 'Webhook processing is disabled',
      });
    }

    const isValidSecret = revalidationService.validateSecret(
      request.headers.get('secret') ?? undefined
    );

    if (!isValidSecret) {
      console.log('Invalid revalidation secret provided');
      return NextResponse.json({ revalidated: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { updates } = (await request.json()) as WebhookRequestBody;

    waitUntil(processRevalidationBatches(updates, revalidationService));

    return NextResponse.json({ revalidated: true });
  } catch (error) {
    console.log('Webhook processing failed:', error);
    return NextResponse.json({
      revalidated: false,
      error: 'Webhook processed unsuccessfully',
    });
  }
}
