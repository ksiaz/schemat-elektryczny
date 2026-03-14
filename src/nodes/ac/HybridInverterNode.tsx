import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { AcHandles } from './AcHandles.tsx';
import { WIRE_COLORS } from '../../constants/index.ts';

type HybridInverterNodeType = Node<SchematicNodeData, 'hybridInverter'>;

// Falownik hybrydowy — kazdy MPPT +/-, bateria +/-, 2 wyjscia AC (grid + backup)
export function HybridInverterNode({ data, selected }: NodeProps<HybridInverterNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      {/* MPPT1 +/- */}
      <Handle type="target" position={Position.Top} id="mppt1-plus" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.DC, left: '15%' }} />
      <Handle type="target" position={Position.Top} id="mppt1-minus" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: '28%' }} />
      {/* MPPT2 +/- */}
      <Handle type="target" position={Position.Top} id="mppt2-plus" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.DC, left: '52%' }} />
      <Handle type="target" position={Position.Top} id="mppt2-minus" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: '65%' }} />
      {/* Bateria +/- po lewej */}
      <Handle type="target" position={Position.Left} id="bat-plus" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.DC, top: '30%' }} />
      <Handle type="target" position={Position.Left} id="bat-minus" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, top: '40%' }} />

      <svg width="130" height="95" viewBox="0 0 130 95">
        <rect x="4" y="4" width="122" height="87" fill="none" stroke="#333" strokeWidth="1.5" />

        {/* MPPT etykiety z +/- */}
        <text x="25" y="14" textAnchor="middle" fontSize="6" fill="#999" fontFamily="monospace">MPPT1</text>
        <text x="18" y="22" textAnchor="middle" fontSize="8" fill="#FF0000" fontWeight="bold">+</text>
        <text x="34" y="22" textAnchor="middle" fontSize="8" fill="#0000CD" fontWeight="bold">-</text>
        <text x="75" y="14" textAnchor="middle" fontSize="6" fill="#999" fontFamily="monospace">MPPT2</text>
        <text x="66" y="22" textAnchor="middle" fontSize="8" fill="#FF0000" fontWeight="bold">+</text>
        <text x="82" y="22" textAnchor="middle" fontSize="8" fill="#0000CD" fontWeight="bold">-</text>

        {/* BAT */}
        <text x="10" y="35" fontSize="6" fill="#c97706" fontFamily="monospace">BAT</text>
        <text x="10" y="42" fontSize="7" fill="#FF0000" fontWeight="bold">+</text>
        <text x="10" y="50" fontSize="7" fill="#0000CD" fontWeight="bold">-</text>

        <text x="110" y="22" textAnchor="middle" fontSize="10" fill="#333" fontWeight="bold" fontFamily="monospace">DC</text>
        <line x1="4" y1="48" x2="126" y2="48" stroke="#333" strokeWidth="0.5" strokeDasharray="4,3" />

        <text x="25" y="62" fontSize="10" fill="#333" fontWeight="bold" fontFamily="monospace">AC</text>
        <path d="M 45,60 Q 55,53 65,60 Q 75,67 85,60" fill="none" stroke="#333" strokeWidth="1" />

        <text x="40" y="82" textAnchor="middle" fontSize="7" fill="#666" fontFamily="monospace">GRID</text>
        <text x="100" y="82" textAnchor="middle" fontSize="7" fill="#666" fontFamily="monospace">BACKUP</text>
        <line x1="70" y1="48" x2="70" y2="91" stroke="#333" strokeWidth="0.5" strokeDasharray="2,2" />
      </svg>

      <div className="text-xs font-bold text-gray-800 mt-1">{data.label}</div>
      {data.parameters.model && (
        <div className="text-[10px] text-gray-500">{String(data.parameters.model)}</div>
      )}
      {data.parameters.power && (
        <div className="text-[10px] text-gray-500">{String(data.parameters.power)} kW</div>
      )}

      {/* COM — komunikacja */}
      <Handle type="source" position={Position.Right} id="com" className="!w-1.5 !h-1.5" style={{ backgroundColor: "#999", top: "30%" }} />

      {/* PE obudowy */}
      <Handle type="source" position={Position.Left} id="pe-housing" className="!w-1.5 !h-1.5" style={{ backgroundColor: "#228B22", top: "85%" }} />

      {/* Grid AC — dol */}
      <AcHandles type="source" position={Position.Bottom} prefix="grid" />

      {/* Backup AC — prawy bok */}
      <Handle type="source" position={Position.Right} id="backup-L1" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L1, top: '55%' }} />
      <Handle type="source" position={Position.Right} id="backup-L2" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L2, top: '62%' }} />
      <Handle type="source" position={Position.Right} id="backup-L3" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L3, top: '69%' }} />
      <Handle type="source" position={Position.Right} id="backup-N" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, top: '76%' }} />
      <Handle type="source" position={Position.Right} id="backup-PE" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.PE, top: '83%' }} />
    </div>
  );
}
