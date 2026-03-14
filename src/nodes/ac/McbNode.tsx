import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type McbNodeType = Node<SchematicNodeData, 'mcb'>;

// MCB — ilosc zaciskow wg biegunow (1P/2P/3P/4P)
const POLES_MAP: Record<string, { id: string; color: string }[]> = {
  '1P': [{ id: 'L1', color: WIRE_COLORS.L1 }],
  '2P': [{ id: 'L1', color: WIRE_COLORS.L1 }, { id: 'N', color: WIRE_COLORS.N }],
  '3P': [{ id: 'L1', color: WIRE_COLORS.L1 }, { id: 'L2', color: WIRE_COLORS.L2 }, { id: 'L3', color: WIRE_COLORS.L3 }],
  '4P': [{ id: 'L1', color: WIRE_COLORS.L1 }, { id: 'L2', color: WIRE_COLORS.L2 }, { id: 'L3', color: WIRE_COLORS.L3 }, { id: 'N', color: WIRE_COLORS.N }],
};

export function McbNode({ data, selected }: NodeProps<McbNodeType>) {
  const poles = String(data.parameters.poles || '4P');
  const wires = POLES_MAP[poles] ?? POLES_MAP['4P'];
  const label = data.parameters.curve
    ? `${String(data.parameters.curve)}${String(data.parameters.ratingCurrent ?? '')}A`
    : `${String(data.parameters.ratingCurrent ?? '')}A`;

  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      {/* Zaciski wejsciowe — ilosc wg biegunow */}
      {wires.map((w, i) => (
        <Handle key={`in-${w.id}`} type="target" position={Position.Top} id={`in-${w.id}`}
          className="!w-3 !h-3" style={{ backgroundColor: w.color, left: `${20 + i * (60 / Math.max(wires.length - 1, 1))}%` }} />
      ))}

      <svg width="70" height="50" viewBox="0 0 70 50">
        <line x1="35" y1="0" x2="35" y2="14" stroke="#333" strokeWidth="1.5" />
        <line x1="35" y1="14" x2="45" y2="32" stroke="#333" strokeWidth="2" />
        <circle cx="35" cy="36" r="2" fill="#333" />
        <line x1="35" y1="38" x2="35" y2="50" stroke="#333" strokeWidth="1.5" />
      </svg>

      <div className="text-xs font-bold text-gray-800">{data.label}</div>
      <div className="text-[10px] text-gray-500">{label} {poles}</div>

      {/* Zaciski wyjsciowe */}
      {wires.map((w, i) => (
        <Handle key={`out-${w.id}`} type="source" position={Position.Bottom} id={`out-${w.id}`}
          className="!w-3 !h-3" style={{ backgroundColor: w.color, left: `${20 + i * (60 / Math.max(wires.length - 1, 1))}%` }} />
      ))}
    </div>
  );
}
