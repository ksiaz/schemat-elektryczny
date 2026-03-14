import { useNodes } from '@xyflow/react';
import { useMemo } from 'react';
import { getSmartPath } from './smartPath.ts';

// Hook do smart pathfinding w edge komponentach
export function useSmartPath(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  sourcePosition: string,
  targetPosition: string,
) {
  const nodes = useNodes();

  return useMemo(() => getSmartPath({
    sourceX, sourceY, targetX, targetY,
    sourcePosition, targetPosition,
    nodes,
  }), [sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, nodes]);
}
