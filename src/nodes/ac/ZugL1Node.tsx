import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type ZugL1NodeType = Node<SchematicNodeData, 'zugL1'>;

export function ZugL1Node({ data, selected }: NodeProps<ZugL1NodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 30 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L1, left: 15 }} />
      <svg width="30" height="30" viewBox="0 0 30 30">
        <rect x="5" y="5" width="20" height="20" fill="none" stroke={WIRE_COLORS.L1} strokeWidth="1.5" />
        <text x="15" y="18" textAnchor="middle" fontSize="9" fill={WIRE_COLORS.L1} fontWeight="bold">{data.label}</text>
        <line x1="15" y1="0" x2="15" y2="5" stroke={WIRE_COLORS.L1} strokeWidth="1.5" />
        <line x1="15" y1="25" x2="15" y2="30" stroke={WIRE_COLORS.L1} strokeWidth="1.5" />
      </svg>
      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L1, left: 15 }} />
    </div>
  );
}
