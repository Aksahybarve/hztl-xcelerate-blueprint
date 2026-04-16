import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

type Props = {
  children: ReactNode;
  params: Promise<{
    site: string;
    locale: string;
  }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { site, locale } = await params;

  // Tell next-intl which site+locale to use for dictionary fetching
  setRequestLocale(`${site}_${locale}`);

  return <NextIntlClientProvider>{children}</NextIntlClientProvider>;
}
