import { BaseEdge, type EdgeProps } from '@xyflow/react';
import { buildOrthogonalPath, getMidpoint, type Waypoint } from './utils.ts';
import { DraggableWaypoint } from './DraggableWaypoint.tsx';

export function PeEdge({
  id, sourceX, sourceY, targetX, targetY, data, selected,
}: EdgeProps) {
  const d = (data ?? {}) as Record<string, unknown>;
  const waypoints = (d.waypoints ?? []) as Waypoint[];
  const path = buildOrthogonalPath(sourceX, sourceY, targetX, targetY, waypoints);
  const mid = getMidpoint(sourceX, sourceY, targetX, targetY, waypoints);
  const label = [d.cableType, d.cableSection, d.cableLength].filter(Boolean).join(' ');

  return (
    <g>
      <BaseEdge id={`${id}-green`} path={path} style={{ stroke: '#228B22', strokeWidth: selected ? 3 : 2 }} />
      <BaseEdge id={`${id}-yellow`} path={path} style={{ stroke: '#FFD700', strokeWidth: selected ? 3 : 2, strokeDasharray: '6,4' }} />
      {label && (
        <g transform={`translate(${mid.x}, ${mid.y - 10})`}>
          <rect x={-25} y={-7} width={50} height={14} fill="white" stroke="#228B22" strokeWidth="0.5" rx="2" />
          <text textAnchor="middle" dominantBaseline="central" fontSize="8" fill="#228B22" fontFamily="monospace">{String(label)}</text>
        </g>
      )}
      {selected && waypoints.map((wp, i) => (
        <DraggableWaypoint key={i} edgeId={id} waypointIndex={i} waypoints={waypoints} x={wp.x} y={wp.y} />
      ))}
    </g>
  );
}
