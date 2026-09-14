import type { SVGProps } from 'react';
import { getBrandAssetPath } from '../app/assets/branding';

/** The original voxel cave and torch retain their colors in every theme. */
export function BurrowSymbol(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" {...props}>
      <image href={getBrandAssetPath('product-mark')} width="40" height="40" />
    </svg>
  );
}
