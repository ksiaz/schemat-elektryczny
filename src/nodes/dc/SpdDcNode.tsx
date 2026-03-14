import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type SpdDcNodeType = Node<SchematicNodeData, 'spdDc'>;

export function SpdDcNode({ data, selected }: NodeProps<SpdDcNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 90 }}>
      <Handle type="source" position={Position.Top} id="dc-plus-1" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.DC, left: 10 }} />
      <Handle type="source" position={Position.Top} id="dc-plus-2" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.DC, left: 30 }} />
      <Handle type="source" position={Position.Top} id="dc-minus-1" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 60 }} />
      <Handle type="source" position={Position.Top} id="dc-minus-2" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 80 }} />

      <div className="text-xs font-bold text-gray-800">{data.label}</div>
      {data.parameters.spdType && <div className="text-[10px] text-gray-500">{String(data.parameters.spdType)}</div>}

      <svg width="90" height="70" viewBox="0 0 90 70">
        <text x="11" y="10" textAnchor="middle" fontSize="10" fill="#FF0000" fontWeight="bold">+</text>
        <text x="30" y="10" textAnchor="middle" fontSize="10" fill="#FF0000" fontWeight="bold">+</text>
        <text x="60" y="10" textAnchor="middle" fontSize="10" fill="#0000CD" fontWeight="bold">−</text>
        <text x="79" y="10" textAnchor="middle" fontSize="10" fill="#0000CD" fontWeight="bold">−</text>
        <line x1="11" y1="12" x2="11" y2="18" stroke="#FF0000" strokeWidth="1" />
        <line x1="30" y1="12" x2="30" y2="18" stroke="#FF0000" strokeWidth="1" />
        <line x1="60" y1="12" x2="60" y2="18" stroke="#0000CD" strokeWidth="1" />
        <line x1="79" y1="12" x2="79" y2="18" stroke="#0000CD" strokeWidth="1" />
        <rect x="5" y="18" width="80" height="34" fill="none" stroke="#333" strokeWidth="1.5" rx="1" />
        <polyline points="50,24 44,34 50,34 42,48" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
        <polygon points="42,48 45,44 44,47" fill="#333" />
        <line x1="45" y1="52" x2="45" y2="70" stroke="#228B22" strokeWidth="1.5" />
      </svg>

      <Handle type="source" position={Position.Bottom} id="pe" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.PE, left: 50 }} />
    </div>
  );
}
