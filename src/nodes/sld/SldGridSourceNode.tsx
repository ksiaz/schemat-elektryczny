import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldGridSource'>;

export function SldGridSourceNode({ data, selected }: NodeProps<T>) {
  const network = String(data.parameters.network ?? '~3/N/PE 400/230 V 50 Hz');
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 80, height: 40 }}>
      <svg width="80" height="40" viewBox="0 0 80 40" style={{ overflow: 'visible' }}>
        <text x="40" y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label}</text>
        <text x="40" y="12" textAnchor="middle" fontSize="7" fill="#555">{network}</text>
        <polygon points="34,18 46,18 40,30" fill="#222" />
        <line x1="40" y1="30" x2="40" y2="40" stroke="#222" strokeWidth="1.5" />
      </svg>
      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333' }} />
    </div>
  );
}
