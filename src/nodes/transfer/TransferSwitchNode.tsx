import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type TransferSwitchNodeType = Node<SchematicNodeData, 'transferSwitch'>;

export function TransferSwitchNode({ data, selected }: NodeProps<TransferSwitchNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 60 }}>
      <Handle type="target" position={Position.Top} id="in-1" className="!bg-gray-700 !w-1.5 !h-1.5" style={{ left: 20 }} />
      <Handle type="target" position={Position.Top} id="in-2" className="!bg-gray-700 !w-1.5 !h-1.5" style={{ left: 40 }} />
      <svg width="60" height="55" viewBox="0 0 60 55">
        <line x1="18" y1="0" x2="18" y2="15" stroke="#333" strokeWidth="1.5" />
        <line x1="42" y1="0" x2="42" y2="15" stroke="#333" strokeWidth="1.5" />
        <line x1="14" y1="15" x2="22" y2="15" stroke="#333" strokeWidth="1.5" />
        <circle cx="42" cy="15" r="2" fill="none" stroke="#333" strokeWidth="1" />
        <line x1="18" y1="15" x2="30" y2="32" stroke="#333" strokeWidth="2" />
        <circle cx="30" cy="34" r="2" fill="#333" />
        <line x1="30" y1="36" x2="30" y2="55" stroke="#333" strokeWidth="1.5" />
      </svg>
      <div className="text-xs font-bold text-gray-800">{data.label}</div>
      {data.parameters.switchType && (
        <div className="text-[10px] text-gray-500">{String(data.parameters.switchType)}</div>
      )}
      <Handle type="source" position={Position.Bottom} id="out" className="!bg-gray-700 !w-1.5 !h-1.5" style={{ left: 30 }} />
    </div>
  );
}
