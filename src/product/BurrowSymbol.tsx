import type { SVGProps } from 'react';

/** A doorway cut into a block. Designed to remain legible as a 16px app mark. */
export function BurrowSymbol(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" {...props}>
      <path d="M8 5h17l9 9v21H23V21h-8v14H6V7a2 2 0 0 1 2-2Z" fill="currentColor" />
      <path d="M25 5v9h9" fill="currentColor" opacity=".45" />
      <path d="M17 24h4v11h-4z" fill="currentColor" opacity=".35" />
    </svg>
  );
}
