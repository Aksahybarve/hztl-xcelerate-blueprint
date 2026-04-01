import { CustomSitecorePageProps } from 'lib/page-props';
import { Plugin } from '..';
import { deepSearch } from 'lib/utils/object-utils';
import { ImageField } from '@sitecore-content-sdk/nextjs';
import { normalizeImageUrl } from 'helpers/SitecoreWrappers/ImageWrapper/ImageWrapper';
class SvgCachePlugin implements Plugin {
  order = 4;

  async exec(props: CustomSitecorePageProps) {
    if (props.notFound || !props.page) return props;

    // Get all SVG Image fields
    const fields = deepSearch(
      props.page.layout.sitecore.route,
      (x: ImageField) => !!x?.value?.src?.match(/\.svg([\?\#]?.*)?$/)
    );

    // Don't fetch the same SVG multiple times
    const distinctSvgs = [
      ...new Set(
        fields
          .map((field) => normalizeImageUrl(field.value?.src))
          .filter((src) => !!src) as string[]
      ),
    ];
    // Create a cache of SVG text for each field
    const svgCache: Record<string, string> = {};

    await Promise.all(
      // Fetch the SVG text for each field and cache it
      distinctSvgs.map(async (src) => {
        const response = await fetch(src);
        if (!response.ok) return;
        const svgText = await response.text();
        if (svgText) {
          svgCache[src] = svgText;
        }
      })
    );

    props.page.layout.sitecore.context.svgCache = svgCache;

    return props;
  }
}

export const svgCachePlugin = new SvgCachePlugin();
