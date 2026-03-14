import { BaseEdge, type EdgeProps } from '@xyflow/react';

export function DcRouteEdge({ id, sourceX, sourceY, targetX, targetY, selected }: EdgeProps) {
  const path = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
  return <BaseEdge id={id} path={path} style={{ stroke: '#FF0000', strokeWidth: selected ? 4 : 3 }} />;
}
