import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type ZugNNodeType = Node<SchematicNodeData, 'zugN'>;

// ZUG N — zacisk srubowy przelotowy, 1 gora + 1 dol
export function ZugNNode({ data, selected }: NodeProps<ZugNNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 30 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 15 }} />

      <svg width="30" height="30" viewBox="0 0 30 30">
        {/* Prostokat — zacisk */}
        <rect x="5" y="5" width="20" height="20" fill="none" stroke={WIRE_COLORS.N} strokeWidth="1.5" />
        {/* Sruba — kolko w srodku */}
        <circle cx="15" cy="15" r="4" fill="none" stroke={WIRE_COLORS.N} strokeWidth="1" />
        <line x1="12" y1="15" x2="18" y2="15" stroke={WIRE_COLORS.N} strokeWidth="1" />
        {/* Linie przelotowe */}
        <line x1="15" y1="0" x2="15" y2="5" stroke={WIRE_COLORS.N} strokeWidth="1.5" />
        <line x1="15" y1="25" x2="15" y2="30" stroke={WIRE_COLORS.N} strokeWidth="1.5" />
      </svg>

      <div className="text-[9px] font-bold" style={{ color: WIRE_COLORS.N }}>{data.label}</div>

      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 15 }} />
    </div>
  );
}
