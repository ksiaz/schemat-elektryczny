import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldCableJunction'>;

export function SldCableJunctionNode({ data, selected }: NodeProps<T>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 60, height: 30 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333' }} />
      <svg width="60" height="30" viewBox="0 0 60 30" style={{ overflow: 'visible' }}>
        <rect x="0" y="0" width="60" height="30" fill="white" stroke="#222" strokeWidth="1.5" />
        <text x="30" y="20" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#222">{data.label}</text>
      </svg>
      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333' }} />
    </div>
  );
}
