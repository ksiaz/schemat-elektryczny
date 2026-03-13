import { BaseEdge, getSmoothStepPath, type EdgeProps } from '@xyflow/react';
import { WIRE_COLORS } from '../constants/index.ts';

export interface DcLineEdgeData {
  stringLabel?: string;   // np. PV1, PV2
  cableType?: string;     // np. PV1-F
  cableSection?: string;  // np. 2x4
  [key: string]: unknown;
}

export function DcLineEdge({
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
  const edgeData = data as DcLineEdgeData | undefined;

  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 8,
  });

  const label = edgeData?.stringLabel || '';
  const cableDesc = [edgeData?.cableType, edgeData?.cableSection].filter(Boolean).join(' ');

  return (
    <g>
      {/* Jednokreskowa czerwona linia DC */}
      <BaseEdge
        id={id}
        path={path}
        style={{
          stroke: WIRE_COLORS.DC,
          strokeWidth: selected ? 2.5 : 2,
        }}
      />

      {/* Etykieta stringu (PV1, PV2...) */}
      {label && (
        <g transform={`translate(${labelX}, ${labelY - 12})`}>
          <rect
            x={-20} y={-8}
            width={40} height={16}
            fill="white" stroke={WIRE_COLORS.DC} strokeWidth="0.5" rx="2"
          />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="10"
            fill={WIRE_COLORS.DC}
            fontWeight="bold"
          >
            {label}
          </text>
        </g>
      )}

      {/* Opis przewodu */}
      {cableDesc && (
        <g transform={`translate(${labelX}, ${labelY + 8})`}>
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="8"
            fill="#666"
            fontFamily="monospace"
          >
            {cableDesc}
          </text>
        </g>
      )}
    </g>
  );
}
