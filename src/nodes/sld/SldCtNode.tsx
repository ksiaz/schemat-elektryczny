import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldCt'>;

export function SldCtNode({ data, selected }: NodeProps<T>) {
  const ratio = String(data.parameters.ratio ?? '100/5A');
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 40, height: 40 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333' }} />
      <svg width="40" height="40" viewBox="0 0 40 40" style={{ overflow: 'visible' }}>
        <text x="20" y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label || 'TA1'}</text>
        <circle cx="20" cy="20" r="14" fill="white" stroke="#222" strokeWidth="1.5" />
        <line x1="8" y1="32" x2="32" y2="8" stroke="#222" strokeWidth="1.5" />
        <text x="20" y="48" textAnchor="middle" fontSize="7" fill="#888">{ratio}</text>
      </svg>
      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333' }} />
    </div>
  );
}
