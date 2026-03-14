import { Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { AcHandles } from './AcHandles.tsx';

type RcdNodeType = Node<SchematicNodeData, 'rcd'>;

// Wylacznik roznicowopradowy RCD — styk z symbolem roznicowym + 5 handli AC
export function RcdNode({ data, selected }: NodeProps<RcdNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <AcHandles type="target" position={Position.Top} prefix="in" />

      <svg width="70" height="55" viewBox="0 0 70 55">
        <line x1="35" y1="0" x2="35" y2="10" stroke="#333" strokeWidth="1.5" />
        <line x1="35" y1="10" x2="45" y2="26" stroke="#333" strokeWidth="2" />
        <circle cx="35" cy="30" r="2" fill="#333" />
        <circle cx="25" cy="20" r="6" fill="none" stroke="#333" strokeWidth="0.8" />
        <line x1="25" y1="14" x2="25" y2="26" stroke="#333" strokeWidth="0.8" />
        <line x1="35" y1="32" x2="35" y2="55" stroke="#333" strokeWidth="1.5" />
      </svg>

      <div className="text-xs font-bold text-gray-800">{data.label}</div>
      {data.parameters.rcdType && (
        <div className="text-[10px] text-gray-500">
          {String(data.parameters.rcdType)} {String(data.parameters.ratingCurrent ?? '')}A {String(data.parameters.sensitivityCurrent ?? '')}mA
        </div>
      )}

      <AcHandles type="source" position={Position.Bottom} prefix="out" />
    </div>
  );
}
