import { BaseEdge, getSmoothStepPath, type EdgeProps } from '@xyflow/react';
import { WIRE_COLORS } from '../constants/index.ts';
import { buildOrthogonalPath, getMidpoint, type Waypoint } from './utils.ts';

export interface DcLineEdgeData {
  stringLabel?: string;
  cableType?: string;
  cableSection?: string;
  waypoints?: Waypoint[];
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
  const waypoints = edgeData?.waypoints ?? [];

  let path: string;
  let labelX: number;
  let labelY: number;

  if (waypoints.length > 0) {
    path = buildOrthogonalPath(sourceX, sourceY, targetX, targetY, waypoints);
    const mid = getMidpoint(sourceX, sourceY, targetX, targetY, waypoints);
    labelX = mid.x;
    labelY = mid.y;
  } else {
    const result = getSmoothStepPath({
      sourceX, sourceY, targetX, targetY,
      sourcePosition, targetPosition, borderRadius: 8,
    });
    path = result[0];
    labelX = result[1];
    labelY = result[2];
  }

  const label = edgeData?.stringLabel || '';
  const cableDesc = [edgeData?.cableType, edgeData?.cableSection].filter(Boolean).join(' ');

  return (
    <g>
      <BaseEdge
        id={id}
        path={path}
        style={{ stroke: WIRE_COLORS.DC, strokeWidth: selected ? 2.5 : 2 }}
      />

      {label && (
        <g transform={`translate(${labelX}, ${labelY - 12})`}>
          <rect x={-20} y={-8} width={40} height={16} fill="white" stroke={WIRE_COLORS.DC} strokeWidth="0.5" rx="2" />
          <text textAnchor="middle" dominantBaseline="central" fontSize="10" fill={WIRE_COLORS.DC} fontWeight="bold">
            {label}
          </text>
        </g>
      )}

      {cableDesc && (
        <g transform={`translate(${labelX}, ${labelY + 8})`}>
          <text textAnchor="middle" dominantBaseline="central" fontSize="8" fill="#666" fontFamily="monospace">
            {cableDesc}
          </text>
        </g>
      )}

      {selected && waypoints.map((wp, i) => (
        <circle key={i} cx={wp.x} cy={wp.y} r={4} fill="white" stroke="#3b82f6" strokeWidth="2" className="cursor-move" />
      ))}
    </g>
  );
}
