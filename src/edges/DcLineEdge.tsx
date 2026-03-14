import { BaseEdge, type EdgeProps } from '@xyflow/react';
import { WIRE_COLORS } from '../constants/index.ts';
import { buildOrthogonalPath, getMidpoint, type Waypoint } from './utils.ts';

export function DcLineEdge({
  id, sourceX, sourceY, targetX, targetY, data, selected,
}: EdgeProps) {
  const d = (data ?? {}) as Record<string, unknown>;
  const waypoints = (d.waypoints ?? []) as Waypoint[];
  const path = buildOrthogonalPath(sourceX, sourceY, targetX, targetY, waypoints);
  const mid = getMidpoint(sourceX, sourceY, targetX, targetY, waypoints);
  const label = (d.stringLabel ?? '') as string;
  const cableDesc = [d.cableType, d.cableSection].filter(Boolean).join(' ');

  return (
    <g>
      <BaseEdge id={id} path={path} style={{ stroke: WIRE_COLORS.DC, strokeWidth: selected ? 2.5 : 2 }} />
      {label && (
        <g transform={`translate(${mid.x}, ${mid.y - 12})`}>
          <rect x={-20} y={-8} width={40} height={16} fill="white" stroke={WIRE_COLORS.DC} strokeWidth="0.5" rx="2" />
          <text textAnchor="middle" dominantBaseline="central" fontSize="10" fill={WIRE_COLORS.DC} fontWeight="bold">{label}</text>
        </g>
      )}
      {cableDesc && (
        <g transform={`translate(${mid.x}, ${mid.y + 8})`}>
          <text textAnchor="middle" dominantBaseline="central" fontSize="8" fill="#666" fontFamily="monospace">{cableDesc}</text>
        </g>
      )}
      {selected && waypoints.map((wp, i) => (<circle key={i} cx={wp.x} cy={wp.y} r={4} fill="#3b82f6" stroke="white" strokeWidth="1.5" style={{ pointerEvents: "none" }} />))}
    </g>
  );
}
