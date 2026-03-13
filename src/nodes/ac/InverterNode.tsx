import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type InverterNodeType = Node<SchematicNodeData, 'inverter'>;

export function InverterNode({ data, selected }: NodeProps<InverterNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      <Handle type="target" position={Position.Top} id="dc-in" className="!bg-red-500 !w-2 !h-2" />

      {/* Symbol falownika PN-EN 60617: prostokat z DC→AC */}
      <svg width="60" height="50" viewBox="0 0 60 50">
        <rect x="5" y="5" width="50" height="40" fill="white" stroke="black" strokeWidth="1.5" />
        <text x="18" y="22" fontSize="10" fontFamily="monospace" textAnchor="middle">=</text>
        <line x1="30" y1="8" x2="30" y2="42" stroke="black" strokeWidth="0.8" strokeDasharray="2,2" />
        <text x="42" y="22" fontSize="10" fontFamily="monospace" textAnchor="middle">~</text>
        <line x1="20" y1="35" x2="40" y2="35" stroke="black" strokeWidth="1" />
        <polygon points="38,32 44,35 38,38" fill="black" />
      </svg>

      <div className="text-xs font-bold mt-1">{data.label}</div>
      {data.parameters.model && (
        <div className="text-[10px] text-gray-500">{String(data.parameters.model)}</div>
      )}
      {data.parameters.power && (
        <div className="text-[10px] text-gray-500">{String(data.parameters.power)} kW</div>
      )}

      <Handle type="source" position={Position.Bottom} id="ac-out" className="!bg-gray-500 !w-2 !h-2" />
    </div>
  );
}
