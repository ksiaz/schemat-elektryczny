import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type MeterNodeType = Node<SchematicNodeData, 'meter'>;

// Licznik energii — prostokat z "kWh" (styl blokowy pogladowy)
export function MeterNode({ data, selected }: NodeProps<MeterNodeType>) {
  const isBidirectional = data.parameters.bidirectional === 'Tak';

  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <Handle type="target" position={Position.Top} id="in" className="!bg-gray-700 !w-2 !h-2" />
      <Handle type="target" position={Position.Left} id="in-left" className="!bg-gray-700 !w-2 !h-2" />

      <svg width="60" height="44" viewBox="0 0 60 44">
        <rect x="2" y="2" width="56" height="40" fill="none" stroke="white" strokeWidth="1.5" />
        <text x="30" y="20" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold" fontFamily="monospace">kWh</text>
        {isBidirectional && (
          <g>
            <line x1="14" y1="32" x2="46" y2="32" stroke="white" strokeWidth="0.8" />
            <polygon points="14,32 18,30 18,34" fill="white" />
            <polygon points="46,32 42,30 42,34" fill="white" />
          </g>
        )}
      </svg>

      <div className="text-xs font-bold mt-1 text-gray-200">{data.label}</div>
      {data.parameters.meterType && (
        <div className="text-[10px] text-gray-400">{String(data.parameters.meterType)}</div>
      )}

      <Handle type="source" position={Position.Bottom} id="out" className="!bg-gray-700 !w-2 !h-2" />
      <Handle type="source" position={Position.Right} id="out-right" className="!bg-gray-700 !w-2 !h-2" />
    </div>
  );
}
