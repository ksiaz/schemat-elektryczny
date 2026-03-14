import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type EvChargerNodeType = Node<SchematicNodeData, 'evCharger'>;

// Ladowarka EV — prostokat z symbolem wtyczki i EV
export function EvChargerNode({ data, selected }: NodeProps<EvChargerNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      <Handle type="target" position={Position.Top} id="in" className="!bg-gray-700 !w-1.5 !h-1.5" />

      <svg width="50" height="50" viewBox="0 0 50 50">
        <rect x="5" y="5" width="40" height="40" fill="none" stroke="#333" strokeWidth="1.5" rx="3" />
        {/* Symbol wtyczki */}
        <circle cx="25" cy="20" r="6" fill="none" stroke="#333" strokeWidth="1" />
        <line x1="25" y1="14" x2="25" y2="26" stroke="#333" strokeWidth="1" />
        <line x1="19" y1="20" x2="31" y2="20" stroke="#333" strokeWidth="1" />
        <text x="25" y="38" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#333">EV</text>
      </svg>

      <div className="text-xs font-bold mt-1 text-gray-800">{data.label}</div>
      {data.parameters.power && (
        <div className="text-[10px] text-gray-500">{String(data.parameters.power)} kW</div>
      )}

      <Handle type="source" position={Position.Bottom} id="out" className="!bg-gray-700 !w-1.5 !h-1.5" />
    </div>
  );
}
