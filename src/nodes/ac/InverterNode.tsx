import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type InverterNodeType = Node<SchematicNodeData, 'inverter'>;

// Falownik — prostokat z trojkatem DC/AC (styl blokowy jak na schematach pogladowych)
export function InverterNode({ data, selected }: NodeProps<InverterNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <Handle type="target" position={Position.Top} id="dc-in" className="!bg-red-500 !w-2 !h-2" />

      <svg width="70" height="70" viewBox="0 0 70 70">
        {/* Prostokat obudowy */}
        <rect x="5" y="5" width="60" height="60" fill="#252540" stroke="white" strokeWidth="1.5" />

        {/* Trojkat — symbol konwersji DC/AC */}
        <polygon points="35,12 58,55 12,55" fill="none" stroke="white" strokeWidth="1.2" />

        {/* DC u gory */}
        <text x="35" y="28" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold" fontFamily="monospace">DC</text>

        {/* AC u dolu */}
        <text x="35" y="50" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold" fontFamily="monospace">AC</text>
      </svg>

      <div className="text-xs font-bold mt-1 text-gray-200">{data.label}</div>
      {data.parameters.model && (
        <div className="text-[10px] text-gray-400">{String(data.parameters.model)}</div>
      )}
      {data.parameters.power && (
        <div className="text-[10px] text-gray-400">{String(data.parameters.power)} kW</div>
      )}

      <Handle type="source" position={Position.Bottom} id="ac-out" className="!bg-gray-500 !w-2 !h-2" />
    </div>
  );
}
