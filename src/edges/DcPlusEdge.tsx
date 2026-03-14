import { BaseEdge, type EdgeProps } from '@xyflow/react';
import { buildOrthogonalPath, getMidpoint } from './utils.ts';

export function DcPlusEdge({
  id, sourceX, sourceY, targetX, targetY,
  data, selected,
}: EdgeProps) {
  const edgeData = (data ?? {}) as Record<string, unknown>;
  const path = buildOrthogonalPath(sourceX, sourceY, targetX, targetY);
  const mid = getMidpoint(sourceX, sourceY, targetX, targetY);

  const parts = [edgeData.cableType, edgeData.cableSection, edgeData.cableLength].filter(Boolean);
  const label = parts.length > 0 ? parts.join(' ') : '';

  return (
    <g>
      <BaseEdge id={id} path={path} style={{ stroke: '#FF0000', strokeWidth: selected ? 2.5 : 1.5 }} />
      {label && (
        <g transform={`translate(${mid.x}, ${mid.y - 10})`}>
          <rect x={-35} y={-7} width={70} height={14} fill="white" stroke="#FF0000" strokeWidth="0.5" rx="2" />
          <text textAnchor="middle" dominantBaseline="central" fontSize="8" fill="#FF0000" fontFamily="monospace">{String(label)}</text>
        </g>
      )}
      <text x={sourceX + 5} y={sourceY + 12} fontSize="7" fill="#FF0000" fontWeight="bold">DC+</text>
    </g>
  );
}
