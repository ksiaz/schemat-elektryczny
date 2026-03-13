import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type MeterNodeType = Node<SchematicNodeData, 'meter'>;

export function MeterNode({ data, selected }: NodeProps<MeterNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      <Handle type="target" position={Position.Top} id="in" className="!bg-gray-700 !w-2 !h-2" />

      {/* Licznik — kolko z kWh */}
      <svg width="44" height="50" viewBox="0 0 44 50">
        <line x1="22" y1="0" x2="22" y2="8" stroke="black" strokeWidth="1.5" />
        <circle cx="22" cy="25" r="16" fill="white" stroke="black" strokeWidth="1.5" />
        <text x="22" y="23" textAnchor="middle" fontSize="7" fontFamily="monospace">kWh</text>
        <text x="22" y="31" textAnchor="middle" fontSize="6" fill="#666">⇌</text>
        <line x1="22" y1="41" x2="22" y2="50" stroke="black" strokeWidth="1.5" />
      </svg>

      <div className="text-xs font-bold mt-1">{data.label}</div>
      {data.parameters.model && (
        <div className="text-[10px] text-gray-500">{String(data.parameters.model)}</div>
      )}

      <Handle type="source" position={Position.Bottom} id="out" className="!bg-gray-700 !w-2 !h-2" />
    </div>
  );
}
