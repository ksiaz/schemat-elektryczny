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
        <Handle key={`in-${w.id}`} type="target" position={Position.Top} id={`in-${w.id}`}
          className="!w-1.5 !h-1.5" style={{ backgroundColor: w.color, left: w.offset }} />
      ))}

      <svg width="80" height="50" viewBox="0 0 80 50">
        {/* Krzywka na kazdy biegun */}
        {wires.map((w) => (
          <g key={w.id}>
            <line x1={w.offset} y1="0" x2={w.offset} y2="12" stroke={w.color} strokeWidth="1.5" />
            <line x1={w.offset} y1="12" x2={w.offset + 10} y2="30" stroke="#333" strokeWidth="2" />
            <circle cx={w.offset} cy="34" r="2" fill="#333" />
            <line x1={w.offset} y1="36" x2={w.offset} y2="50" stroke={w.color} strokeWidth="1.5" />
          </g>
        ))}

        {/* Linia sprzegajaca */}
        {wires.length > 1 && (
          <line
            x1={wires[0].offset + 5} y1="22"
            x2={wires[wires.length - 1].offset + 5} y2="22"
            stroke="#333" strokeWidth="0.8" strokeDasharray="3,2"
          />
        )}
      </svg>

      <div className="text-xs font-bold text-gray-800">{data.label}</div>
      <div className="text-[10px] text-gray-500">{label} {poles}</div>

      {wires.map((w) => (
        <Handle key={`out-${w.id}`} type="source" position={Position.Bottom} id={`out-${w.id}`}
          className="!w-1.5 !h-1.5" style={{ backgroundColor: w.color, left: w.offset }} />
      ))}
    </div>
  );
}
