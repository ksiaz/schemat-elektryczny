import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type SpdAcNodeType = Node<SchematicNodeData, 'spdAc'>;

export function SpdAcNode({ data, selected }: NodeProps<SpdAcNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 80 }}>
      <Handle type="source" position={Position.Top} id="in-L1" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L1, left: 10 }} />
      <Handle type="source" position={Position.Top} id="in-L2" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L2, left: 30 }} />
      <Handle type="source" position={Position.Top} id="in-L3" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L3, left: 50 }} />
      <Handle type="source" position={Position.Top} id="in-N" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 70 }} />

      <svg width="80" height="55" viewBox="0 0 80 55">
        <line x1="40" y1="0" x2="40" y2="6" stroke="#333" strokeWidth="1.5" />
        <rect x="10" y="6" width="60" height="34" fill="none" stroke="#333" strokeWidth="1.5" rx="1" />
        <polyline points="44,12 38,22 44,22 36,34" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
        <polygon points="36,34 39,30 38,33" fill="#333" />
        <line x1="40" y1="40" x2="40" y2="55" stroke="#333" strokeWidth="1.5" />
      </svg>

      <div className="text-xs font-bold text-gray-800">{data.label}</div>
      {data.parameters.spdType && <div className="text-[10px] text-gray-500">{String(data.parameters.spdType)}</div>}

      <Handle type="source" position={Position.Bottom} id="out-PE" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.PE, left: 40 }} />
    </div>
  );
}
