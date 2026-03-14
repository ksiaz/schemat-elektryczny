import { Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { AcHandles } from './AcHandles.tsx';

type RcboNodeType = Node<SchematicNodeData, 'rcbo'>;

export function RcboNode({ data, selected }: NodeProps<RcboNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <AcHandles type="target" position={Position.Top} prefix="in" />
      <svg width="70" height="70" viewBox="0 0 70 70">
        <line x1="35" y1="0" x2="35" y2="10" stroke="#333" strokeWidth="1.5" />
        <line x1="35" y1="10" x2="45" y2="24" stroke="#333" strokeWidth="2" />
        <rect x="41" y="18" width="5" height="4" fill="none" stroke="#333" strokeWidth="1" />
        <path d="M 31,28 A 5,5 0 0,1 39,28" fill="none" stroke="#333" strokeWidth="1" />
        <circle cx="35" cy="30" r="2" fill="#333" />
        <rect x="19" y="34" width="32" height="20" fill="none" stroke="#333" strokeWidth="1.5" rx="1" />
        <circle cx="35" cy="44" r="6" fill="none" stroke="#333" strokeWidth="0.8" />
        <line x1="30" y1="38" x2="30" y2="50" stroke="#333" strokeWidth="0.6" />
        <line x1="40" y1="38" x2="40" y2="50" stroke="#333" strokeWidth="0.6" />
        <line x1="35" y1="54" x2="35" y2="70" stroke="#333" strokeWidth="1.5" />
      </svg>
      <div className="text-xs font-bold text-gray-800">{data.label}</div>
      {data.parameters.ratingCurrent && (
        <div className="text-[10px] text-gray-500">
          {data.parameters.curve ? `${String(data.parameters.curve)}` : ''}{String(data.parameters.ratingCurrent)}A
        </div>
      )}
      <AcHandles type="source" position={Position.Bottom} prefix="out" />
    </div>
  );
}
