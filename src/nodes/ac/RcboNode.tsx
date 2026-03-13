import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type RcboNodeType = Node<SchematicNodeData, 'rcbo'>;

// RCBO = RCD + MCB w jednym
export function RcboNode({ data, selected }: NodeProps<RcboNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      <Handle type="target" position={Position.Top} id="in" className="!bg-gray-700 !w-2 !h-2" />

      <svg width="40" height="65" viewBox="0 0 40 65">
        <line x1="20" y1="0" x2="20" y2="8" stroke="black" strokeWidth="1.5" />
        <rect x="5" y="8" width="30" height="42" fill="white" stroke="black" strokeWidth="1.5" />
        {/* Symbol roznicowy */}
        <circle cx="20" cy="22" r="6" fill="none" stroke="black" strokeWidth="0.8" />
        <line x1="20" y1="16" x2="20" y2="28" stroke="black" strokeWidth="0.8" />
        {/* Krzyzyk MCB */}
        <line x1="16" y1="36" x2="24" y2="36" stroke="black" strokeWidth="1" />
        <line x1="20" y1="32" x2="20" y2="40" stroke="black" strokeWidth="1" />
        <line x1="20" y1="50" x2="20" y2="65" stroke="black" strokeWidth="1.5" />
      </svg>

      <div className="text-xs font-bold mt-1">{data.label}</div>
      {data.parameters.ratingCurrent && (
        <div className="text-[10px] text-gray-500">
          {data.parameters.curve ? `${String(data.parameters.curve)}` : ''}{String(data.parameters.ratingCurrent)}A {data.parameters.sensitivityCurrent ? `${String(data.parameters.sensitivityCurrent)}mA` : ''}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} id="out" className="!bg-gray-700 !w-2 !h-2" />
    </div>
  );
}
