import { BaseEdge, type EdgeProps } from '@xyflow/react';
import { buildOrthogonalPath, getMidpoint } from './utils.ts';

export function DcMinusEdge({
  id, sourceX, sourceY, targetX, targetY, data, selected,
}: EdgeProps) {
  const d = (data ?? {}) as Record<string, unknown>;
  const path = buildOrthogonalPath(sourceX, sourceY, targetX, targetY);
  const mid = getMidpoint(sourceX, sourceY, targetX, targetY);
  const label = [d.cableType, d.cableSection, d.cableLength].filter(Boolean).join(' ');

  return (
    <g>
      <BaseEdge id={id} path={path} style={{ stroke: '#0000CD', strokeWidth: selected ? 2.5 : 1.5 }} />
      {label && (
        <g transform={`translate(${mid.x}, ${mid.y - 10})`}>
          <rect x={-35} y={-7} width={70} height={14} fill="white" stroke="#0000CD" strokeWidth="0.5" rx="2" />
          <text textAnchor="middle" dominantBaseline="central" fontSize="8" fill="#0000CD" fontFamily="monospace">{String(label)}</text>
        </g>
      )}
    </g>
  );
}
