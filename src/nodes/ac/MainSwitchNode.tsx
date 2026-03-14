import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type MainSwitchNodeType = Node<SchematicNodeData, 'mainSwitch'>;

const POLES_MAP: Record<string, { id: string; color: string }[]> = {
  '1P': [{ id: 'L1', color: WIRE_COLORS.L1 }],
  '2P': [{ id: 'L1', color: WIRE_COLORS.L1 }, { id: 'N', color: WIRE_COLORS.N }],
  '3P': [{ id: 'L1', color: WIRE_COLORS.L1 }, { id: 'L2', color: WIRE_COLORS.L2 }, { id: 'L3', color: WIRE_COLORS.L3 }],
  '4P': [{ id: 'L1', color: WIRE_COLORS.L1 }, { id: 'L2', color: WIRE_COLORS.L2 }, { id: 'L3', color: WIRE_COLORS.L3 }, { id: 'N', color: WIRE_COLORS.N }],
};

export function MainSwitchNode({ data, selected }: NodeProps<MainSwitchNodeType>) {
  const poles = String(data.parameters.poles || '4P');
  const wires = POLES_MAP[poles] ?? POLES_MAP['4P'];

  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      {wires.map((w, i) => (
        <Handle key={`in-${w.id}`} type="target" position={Position.Top} id={`in-${w.id}`}
          className="!w-1.5 !h-1.5" style={{ backgroundColor: w.color, left: `${20 + i * (60 / Math.max(wires.length - 1, 1))}%` }} />
      ))}

      <svg width="70" height="50" viewBox="0 0 70 50">
        <line x1="35" y1="0" x2="35" y2="14" stroke="#333" strokeWidth="1.5" />
        <line x1="31" y1="14" x2="39" y2="14" stroke="#333" strokeWidth="1.5" />
        <line x1="35" y1="14" x2="47" y2="32" stroke="#333" strokeWidth="2" />
        <circle cx="35" cy="35" r="2" fill="#333" />
        <line x1="35" y1="37" x2="35" y2="50" stroke="#333" strokeWidth="1.5" />
      </svg>

      <div className="text-xs font-bold text-gray-800">{data.label}</div>
      {data.parameters.ratingCurrent && (
        <div className="text-[10px] text-gray-500">{String(data.parameters.ratingCurrent)}A {poles}</div>
      )}

      {wires.map((w, i) => (
        <Handle key={`out-${w.id}`} type="source" position={Position.Bottom} id={`out-${w.id}`}
          className="!w-1.5 !h-1.5" style={{ backgroundColor: w.color, left: `${20 + i * (60 / Math.max(wires.length - 1, 1))}%` }} />
      ))}
    </div>
  );
}
