import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldFireSwitch'>;

export function SldFireSwitchNode({ data, selected }: NodeProps<T>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 40, height: 50 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 20 }} />
      <svg width="40" height="50" viewBox="0 0 40 50" style={{ overflow: 'visible' }}>
        <text x="20" y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label}</text>
        <line x1="20" y1="0" x2="20" y2="13" stroke="#222" strokeWidth="1.5" />
        <circle cx="20" cy="25" r="10" fill="#fee2e2" stroke="#b91c1c" strokeWidth="1.5" />
        <line x1="14" y1="19" x2="26" y2="31" stroke="#b91c1c" strokeWidth="1.5" />
        <line x1="26" y1="19" x2="14" y2="31" stroke="#b91c1c" strokeWidth="1.5" />
        <line x1="20" y1="36" x2="20" y2="50" stroke="#222" strokeWidth="1.5" />
        <text x="20" y="58" textAnchor="middle" fontSize="7" fill="#888">PWP</text>
      </svg>
      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 20 }} />
    </div>
  );
}
