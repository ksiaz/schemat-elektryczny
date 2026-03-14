import { useNodes } from '@xyflow/react';
import { useMemo } from 'react';
import type { NodeRect } from './utils.ts';

// Zwraca prostokaty wszystkich wezlow (do omijania przez kable)
export function useNodeRects(): NodeRect[] {
  const nodes = useNodes();

  return useMemo(() =>
    nodes.map((n) => ({
      x: n.position.x,
      y: n.position.y,
      width: (n.measured?.width ?? (n.style?.width as number) ?? 80),
      height: (n.measured?.height ?? (n.style?.height as number) ?? 60),
    })),
    [nodes]
  );
}
