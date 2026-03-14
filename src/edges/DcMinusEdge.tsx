import { BaseEdge, getSmoothStepPath, type EdgeProps } from '@xyflow/react';

export function DcMinusEdge({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition, data, selected,
}: EdgeProps) {
  const edgeData = (data ?? {}) as Record<string, unknown>;
  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX, sourceY, targetX, targetY,
    sourcePosition, targetPosition, borderRadius: 8,
  });

  const label = edgeData.cableType ? String(edgeData.cableType) : '';

  return (
    <g>
      <BaseEdge id={id} path={path} style={{ stroke: '#0000CD', strokeWidth: selected ? 2.5 : 1.5 }} />
      {label && (
        <g transform={`translate(${labelX}, ${labelY - 10})`}>
          <rect x={-25} y={-7} width={50} height={14} fill="white" stroke="#0000CD" strokeWidth="0.5" rx="2" />
          <text textAnchor="middle" dominantBaseline="central" fontSize="8" fill="#0000CD" fontFamily="monospace">{label}</text>
        </g>
      )}
      <text x={sourceX + 5} y={sourceY + 12} fontSize="7" fill="#0000CD" fontWeight="bold">DC-</text>
    </g>
  );
}
