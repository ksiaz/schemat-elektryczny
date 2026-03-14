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

      <svg width="80" height="55" viewBox="0 0 80 55">
        {wires.map((w) => (
          <g key={w.id}>
            {/* Linia wejsciowa */}
            <line x1={w.offset} y1="0" x2={w.offset} y2="10" stroke={w.color} strokeWidth="1.5" />
            {/* Styk ruchomy */}
            <line x1={w.offset} y1="10" x2={w.offset + 10} y2="28" stroke="#333" strokeWidth="2" />
            {/* Wyzwalacz termiczny — prostokat na styku */}
            <rect x={w.offset + 6} y={w.offset === 20 ? 18 : 18} width="5" height="4" fill="none" stroke="#333" strokeWidth="0.8" />
            {/* Wyzwalacz elektromagnetyczny — polkole */}
            <path d={`M ${w.offset - 3},32 A 4,4 0 0,1 ${w.offset + 5},32`} fill="none" stroke="#333" strokeWidth="0.8" />
            {/* Styk dolny */}
            <circle cx={w.offset} cy="35" r="2" fill="#333" />
            <line x1={w.offset} y1="37" x2={w.offset} y2="55" stroke={w.color} strokeWidth="1.5" />
          </g>
        ))}

        {/* Linia sprzegajaca */}
        {wires.length > 1 && (
          <line
            x1={wires[0].offset + 5} y1="20"
            x2={wires[wires.length - 1].offset + 5} y2="20"
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
