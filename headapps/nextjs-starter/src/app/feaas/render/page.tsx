import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import FEAASRenderClient from './client';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function FEAASRenderPage({ searchParams }: Props) {
  const draft = await draftMode();

  // Don't show the page if it's not in preview/draft mode
  if (!draft.isEnabled) {
    notFound();
  }

  const params = await searchParams;
  const feaasSrc = (params.feaasSrc as string) || '';

  return <FEAASRenderClient feaasSrc={feaasSrc} />;
}
