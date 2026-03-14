import { BaseEdge, getSmoothStepPath, type EdgeProps } from '@xyflow/react';

export function PeEdge({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition, data, selected,
}: EdgeProps) {
  const edgeData = (data ?? {}) as Record<string, unknown>;
  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX, sourceY, targetX, targetY,
    sourcePosition, targetPosition,
    borderRadius: 10,
    offset: 30,
  });

  const parts = [edgeData.cableType, edgeData.cableSection, edgeData.cableLength].filter(Boolean);
  const label = parts.length > 0 ? parts.join(' ') : '';

  return (
    <g>
      <BaseEdge id={`${id}-green`} path={path} style={{ stroke: '#228B22', strokeWidth: selected ? 3 : 2 }} />
      <BaseEdge id={`${id}-yellow`} path={path} style={{ stroke: '#FFD700', strokeWidth: selected ? 3 : 2, strokeDasharray: '6,4' }} />
      {label && (
        <g transform={`translate(${labelX}, ${labelY - 10})`}>
          <rect x={-25} y={-7} width={50} height={14} fill="white" stroke="#228B22" strokeWidth="0.5" rx="2" />
          <text textAnchor="middle" dominantBaseline="central" fontSize="8" fill="#228B22" fontFamily="monospace">{String(label)}</text>
        </g>
      )}
      <text x={sourceX + 5} y={sourceY + 12} fontSize="7" fill="#228B22" fontWeight="bold">PE</text>
    </g>
  );
}
