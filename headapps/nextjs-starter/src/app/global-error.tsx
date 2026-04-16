'use client';

import Link from 'next/link';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error: _error, reset }: GlobalErrorProps) {
  return (
    <div style={{ padding: 10 }}>
      <h1>500 Internal Server Error</h1>
      <p>There is a problem with the resource you are looking for.</p>
      <button onClick={() => reset()} style={{ marginRight: 10 }}>
        Try Again
      </button>
      <Link href="/">Go to the Home page</Link>
    </div>
  );
}
