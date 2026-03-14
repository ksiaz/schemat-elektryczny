import { Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { AcHandles } from './AcHandles.tsx';

type ContactorNodeType = Node<SchematicNodeData, 'contactor'>;

export function ContactorNode({ data, selected }: NodeProps<ContactorNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <AcHandles type="source" position={Position.Top} prefix="in" />
      <svg width="70" height="60" viewBox="0 0 70 60">
        <line x1="35" y1="0" x2="35" y2="10" stroke="#333" strokeWidth="1.5" />
        <line x1="31" y1="10" x2="39" y2="10" stroke="#333" strokeWidth="1.5" />
        <line x1="35" y1="10" x2="45" y2="26" stroke="#333" strokeWidth="2" />
        <circle cx="35" cy="28" r="2" fill="#333" />
        <line x1="35" y1="30" x2="35" y2="34" stroke="#333" strokeWidth="1.5" />
        <rect x="25" y="34" width="20" height="14" fill="none" stroke="#333" strokeWidth="1.5" rx="1" />
        <path d="M 30,41 Q 35,36 40,41" fill="none" stroke="#333" strokeWidth="1" />
        <line x1="35" y1="48" x2="35" y2="60" stroke="#333" strokeWidth="1.5" />
      </svg>
      <div className="text-xs font-bold text-gray-800">{data.label}</div>
      {data.parameters.ratingCurrent && (
        <div className="text-[10px] text-gray-500">{String(data.parameters.ratingCurrent)}A</div>
      )}
      <AcHandles type="source" position={Position.Bottom} prefix="out" />
    </div>
  );
}
