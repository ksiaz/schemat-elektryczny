import { BaseEdge, getSmoothStepPath, type EdgeProps } from '@xyflow/react';

export interface CableEdgeData {
  cableType?: string;     // np. YDY, LgY
  cableSection?: string;  // np. 3x1.5
  cableLength?: string;   // np. 8m
  wireColor?: string;     // kolor linii (domyslnie czarny)
  [key: string]: unknown;
}

export function CableEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps) {
  const edgeData = data as CableEdgeData | undefined;

  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 8,
  });

  const color = edgeData?.wireColor || '#333';
  const label = [edgeData?.cableType, edgeData?.cableSection, edgeData?.cableLength]
    .filter(Boolean)
    .join(' ');

  return (
    <g>
      <BaseEdge
        id={id}
        path={path}
        style={{
          stroke: color,
          strokeWidth: selected ? 2 : 1.2,
        }}
      />

      {label && (
        <g transform={`translate(${labelX}, ${labelY - 10})`}>
          <rect
            x={-35} y={-7}
            width={70} height={14}
            fill="white" stroke="#ddd" strokeWidth="0.5" rx="2"
          />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="8"
            fill="#555"
            fontFamily="monospace"
          >
            {label}
          </text>
        </g>
      )}
    </g>
  );
}
