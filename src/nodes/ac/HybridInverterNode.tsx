import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { AcHandles } from './AcHandles.tsx';
import { WIRE_COLORS } from '../../constants/index.ts';

type HybridInverterNodeType = Node<SchematicNodeData, 'hybridInverter'>;

export function HybridInverterNode({ data, selected }: NodeProps<HybridInverterNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 200 }}>
      {/* MPPT1 +/- */}
      <Handle type="target" position={Position.Top} id="mppt1-plus" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.DC, left: 30 }} />
      <Handle type="target" position={Position.Top} id="mppt1-minus" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 50 }} />
      {/* MPPT2 +/- */}
      <Handle type="target" position={Position.Top} id="mppt2-plus" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.DC, left: 110 }} />
      <Handle type="target" position={Position.Top} id="mppt2-minus" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 130 }} />

      {/* BAT +, BAT -, COM — lewy bok, obok siebie co 20px */}
      <Handle type="target" position={Position.Left} id="bat-plus" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.DC, top: 30 }} />
      <Handle type="target" position={Position.Left} id="bat-minus" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, top: 50 }} />
      <Handle type="source" position={Position.Left} id="com" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#999', top: 70 }} />

      {/* PE obudowy lewy bok — nizej */}
      <Handle type="source" position={Position.Left} id="pe-housing" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#228B22', top: 130 }} />

      <svg width="200" height="150" viewBox="0 0 200 150">
        <rect x="6" y="6" width="188" height="138" fill="none" stroke="#333" strokeWidth="1.5" />

        {/* MPPT etykiety */}
        <text x="39" y="20" textAnchor="middle" fontSize="9" fill="#999" fontFamily="monospace">MPPT1</text>
        <text x="30" y="32" textAnchor="middle" fontSize="11" fill="#FF0000" fontWeight="bold">+</text>
        <text x="50" y="32" textAnchor="middle" fontSize="11" fill="#0000CD" fontWeight="bold">−</text>

        <text x="119" y="20" textAnchor="middle" fontSize="9" fill="#999" fontFamily="monospace">MPPT2</text>
        <text x="110" y="32" textAnchor="middle" fontSize="11" fill="#FF0000" fontWeight="bold">+</text>
        <text x="130" y="32" textAnchor="middle" fontSize="11" fill="#0000CD" fontWeight="bold">−</text>

        {/* BAT etykiety — wyrownane do styków left: 0, top: 30/50/70 */}
        <text x="18" y="34" textAnchor="middle" fontSize="10" fill="#FF0000" fontWeight="bold">+</text>
        <text x="18" y="54" textAnchor="middle" fontSize="10" fill="#0000CD" fontWeight="bold">−</text>
        <text x="22" y="73" textAnchor="middle" fontSize="8" fill="#999">COM</text>
        <text x="18" y="18" fontSize="8" fill="#c97706" fontFamily="monospace">BAT</text>

        <text x="170" y="28" textAnchor="middle" fontSize="14" fill="#333" fontWeight="bold" fontFamily="monospace">DC</text>

        {/* Linia podzialu DC/AC */}
        <line x1="6" y1="75" x2="194" y2="75" stroke="#333" strokeWidth="0.5" strokeDasharray="4,3" />

        <text x="40" y="95" fontSize="14" fill="#333" fontWeight="bold" fontFamily="monospace">AC</text>
        <path d="M 70,92 Q 85,82 100,92 Q 115,102 130,92" fill="none" stroke="#333" strokeWidth="1.2" />

        <text x="60" y="130" textAnchor="middle" fontSize="10" fill="#666" fontFamily="monospace">GRID</text>
        <text x="155" y="130" textAnchor="middle" fontSize="10" fill="#666" fontFamily="monospace">BACKUP</text>
        <line x1="108" y1="75" x2="108" y2="144" stroke="#333" strokeWidth="0.5" strokeDasharray="2,2" />
      </svg>

      <div className="text-xs font-bold text-gray-800 mt-1">{data.label}</div>
      {data.parameters.model && <div className="text-[10px] text-gray-500">{String(data.parameters.model)}</div>}
      {data.parameters.power && <div className="text-[10px] text-gray-500">{String(data.parameters.power)} kW</div>}

      {/* Grid AC — dol */}
      <AcHandles type="source" position={Position.Bottom} prefix="grid" />

      {/* Backup AC — prawy bok co 20px */}
      <Handle type="source" position={Position.Right} id="backup-L1" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L1, top: 80 }} />
      <Handle type="source" position={Position.Right} id="backup-L2" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L2, top: 100 }} />
      <Handle type="source" position={Position.Right} id="backup-L3" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L3, top: 110 }} />
      <Handle type="source" position={Position.Right} id="backup-N" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, top: 120 }} />
      <Handle type="source" position={Position.Right} id="backup-PE" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.PE, top: 130 }} />
    </div>
  );
}
