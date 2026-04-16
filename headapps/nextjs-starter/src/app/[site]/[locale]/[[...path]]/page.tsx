import { isDesignLibraryPreviewData } from '@sitecore-content-sdk/nextjs/editing';
import { notFound } from 'next/navigation';
import { draftMode } from 'next/headers';
import type { Metadata, Viewport } from 'next';
import { SiteInfo } from '@sitecore-content-sdk/nextjs';
import sites from '.sitecore/sites.json';
import { routing } from 'src/i18n/routing';
import client from 'src/lib/sitecore-client';
import { enrichPageContextForAppRouter } from 'src/lib/page-props-factory/enrich-page-context';
import Layout from 'src/Layout';
import Providers from 'src/Providers';

type PageProps = {
  params: Promise<{
    site: string;
    locale: string;
    path?: string[];
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const dynamic = 'force-dynamic';

export default async function Page({ params, searchParams }: PageProps) {
  const { site, locale, path } = await params;
  const draft = await draftMode();

  // Fetch page data
  let page;
  if (draft.isEnabled) {
    const editingParams = await searchParams;
    if (isDesignLibraryPreviewData(editingParams)) {
      page = await client.getDesignLibraryData(editingParams);
    } else {
      page = await client.getPreview(editingParams);
    }
  } else {
    page = await client.getPage(path ?? [], { site, locale });
  }

  if (!page) {
    notFound();
  }

  // Enrich context (languages, svgCache, siteSettings)
  page = await enrichPageContextForAppRouter(page, { site, locale });

  return (
    <Providers page={page}>
      <Layout page={page} />
    </Providers>
  );
}

// generateMetadata replaces the Metadata component that used next/head
export const generateMetadata = async ({ params, searchParams }: PageProps): Promise<Metadata> => {
  const { path, site, locale } = await params;
  const draft = await draftMode();

  let page = draft.isEnabled
    ? await client.getPreview(await searchParams)
    : await client.getPage(path ?? [], { site, locale });

  if (!page) return { title: 'Page' };

  page = await enrichPageContextForAppRouter(page, { site, locale });
  const route = page.layout.sitecore.route;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fields = (route?.fields ?? {}) as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const siteSettings = (page.layout.sitecore?.context?.siteSettings ?? {}) as Record<string, any>;
  const faviconUrl = siteSettings?.favicon?.value?.src || '/favicon.ico';
  const isArticle = route?.templateName === 'Article Detail Page';

  return {
    title: fields.pageTitle?.value?.toString() || 'Page',
    description: fields.MetaDescription?.value,
    keywords: fields.MetaKeywords?.value,
    icons: { icon: faviconUrl },
    robots: fields.robotsMetaTag?.value || 'index',
    alternates: fields.canonicalUrl?.value ? { canonical: fields.canonicalUrl.value } : undefined,
    openGraph: {
      title: fields.OpenGraphTitle?.value,
      description: fields.OpenGraphDescription?.value,
      images: fields.OpenGraphImageUrl?.value?.src
        ? [{ url: fields.OpenGraphImageUrl.value.src }]
        : undefined,
      type: isArticle ? 'article' : 'website',
      siteName: fields.OpenGraphSiteName?.value,
    },
    twitter: {
      title: fields.TwitterTitle?.value,
      site: fields.TwitterSite?.value,
      description: fields.TwitterDescription?.value,
      images: fields.TwitterImage?.value?.src ? [fields.TwitterImage.value.src] : undefined,
      card: fields.TwitterCardType?.fields?.Value?.value || 'summary',
    },
  };
};

// Replaces getStaticPaths
export const generateStaticParams = async () => {
  if (process.env.NODE_ENV === 'development') return [];
  if (process.env.GENERATE_STATIC_PATHS?.toLowerCase() !== 'true') return [];

  try {
    return await client.getAppRouterStaticParams(
      sites.map((site: SiteInfo) => site.name),
      routing.locales.slice()
    );
  } catch (error) {
    console.error('Error fetching static params:', error);
    return [];
  }
};
