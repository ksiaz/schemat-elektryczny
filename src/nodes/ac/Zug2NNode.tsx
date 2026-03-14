import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type Zug2NNodeType = Node<SchematicNodeData, 'zug2N'>;

// ZUG-2 N — zacisk srubowy przelotowy, 2 gora + 2 dol
export function Zug2NNode({ data, selected }: NodeProps<Zug2NNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 40 }}>
      <Handle type="source" position={Position.Top} id="in-1" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 10 }} />
      <Handle type="source" position={Position.Top} id="in-2" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 30 }} />

      <svg width="40" height="30" viewBox="0 0 40 30">
        {/* Prostokat — zacisk */}
        <rect x="3" y="5" width="34" height="20" fill="none" stroke={WIRE_COLORS.N} strokeWidth="1.5" />
        {/* 2 sruby */}
        <circle cx="13" cy="15" r="3.5" fill="none" stroke={WIRE_COLORS.N} strokeWidth="1" />
        <line x1="10" y1="15" x2="16" y2="15" stroke={WIRE_COLORS.N} strokeWidth="1" />
        <circle cx="27" cy="15" r="3.5" fill="none" stroke={WIRE_COLORS.N} strokeWidth="1" />
        <line x1="24" y1="15" x2="30" y2="15" stroke={WIRE_COLORS.N} strokeWidth="1" />
        {/* Linie przelotowe */}
        <line x1="10" y1="0" x2="10" y2="5" stroke={WIRE_COLORS.N} strokeWidth="1.5" />
        <line x1="30" y1="0" x2="30" y2="5" stroke={WIRE_COLORS.N} strokeWidth="1.5" />
        <line x1="10" y1="25" x2="10" y2="30" stroke={WIRE_COLORS.N} strokeWidth="1.5" />
        <line x1="30" y1="25" x2="30" y2="30" stroke={WIRE_COLORS.N} strokeWidth="1.5" />
      </svg>

      <div className="text-[9px] font-bold" style={{ color: WIRE_COLORS.N }}>{data.label}</div>

      <Handle type="source" position={Position.Bottom} id="out-1" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 10 }} />
      <Handle type="source" position={Position.Bottom} id="out-2" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 30 }} />
    </div>
  );
}
