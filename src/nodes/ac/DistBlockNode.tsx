import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type DistBlockNodeType = Node<SchematicNodeData, 'distBlock'>;

// Blok rozdzielczy 4P — 4 listwy (L1, L2, L3, N), kazda z 5 zaciskami
// Gora: 1 wejscie na kazdy biegun (grubszy zacisk)
// Dol: 4 wyjscia na kazdy biegun
const POLES = [
  { id: 'L1', color: WIRE_COLORS.L1, x: 10 },
  { id: 'L2', color: WIRE_COLORS.L2, x: 30 },
  { id: 'L3', color: WIRE_COLORS.L3, x: 50 },
  { id: 'N', color: WIRE_COLORS.N, x: 70 },
];

export function DistBlockNode({ data, selected }: NodeProps<DistBlockNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 90 }}>
      {/* 4 wejscia u gory — po 1 na biegun */}
      {POLES.map((p) => (
        <Handle key={`in-${p.id}`} type="source" position={Position.Top} id={`in-${p.id}`}
          className="!w-1.5 !h-1.5" style={{ backgroundColor: p.color, left: p.x }} />
      ))}

      <svg width="90" height="80" viewBox="0 0 90 80" style={{ overflow: 'visible' }}>
        {/* Opis nad symbolem */}
        <text x="45" y="-4" textAnchor="middle" fontSize="10" fill="#333" fontWeight="bold">{data.label}</text>

        {/* Obudowa */}
        <rect x="2" y="0" width="86" height="80" fill="none" stroke="#333" strokeWidth="1" rx="2" />

        {/* 4 listwy — kazda to pionowy pasek z 5 zaciskami (sruby) */}
        {POLES.map((p) => (
          <g key={p.id}>
            {/* Listwa */}
            <rect x={p.x - 6} y="4" width="12" height="72" fill="none" stroke={p.color} strokeWidth="1" rx="1" />

            {/* Zacisk wejsciowy (gorny, wiekszy) */}
            <rect x={p.x - 4} y="6" width="8" height="10" fill={p.color} fillOpacity="0.3" stroke={p.color} strokeWidth="0.8" rx="1" />
            <line x1={p.x - 2} y1="11" x2={p.x + 2} y2="11" stroke={p.color} strokeWidth="1" />

            {/* 4 zaciski wyjsciowe */}
            {[0, 1, 2, 3].map((i) => {
              const cy = 24 + i * 14;
              return (
                <g key={i}>
                  <rect x={p.x - 3} y={cy} width="6" height="8" fill="none" stroke={p.color} strokeWidth="0.6" rx="0.5" />
                  <line x1={p.x - 1} y1={cy + 4} x2={p.x + 1} y2={cy + 4} stroke={p.color} strokeWidth="0.6" />
                </g>
              );
            })}
          </g>
        ))}
      </svg>

      {/* 4x4 wyjscia na dole — pogrupowane po biegunach */}
      {POLES.map((p) => (
        <Handle key={`out1-${p.id}`} type="source" position={Position.Bottom} id={`out1-${p.id}`}
          className="!w-1.5 !h-1.5" style={{ backgroundColor: p.color, left: p.x - 10 }} />
      ))}
      {POLES.map((p) => (
        <Handle key={`out2-${p.id}`} type="source" position={Position.Bottom} id={`out2-${p.id}`}
          className="!w-1.5 !h-1.5" style={{ backgroundColor: p.color, left: p.x }} />
      ))}
      {POLES.map((p) => (
        <Handle key={`out3-${p.id}`} type="source" position={Position.Bottom} id={`out3-${p.id}`}
          className="!w-1.5 !h-1.5" style={{ backgroundColor: p.color, left: p.x + 10 }} />
      ))}
      {POLES.map((p) => (
        <Handle key={`out4-${p.id}`} type="source" position={Position.Bottom} id={`out4-${p.id}`}
          className="!w-1.5 !h-1.5" style={{ backgroundColor: p.color, left: p.x + 20 }} />
      ))}
    </div>
  );
}
