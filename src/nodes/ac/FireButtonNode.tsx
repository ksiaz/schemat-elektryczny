import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type FireButtonNodeType = Node<SchematicNodeData, 'fireButton'>;

// Przycisk przeciwpozarowy PPOZ — kolko z krzyzem
export function FireButtonNode({ data, selected }: NodeProps<FireButtonNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 50 }}>
      <Handle type="target" position={Position.Top} id="in-L" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#FF0000', left: 20 }} />
      <Handle type="target" position={Position.Top} id="in-N" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#0000CD', left: 40 }} />

      <svg width="50" height="50" viewBox="0 0 50 50">
        {/* Kolko */}
        <circle cx="25" cy="25" r="18" fill="none" stroke="#FF0000" strokeWidth="2" />
        {/* Krzyz wewnatrz */}
        <line x1="15" y1="15" x2="35" y2="35" stroke="#FF0000" strokeWidth="2" />
        <line x1="35" y1="15" x2="15" y2="35" stroke="#FF0000" strokeWidth="2" />
      </svg>

      <div className="text-xs font-bold text-red-600">{data.label}</div>

      <Handle type="source" position={Position.Bottom} id="out-L" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#FF0000', left: 20 }} />
      <Handle type="source" position={Position.Bottom} id="out-N" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#0000CD', left: 40 }} />
    </div>
  );
}
