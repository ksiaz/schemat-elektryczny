import { BaseEdge, getSmoothStepPath, type EdgeProps } from '@xyflow/react';
import { WIRE_COLORS } from '../constants/index.ts';
import { buildOrthogonalPath, getMidpoint, type Waypoint } from './utils.ts';

const WIRE_SPACING = 3;

const WIRES = [
  { id: 'L1', color: WIRE_COLORS.L1 },
  { id: 'L2', color: WIRE_COLORS.L2 },
  { id: 'L3', color: WIRE_COLORS.L3 },
  { id: 'N', color: WIRE_COLORS.N },
  { id: 'PE', color: WIRE_COLORS.PE },
];

export interface MultilineAcEdgeData {
  cableType?: string;
  cableSection?: string;
  cableLength?: string;
  waypoints?: Waypoint[];
  [key: string]: unknown;
}

export function MultilineAcEdge({
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
  const edgeData = data as MultilineAcEdgeData | undefined;
  const waypoints = edgeData?.waypoints ?? [];

  // Sciezka: reczna (waypoints) lub automatyczna (smooth step)
  let basePath: string;
  let labelX: number;
  let labelY: number;

  if (waypoints.length > 0) {
    basePath = buildOrthogonalPath(sourceX, sourceY, targetX, targetY, waypoints);
    const mid = getMidpoint(sourceX, sourceY, targetX, targetY, waypoints);
    labelX = mid.x;
    labelY = mid.y;
  } else {
    const result = getSmoothStepPath({
      sourceX, sourceY, targetX, targetY,
      sourcePosition, targetPosition,
      borderRadius: 8,
    });
    basePath = result[0];
    labelX = result[1];
    labelY = result[2];
  }

  const cableLabel = [
    edgeData?.cableType,
    edgeData?.cableSection,
    edgeData?.cableLength,
  ].filter(Boolean).join(' ');

  return (
    <g className={selected ? 'opacity-100' : 'opacity-90'}>
      {/* 5 rownoleglych linii */}
      {WIRES.map((wire, i) => {
        const offset = (i - 2) * WIRE_SPACING;
        return (
          <g key={wire.id} transform={`translate(${offset}, 0)`}>
            <BaseEdge
              id={`${id}-${wire.id}`}
              path={basePath}
              style={{
                stroke: wire.color,
                strokeWidth: selected ? 1.5 : 1,
              }}
            />
          </g>
        );
      })}

      {/* Etykieta */}
      {cableLabel && (
        <g transform={`translate(${labelX}, ${labelY - 12})`}>
          <rect x={-40} y={-8} width={80} height={16} fill="white" stroke="#ccc" strokeWidth="0.5" rx="2" />
          <text textAnchor="middle" dominantBaseline="central" fontSize="9" fill="#555" fontFamily="monospace">
            {cableLabel}
          </text>
        </g>
      )}

      {/* Oznaczenia zyl */}
      <g transform={`translate(${sourceX}, ${sourceY + 8})`}>
        {WIRES.map((wire, i) => (
          <text key={wire.id} x={(i - 2) * WIRE_SPACING} y={10} textAnchor="middle" fontSize="6" fill={wire.color} fontWeight="bold">
            {wire.id}
          </text>
        ))}
      </g>

      {/* Waypoints — widoczne koleczka do przeciagania (tylko przy zaznaczeniu) */}
      {selected && waypoints.map((wp, i) => (
        <circle
          key={i}
          cx={wp.x} cy={wp.y} r={4}
          fill="white" stroke="#3b82f6" strokeWidth="2"
          className="cursor-move"
        />
      ))}
    </g>
  );
}
