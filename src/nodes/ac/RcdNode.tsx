import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type RcdNodeType = Node<SchematicNodeData, 'rcd'>;

export function RcdNode({ data, selected }: NodeProps<RcdNodeType>) {
  const poles = String(data.parameters.poles || '4P');
  const is4P = poles === '4P';
  const wires = is4P
    ? [{ id: 'L1', color: WIRE_COLORS.L1, offset: 10 }, { id: 'L2', color: WIRE_COLORS.L2, offset: 30 }, { id: 'L3', color: WIRE_COLORS.L3, offset: 50 }, { id: 'N', color: WIRE_COLORS.N, offset: 70 }]
    : [{ id: 'L1', color: WIRE_COLORS.L1, offset: 30 }, { id: 'N', color: WIRE_COLORS.N, offset: 50 }];

  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 80 }}>
      {wires.map((w) => (
        <Handle key={`in-${w.id}`} type="target" position={Position.Top} id={`in-${w.id}`}
          className="!w-1.5 !h-1.5" style={{ backgroundColor: w.color, left: w.offset }} />
      ))}
      <svg width="80" height="55" viewBox="0 0 80 55">
        <line x1="40" y1="0" x2="40" y2="10" stroke="#333" strokeWidth="1.5" />
        <line x1="40" y1="10" x2="50" y2="26" stroke="#333" strokeWidth="2" />
        <circle cx="40" cy="30" r="2" fill="#333" />
        <circle cx="27" cy="20" r="6" fill="none" stroke="#333" strokeWidth="0.8" />
        <line x1="27" y1="14" x2="27" y2="26" stroke="#333" strokeWidth="0.8" />
        <line x1="40" y1="32" x2="40" y2="55" stroke="#333" strokeWidth="1.5" />
      </svg>
      <div className="text-xs font-bold text-gray-800">{data.label}</div>
      {data.parameters.rcdType && (
        <div className="text-[10px] text-gray-500">
          {String(data.parameters.rcdType)} {String(data.parameters.ratingCurrent ?? '')}A {String(data.parameters.sensitivityCurrent ?? '')}mA
        </div>
      )}
      {wires.map((w) => (
        <Handle key={`out-${w.id}`} type="source" position={Position.Bottom} id={`out-${w.id}`}
          className="!w-1.5 !h-1.5" style={{ backgroundColor: w.color, left: w.offset }} />
      ))}
    </div>
  );
}
