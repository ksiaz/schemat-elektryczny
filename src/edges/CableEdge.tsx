import { BaseEdge, getSmoothStepPath, type EdgeProps } from '@xyflow/react';
import { buildOrthogonalPath, getMidpoint, type Waypoint } from './utils.ts';

export interface CableEdgeData {
  cableType?: string;
  cableSection?: string;
  cableLength?: string;
  wireColor?: string;
  waypoints?: Waypoint[];
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
  const waypoints = edgeData?.waypoints ?? [];
  const color = edgeData?.wireColor || '#333';

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

  const label = [edgeData?.cableType, edgeData?.cableSection, edgeData?.cableLength]
    .filter(Boolean).join(' ');

  return (
    <g>
      <BaseEdge
        id={id}
        path={path}
        style={{ stroke: color, strokeWidth: selected ? 2 : 1.2 }}
      />

      {label && (
        <g transform={`translate(${labelX}, ${labelY - 10})`}>
          <rect x={-35} y={-7} width={70} height={14} fill="white" stroke="#ddd" strokeWidth="0.5" rx="2" />
          <text textAnchor="middle" dominantBaseline="central" fontSize="8" fill="#555" fontFamily="monospace">
            {label}
          </text>
        </g>
      )}

      {selected && waypoints.map((wp, i) => (
        <circle key={i} cx={wp.x} cy={wp.y} r={4} fill="white" stroke="#3b82f6" strokeWidth="2" className="cursor-move" />
      ))}
    </g>
  );
}
