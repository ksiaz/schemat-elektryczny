import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type AcBusbarNodeType = Node<SchematicNodeData, 'acBusbar'>;

export function AcBusbarNode({ data, selected }: NodeProps<AcBusbarNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 120 }}>
      <Handle type="source" position={Position.Top} id="in" className="!bg-gray-500 !w-1.5 !h-1.5" style={{ left: 60 }} />
      <svg width="120" height="16" viewBox="0 0 120 16">
        <rect x="0" y="5" width="120" height="6" fill="#333" rx="1" />
      </svg>
      <div className="text-xs font-bold mt-1 text-gray-800">{data.label}</div>
      <Handle type="source" position={Position.Bottom} id="out-1" className="!bg-gray-500 !w-1.5 !h-1.5" style={{ left: 20 }} />
      <Handle type="source" position={Position.Bottom} id="out-2" className="!bg-gray-500 !w-1.5 !h-1.5" style={{ left: 40 }} />
      <Handle type="source" position={Position.Bottom} id="out-3" className="!bg-gray-500 !w-1.5 !h-1.5" style={{ left: 60 }} />
      <Handle type="source" position={Position.Bottom} id="out-4" className="!bg-gray-500 !w-1.5 !h-1.5" style={{ left: 80 }} />
    </div>
  );
}
