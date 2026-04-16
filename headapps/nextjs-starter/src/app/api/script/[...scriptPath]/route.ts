import { NextRequest, NextResponse } from 'next/server';
import graphqlClientFactory from 'lib/graphql-client-factory';
import { Content } from '.generated/Content/CodeEmbed.model';
import { isGuid } from 'lib/utils/string-utils';

type CodeEmbedScriptData = {
  item: Content.CodeEmbed.CodeEmbedJson;
};

const CodeEmbedScriptQuery = `
query CodeEmbedScriptQuery ($path: String!, $language: String!) {
  item: item(path: $path, language: $language) {
    id
    path
    ... on CodeEmbed {
      script {
        jsonValue
      }
    }
  }
}`;

async function getScriptByPath(scriptPath: string | undefined): Promise<string | undefined> {
  if (!scriptPath) {
    return undefined;
  }
  const graphQLClient = graphqlClientFactory({ fetch: fetch });
  const result = await graphQLClient.request<CodeEmbedScriptData>(CodeEmbedScriptQuery, {
    path: scriptPath,
    language: 'en',
  });

  return result?.item?.script?.jsonValue?.value;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ scriptPath: string[] }> }
) {
  const { scriptPath } = await params;

  if (!scriptPath || !Array.isArray(scriptPath) || scriptPath.length === 0) {
    console.warn(`[api/script.handler] no scriptPath param`);
    return NextResponse.redirect(new URL('/not-found', request.url));
  }

  const itemPath = scriptPath.join('/').replaceAll('.js', '');
  const fullScriptPath = `${isGuid(itemPath) ? '' : '/'}` + itemPath;
  const scriptContent = await getScriptByPath(fullScriptPath);

  if (!scriptContent) {
    console.warn(
      `[api/script.handler] no item or script content found for script path:`,
      fullScriptPath
    );
    return NextResponse.redirect(new URL('/not-found', request.url));
  }

  return new NextResponse(scriptContent, {
    status: 200,
    headers: { 'content-type': 'application/javascript' },
  });
}
