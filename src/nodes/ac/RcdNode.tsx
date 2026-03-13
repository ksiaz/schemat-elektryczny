import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type RcdNodeType = Node<SchematicNodeData, 'rcd'>;

export function RcdNode({ data, selected }: NodeProps<RcdNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      <Handle type="target" position={Position.Top} id="in" className="!bg-gray-700 !w-2 !h-2" />

      {/* Symbol RCD PN-EN 60617 */}
      <svg width="40" height="60" viewBox="0 0 40 60">
        <line x1="20" y1="0" x2="20" y2="10" stroke="black" strokeWidth="1.5" />
        <rect x="5" y="10" width="30" height="35" fill="white" stroke="black" strokeWidth="1.5" />
        <circle cx="20" cy="27" r="8" fill="none" stroke="black" strokeWidth="1" />
        <line x1="20" y1="19" x2="20" y2="35" stroke="black" strokeWidth="1" />
        <line x1="28" y1="20" x2="35" y2="40" stroke="black" strokeWidth="0.8" />
        <line x1="20" y1="45" x2="20" y2="60" stroke="black" strokeWidth="1.5" />
      </svg>

      <div className="text-xs font-bold mt-1">{data.label}</div>
      {data.parameters.rcdType && (
        <div className="text-[10px] text-gray-500">
          Typ {String(data.parameters.rcdType)} {String(data.parameters.ratingCurrent ?? '')}A {String(data.parameters.sensitivityCurrent ?? '')}mA
        </div>
      )}

      <Handle type="source" position={Position.Bottom} id="out" className="!bg-gray-700 !w-2 !h-2" />
    </div>
  );
}
