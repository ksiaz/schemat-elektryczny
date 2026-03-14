import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { AcHandles } from './AcHandles.tsx';

type InverterNodeType = Node<SchematicNodeData, 'inverter'>;

// Falownik ON-grid — DC wejscia (MPPT), 1 wyjscie AC z 5 zylami
export function InverterNode({ data, selected }: NodeProps<InverterNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <Handle type="target" position={Position.Top} id="dc-mppt1" className="!bg-red-500 !w-2 !h-2" style={{ left: '30%' }} />
      <Handle type="target" position={Position.Top} id="dc-mppt2" className="!bg-red-500 !w-2 !h-2" style={{ left: '70%' }} />

      <svg width="90" height="80" viewBox="0 0 90 80">
        <rect x="4" y="4" width="82" height="72" fill="none" stroke="#333" strokeWidth="1.5" />
        <text x="27" y="15" textAnchor="middle" fontSize="7" fill="#999" fontFamily="monospace">MPPT1</text>
        <text x="63" y="15" textAnchor="middle" fontSize="7" fill="#999" fontFamily="monospace">MPPT2</text>
        <text x="45" y="30" textAnchor="middle" fontSize="12" fill="#333" fontWeight="bold" fontFamily="monospace">DC</text>
        <line x1="4" y1="40" x2="86" y2="40" stroke="#333" strokeWidth="0.5" strokeDasharray="4,3" />
        <text x="45" y="55" textAnchor="middle" fontSize="12" fill="#333" fontWeight="bold" fontFamily="monospace">AC</text>
        <path d="M 25,62 Q 35,55 45,62 Q 55,69 65,62" fill="none" stroke="#333" strokeWidth="1" />
      </svg>

      <div className="text-xs font-bold text-gray-800 mt-1">{data.label}</div>
      {data.parameters.model && (
        <div className="text-[10px] text-gray-500">{String(data.parameters.model)}</div>
      )}
      {data.parameters.power && (
        <div className="text-[10px] text-gray-500">{String(data.parameters.power)} kW</div>
      )}

      <AcHandles type="source" position={Position.Bottom} prefix="out" />
    </div>
  );
}
