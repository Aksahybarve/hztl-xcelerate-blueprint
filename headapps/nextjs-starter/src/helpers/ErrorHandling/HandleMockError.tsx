// Global
import React, { useEffect } from 'react';

export type MockErrorData = {
  throwRenderError: boolean;
  throwStaticPropsError: boolean;
  throwClientSideError: boolean;
};

/** Helper to detect mock error routes from a path string */
export const getMockError = (path: string): MockErrorData | null => {
  if (path?.indexOf('/mock-error') !== 0) {
    return null;
  }
  return {
    throwRenderError: path.startsWith('/mock-error-render'),
    throwStaticPropsError: path.startsWith('/mock-error-props'),
    throwClientSideError: path.startsWith('/mock-error-client'),
  };
};

const HandleMockError = ({ throwClientSideError, throwRenderError }: MockErrorData) => {
  useEffect(() => {
    if (throwClientSideError) {
      throw new Error('mock client side error');
    }
  }, [throwClientSideError]);

  if (throwRenderError) {
    throw new Error('mock render error');
  }

  return <></>;
};

export default HandleMockError;
