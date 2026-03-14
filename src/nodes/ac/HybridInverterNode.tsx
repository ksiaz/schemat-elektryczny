import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { AcHandles } from './AcHandles.tsx';
import { WIRE_COLORS } from '../../constants/index.ts';

type HybridInverterNodeType = Node<SchematicNodeData, 'hybridInverter'>;

export function HybridInverterNode({ data, selected }: NodeProps<HybridInverterNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 220 }}>
      {/* MPPT1 +/- u gory */}
      <Handle type="source" position={Position.Top} id="mppt1-plus" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.DC, left: 40 }} />
      <Handle type="source" position={Position.Top} id="mppt1-minus" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 60 }} />
      {/* MPPT2 +/- u gory */}
      <Handle type="source" position={Position.Top} id="mppt2-plus" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.DC, left: 140 }} />
      <Handle type="source" position={Position.Top} id="mppt2-minus" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 160 }} />

      {/* BAT +, BAT -, COM — lewy bok, srodek sekcji DC */}
      <Handle type="source" position={Position.Left} id="bat-plus" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.DC, top: 60 }} />
      <Handle type="source" position={Position.Left} id="bat-minus" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, top: 80 }} />
      <Handle type="source" position={Position.Left} id="com" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#999', top: 100 }} />

      {/* PE obudowy lewy bok — dol */}
      <Handle type="source" position={Position.Left} id="pe-housing" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#228B22', top: 160 }} />

      <svg width="220" height="180" viewBox="0 0 220 180">
        <rect x="6" y="6" width="208" height="168" fill="none" stroke="#333" strokeWidth="1.5" />

        {/* MPPT1 — gora lewa */}
        <text x="50" y="22" textAnchor="middle" fontSize="9" fill="#999" fontFamily="monospace">MPPT1</text>
        <text x="40" y="36" textAnchor="middle" fontSize="11" fill="#FF0000" fontWeight="bold">+</text>
        <text x="60" y="36" textAnchor="middle" fontSize="11" fill="#0000CD" fontWeight="bold">−</text>

        {/* MPPT2 — gora prawa */}
        <text x="150" y="22" textAnchor="middle" fontSize="9" fill="#999" fontFamily="monospace">MPPT2</text>
        <text x="140" y="36" textAnchor="middle" fontSize="11" fill="#FF0000" fontWeight="bold">+</text>
        <text x="160" y="36" textAnchor="middle" fontSize="11" fill="#0000CD" fontWeight="bold">−</text>

        {/* BAT — lewy bok, srodek sekcji DC, wyraznie oddzielony od MPPT */}
        <text x="16" y="55" fontSize="8" fill="#c97706" fontWeight="bold" fontFamily="monospace">BAT</text>
        <text x="16" y="68" fontSize="9" fill="#FF0000" fontWeight="bold">+</text>
        <text x="16" y="84" fontSize="9" fill="#0000CD" fontWeight="bold">−</text>
        <text x="16" y="100" fontSize="7" fill="#999">COM</text>

        {/* DC etykieta — prawa gora */}
        <text x="195" y="35" textAnchor="middle" fontSize="14" fill="#333" fontWeight="bold" fontFamily="monospace">DC</text>

        {/* Linia podzialu DC/AC */}
        <line x1="6" y1="110" x2="214" y2="110" stroke="#333" strokeWidth="0.5" strokeDasharray="4,3" />

        {/* AC sekcja */}
        <text x="40" y="132" fontSize="14" fill="#333" fontWeight="bold" fontFamily="monospace">AC</text>
        <path d="M 70,128 Q 85,118 100,128 Q 115,138 130,128" fill="none" stroke="#333" strokeWidth="1.2" />

        {/* GRID / BACKUP */}
        <text x="60" y="160" textAnchor="middle" fontSize="10" fill="#666" fontFamily="monospace">GRID</text>
        <text x="170" y="160" textAnchor="middle" fontSize="10" fill="#666" fontFamily="monospace">BACKUP</text>
        <line x1="115" y1="110" x2="115" y2="174" stroke="#333" strokeWidth="0.5" strokeDasharray="2,2" />
      </svg>

      <div className="text-xs font-bold text-gray-800 mt-1">{data.label}</div>
      {data.parameters.model && <div className="text-[10px] text-gray-500">{String(data.parameters.model)}</div>}
      {data.parameters.power && <div className="text-[10px] text-gray-500">{String(data.parameters.power)} kW</div>}

      {/* Grid AC — dol */}
      <AcHandles type="source" position={Position.Bottom} prefix="grid" />

      {/* Backup AC — prawy bok co 20px */}
      <Handle type="source" position={Position.Right} id="backup-L1" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L1, top: 120 }} />
      <Handle type="source" position={Position.Right} id="backup-L2" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L2, top: 130 }} />
      <Handle type="source" position={Position.Right} id="backup-L3" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L3, top: 140 }} />
      <Handle type="source" position={Position.Right} id="backup-N" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, top: 150 }} />
      <Handle type="source" position={Position.Right} id="backup-PE" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.PE, top: 160 }} />
    </div>
  );
}
