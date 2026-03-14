import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { AcHandles } from './AcHandles.tsx';
import { WIRE_COLORS } from '../../constants/index.ts';

type InverterNodeType = Node<SchematicNodeData, 'inverter'>;

// Falownik ON-grid — kazdy MPPT ma + i - (czerwony/niebieski)
export function InverterNode({ data, selected }: NodeProps<InverterNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      {/* MPPT1: + i - */}
      <Handle type="target" position={Position.Top} id="mppt1-plus" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.DC, left: '20%' }} />
      <Handle type="target" position={Position.Top} id="mppt1-minus" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: '35%' }} />
      {/* MPPT2: + i - */}
      <Handle type="target" position={Position.Top} id="mppt2-plus" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.DC, left: '65%' }} />
      <Handle type="target" position={Position.Top} id="mppt2-minus" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: '80%' }} />

      <svg width="100" height="80" viewBox="0 0 100 80">
        <rect x="4" y="4" width="92" height="72" fill="none" stroke="#333" strokeWidth="1.5" />
        {/* MPPT etykiety z +/- */}
        <text x="25" y="14" textAnchor="middle" fontSize="6" fill="#999" fontFamily="monospace">MPPT1</text>
        <text x="20" y="22" textAnchor="middle" fontSize="8" fill="#FF0000" fontWeight="bold">+</text>
        <text x="35" y="22" textAnchor="middle" fontSize="8" fill="#0000CD" fontWeight="bold">-</text>
        <text x="75" y="14" textAnchor="middle" fontSize="6" fill="#999" fontFamily="monospace">MPPT2</text>
        <text x="65" y="22" textAnchor="middle" fontSize="8" fill="#FF0000" fontWeight="bold">+</text>
        <text x="80" y="22" textAnchor="middle" fontSize="8" fill="#0000CD" fontWeight="bold">-</text>

        <text x="50" y="35" textAnchor="middle" fontSize="12" fill="#333" fontWeight="bold" fontFamily="monospace">DC</text>
        <line x1="4" y1="42" x2="96" y2="42" stroke="#333" strokeWidth="0.5" strokeDasharray="4,3" />
        <text x="50" y="57" textAnchor="middle" fontSize="12" fill="#333" fontWeight="bold" fontFamily="monospace">AC</text>
        <path d="M 30,64 Q 40,57 50,64 Q 60,71 70,64" fill="none" stroke="#333" strokeWidth="1" />
      </svg>

      <div className="text-xs font-bold text-gray-800 mt-1">{data.label}</div>
      {data.parameters.model && (
        <div className="text-[10px] text-gray-500">{String(data.parameters.model)}</div>
      )}
      {data.parameters.power && (
        <div className="text-[10px] text-gray-500">{String(data.parameters.power)} kW</div>
      )}

      <Handle type="source" position={Position.Left} id="pe-housing" className="!w-2 !h-2" style={{ backgroundColor: "#228B22", top: "50%" }} />
      <AcHandles type="source" position={Position.Bottom} prefix="out" />
    </div>
  );
}
