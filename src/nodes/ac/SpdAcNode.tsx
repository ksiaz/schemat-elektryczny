import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type SpdAcNodeType = Node<SchematicNodeData, 'spdAc'>;

export function SpdAcNode({ data, selected }: NodeProps<SpdAcNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      <Handle type="target" position={Position.Top} id="in" className="!bg-gray-700 !w-2 !h-2" />

      <svg width="36" height="50" viewBox="0 0 36 50">
        <line x1="18" y1="0" x2="18" y2="8" stroke="black" strokeWidth="1.5" />
        <rect x="4" y="8" width="28" height="30" fill="white" stroke="black" strokeWidth="1.5" />
        <polyline points="20,14 14,24 20,24 14,34" fill="none" stroke="black" strokeWidth="1.5" />
        <line x1="18" y1="38" x2="18" y2="50" stroke="black" strokeWidth="1.5" />
      </svg>

      <div className="text-xs font-bold mt-1">{data.label}</div>
      {data.parameters.spdType && (
        <div className="text-[10px] text-gray-500">{String(data.parameters.spdType)}</div>
      )}

      <Handle type="source" position={Position.Bottom} id="out" className="!bg-gray-700 !w-2 !h-2" />
    </div>
  );
}
