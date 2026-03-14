import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type RcdNodeType = Node<SchematicNodeData, 'rcd'>;

// Wylacznik roznicowopradowy RCD — prostokat z napisem "RCD" (styl blokowy)
export function RcdNode({ data, selected }: NodeProps<RcdNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <Handle type="target" position={Position.Top} id="in" className="!bg-gray-700 !w-2 !h-2" />
      <Handle type="target" position={Position.Left} id="in-left" className="!bg-gray-700 !w-2 !h-2" />

      <svg width="60" height="40" viewBox="0 0 60 40">
        <rect x="2" y="2" width="56" height="36" fill="none" stroke="white" strokeWidth="1.5" />
        <text x="30" y="24" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold" fontFamily="monospace">RCD</text>
      </svg>

      <div className="text-xs font-bold mt-1 text-gray-200">{data.label}</div>
      {data.parameters.rcdType && (
        <div className="text-[10px] text-gray-400">
          {String(data.parameters.rcdType)} {String(data.parameters.ratingCurrent ?? '')}A {String(data.parameters.sensitivityCurrent ?? '')}mA
        </div>
      )}

      <Handle type="source" position={Position.Bottom} id="out" className="!bg-gray-700 !w-2 !h-2" />
      <Handle type="source" position={Position.Right} id="out-right" className="!bg-gray-700 !w-2 !h-2" />
    </div>
  );
}
