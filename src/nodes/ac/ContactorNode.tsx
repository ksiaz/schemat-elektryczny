import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type ContactorNodeType = Node<SchematicNodeData, 'contactor'>;

// Stycznik — prostokat z cewka (polkolko)
export function ContactorNode({ data, selected }: NodeProps<ContactorNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      <Handle type="target" position={Position.Top} id="in" className="!bg-gray-700 !w-2 !h-2" />

      <svg width="36" height="55" viewBox="0 0 36 55">
        <line x1="18" y1="0" x2="18" y2="10" stroke="black" strokeWidth="1.5" />
        {/* Styk ruchomy */}
        <line x1="18" y1="10" x2="26" y2="22" stroke="black" strokeWidth="1.5" />
        <circle cx="18" cy="27" r="2" fill="black" />
        {/* Cewka — prostokat z polkolkiem */}
        <rect x="8" y="32" width="20" height="12" fill="white" stroke="black" strokeWidth="1" />
        <path d="M14,38 Q18,34 22,38" fill="none" stroke="black" strokeWidth="1" />
        <line x1="18" y1="44" x2="18" y2="55" stroke="black" strokeWidth="1.5" />
      </svg>

      <div className="text-xs font-bold mt-1">{data.label}</div>
      {data.parameters.ratingCurrent && (
        <div className="text-[10px] text-gray-500">{String(data.parameters.ratingCurrent)}A</div>
      )}

      <Handle type="source" position={Position.Bottom} id="out" className="!bg-gray-700 !w-2 !h-2" />
    </div>
  );
}
