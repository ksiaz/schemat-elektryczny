import { BaseEdge, type EdgeProps } from '@xyflow/react';

export function PeRouteEdge({ id, sourceX, sourceY, targetX, targetY, selected }: EdgeProps) {
  const path = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
  return (
    <g>
      <BaseEdge id={`${id}-green`} path={path} style={{ stroke: '#228B22', strokeWidth: selected ? 4 : 3 }} />
      <BaseEdge id={`${id}-yellow`} path={path} style={{ stroke: '#FFD700', strokeWidth: selected ? 4 : 3, strokeDasharray: '6,4' }} />
    </g>
  );
}
