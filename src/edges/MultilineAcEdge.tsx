import { BaseEdge, type EdgeProps } from '@xyflow/react';
import { WIRE_COLORS } from '../constants/index.ts';
import { buildOrthogonalPath, getMidpoint, type Waypoint } from './utils.ts';
import { useNodeRects } from './useNodeRects.ts';

const WIRE_SPACING = 3;
const WIRES = [
  { id: 'L1', color: WIRE_COLORS.L1 },
  { id: 'L2', color: WIRE_COLORS.L2 },
  { id: 'L3', color: WIRE_COLORS.L3 },
  { id: 'N', color: WIRE_COLORS.N },
  { id: 'PE', color: WIRE_COLORS.PE },
];

export function MultilineAcEdge({
  id, sourceX, sourceY, targetX, targetY, data, selected,
}: EdgeProps) {
  const edgeData = (data ?? {}) as Record<string, unknown>;
  const waypoints = (edgeData.waypoints ?? []) as Waypoint[];
  const obstacles = useNodeRects();
  const basePath = buildOrthogonalPath(sourceX, sourceY, targetX, targetY, waypoints, obstacles);
  const mid = getMidpoint(sourceX, sourceY, targetX, targetY, waypoints);
  const cableLabel = [edgeData.cableType, edgeData.cableSection, edgeData.cableLength].filter(Boolean).join(' ');

  return (
    <g className={selected ? 'opacity-100' : 'opacity-90'}>
      {WIRES.map((wire, i) => (
        <g key={wire.id} transform={`translate(${(i - 2) * WIRE_SPACING}, 0)`}>
          <BaseEdge id={`${id}-${wire.id}`} path={basePath} style={{ stroke: wire.color, strokeWidth: selected ? 1.5 : 1 }} />
        </g>
      ))}
      {cableLabel && (
        <g transform={`translate(${mid.x}, ${mid.y - 12})`}>
          <rect x={-40} y={-8} width={80} height={16} fill="white" stroke="#ccc" strokeWidth="0.5" rx="2" />
          <text textAnchor="middle" dominantBaseline="central" fontSize="9" fill="#555" fontFamily="monospace">{cableLabel}</text>
        </g>
      )}
      {selected && waypoints.map((wp, i) => (
        <circle key={i} cx={wp.x} cy={wp.y} r={4} fill="white" stroke="#3b82f6" strokeWidth="2" />
      ))}
    </g>
  );
}
