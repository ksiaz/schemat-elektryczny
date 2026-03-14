import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type AcBusbarNodeType = Node<SchematicNodeData, 'acBusbar'>;

// Szyna zbiorcza AC wg IEC 60617 — gruba linia pozioma
export function AcBusbarNode({ data, selected }: NodeProps<AcBusbarNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      <Handle type="target" position={Position.Top} id="in" className="!bg-gray-400 !w-2 !h-2" />

      <svg width="120" height="16" viewBox="0 0 120 16">
        <rect x="0" y="5" width="120" height="6" fill="white" rx="1" />
      </svg>

      <div className="text-xs font-bold mt-1 text-gray-200">{data.label}</div>

      <Handle type="source" position={Position.Bottom} id="out-1" className="!bg-gray-400 !w-2 !h-2" style={{ left: '20%' }} />
      <Handle type="source" position={Position.Bottom} id="out-2" className="!bg-gray-400 !w-2 !h-2" style={{ left: '40%' }} />
      <Handle type="source" position={Position.Bottom} id="out-3" className="!bg-gray-400 !w-2 !h-2" style={{ left: '60%' }} />
      <Handle type="source" position={Position.Bottom} id="out-4" className="!bg-gray-400 !w-2 !h-2" style={{ left: '80%' }} />
    </div>
  );
}
