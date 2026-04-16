'use client';
import * as FEAAS from '@sitecore-feaas/clientside/react';
import BYOC from 'src/byoc';
import { JSX } from 'react';

export default function FEAASRenderClient({ feaasSrc }: { feaasSrc: string }): JSX.Element {
  return (
    <>
      {feaasSrc && <FEAAS.Component src={feaasSrc} />}
      <BYOC />
    </>
  );
}
