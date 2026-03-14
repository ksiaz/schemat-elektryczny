import { BaseEdge, type EdgeProps } from '@xyflow/react';
import { buildOrthogonalPath, getMidpoint, type Waypoint } from './utils.ts';

export function CableEdge({
  id, sourceX, sourceY, targetX, targetY,
  data, selected,
}: EdgeProps) {
  const edgeData = (data ?? {}) as Record<string, unknown>;
  const waypoints = (edgeData.waypoints ?? []) as Waypoint[];
  const color = (edgeData.wireColor as string) || '#333';

  const path = buildOrthogonalPath(sourceX, sourceY, targetX, targetY, waypoints);
  const mid = getMidpoint(sourceX, sourceY, targetX, targetY, waypoints);

  const label = [edgeData.cableType, edgeData.cableSection, edgeData.cableLength].filter(Boolean).join(' ');

  return (
    <g>
      <BaseEdge id={id} path={path} style={{ stroke: color, strokeWidth: selected ? 2 : 1.2 }} />

      {label && (
        <g transform={`translate(${mid.x}, ${mid.y - 10})`}>
          <rect x={-35} y={-7} width={70} height={14} fill="white" stroke="#ddd" strokeWidth="0.5" rx="2" />
          <text textAnchor="middle" dominantBaseline="central" fontSize="8" fill="#555" fontFamily="monospace">{label}</text>
        </g>
      )}

      {selected && waypoints.map((wp, i) => (
        <circle key={i} cx={wp.x} cy={wp.y} r={4} fill="white" stroke="#3b82f6" strokeWidth="2" className="cursor-move" />
      ))}
    </g>
  );
}
