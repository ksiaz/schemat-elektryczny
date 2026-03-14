import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type McbNodeType = Node<SchematicNodeData, 'mcb'>;

const POLES_MAP: Record<string, { id: string; color: string; offset: number }[]> = {
  '1P': [{ id: 'L1', color: WIRE_COLORS.L1, offset: 40 }],
  '2P': [{ id: 'L1', color: WIRE_COLORS.L1, offset: 30 }, { id: 'N', color: WIRE_COLORS.N, offset: 50 }],
  '3P': [{ id: 'L1', color: WIRE_COLORS.L1, offset: 20 }, { id: 'L2', color: WIRE_COLORS.L2, offset: 40 }, { id: 'L3', color: WIRE_COLORS.L3, offset: 60 }],
  '4P': [{ id: 'L1', color: WIRE_COLORS.L1, offset: 10 }, { id: 'L2', color: WIRE_COLORS.L2, offset: 30 }, { id: 'L3', color: WIRE_COLORS.L3, offset: 50 }, { id: 'N', color: WIRE_COLORS.N, offset: 70 }],
};

export function McbNode({ data, selected }: NodeProps<McbNodeType>) {
  const poles = String(data.parameters.poles || '3P');
  const wires = POLES_MAP[poles] ?? POLES_MAP['3P'];
  const label = data.parameters.curve
    ? `${String(data.parameters.curve)}${String(data.parameters.ratingCurrent ?? '')}A`
    : `${String(data.parameters.ratingCurrent ?? '')}A`;

  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 80 }}>
      {wires.map((w) => (
        <Handle key={`in-${w.id}`} type="source" position={Position.Top} id={`in-${w.id}`}
          className="!w-1.5 !h-1.5" style={{ backgroundColor: w.color, left: w.offset }} />
      ))}

      <svg width="80" height="80" viewBox="0 0 80 80" style={{ overflow: 'visible' }}>
        {/* Opis nad symbolem — wewnatrz SVG zeby nie przesuwac handle'i */}
        <text x="40" y="-14" textAnchor="middle" fontSize="11" fill="#333" fontWeight="bold">{data.label}</text>
        <text x="40" y="-4" textAnchor="middle" fontSize="9" fill="#888">{label} {poles}</text>

        {wires.map((w) => (
          <g key={w.id}>
            <line x1={w.offset} y1="0" x2={w.offset} y2="14" stroke={w.color} strokeWidth="1.5" />
            <line x1={w.offset} y1="14" x2={w.offset + 10} y2="35" stroke="#333" strokeWidth="2" />
            <rect x={w.offset + 6} y="24" width="5" height="4" fill="none" stroke="#333" strokeWidth="0.8" />
            <path d={`M ${w.offset - 3},40 A 4,4 0 0,1 ${w.offset + 5},40`} fill="none" stroke="#333" strokeWidth="0.8" />
            <circle cx={w.offset} cy="44" r="2" fill="#333" />
            <line x1={w.offset} y1="46" x2={w.offset} y2="80" stroke={w.color} strokeWidth="1.5" />
          </g>
        ))}

        {wires.length > 1 && (
          <line
            x1={wires[0].offset + 5} y1="26"
            x2={wires[wires.length - 1].offset + 5} y2="26"
            stroke="#333" strokeWidth="0.8" strokeDasharray="3,2"
          />
        )}
      </svg>

      {wires.map((w) => (
        <Handle key={`out-${w.id}`} type="source" position={Position.Bottom} id={`out-${w.id}`}
          className="!w-1.5 !h-1.5" style={{ backgroundColor: w.color, left: w.offset }} />
      ))}
    </div>
  );
}
