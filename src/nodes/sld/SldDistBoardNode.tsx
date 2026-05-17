import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldDistBoard'>;

// Rozdzielnica — prostokat z edytowalnym podpisem (domyslnie RG)
export function SldDistBoardNode({ data, selected }: NodeProps<T>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 80, height: 40 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 40 }} />
      <svg width="80" height="40" viewBox="0 0 80 40" style={{ overflow: 'visible' }}>
        <rect x="1" y="1" width="78" height="38" rx="2" fill="white" stroke="#222" strokeWidth="1.8" />
        <text x="40" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#222">{data.label}</text>
      </svg>
      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 40 }} />
    </div>
  );
}
