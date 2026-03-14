import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type TransferSwitchNodeType = Node<SchematicNodeData, 'transferSwitch'>;

// Przelacznik I-0-II (Hager SFT440 style) — 4P, wspolny punkt u gory
// Gora: wejscie wspolne (L1, L2, L3, N)
// Dol lewo: wyjscie I (siec)
// Dol prawo: wyjscie II (falownik/agregat)
export function TransferSwitchNode({ data, selected }: NodeProps<TransferSwitchNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 120 }}>
      {/* Wejscie wspolne — gora: L1, L2, L3, N */}
      <Handle type="target" position={Position.Top} id="in-L1" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L1, left: 20 }} />
      <Handle type="target" position={Position.Top} id="in-L2" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L2, left: 40 }} />
      <Handle type="target" position={Position.Top} id="in-L3" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L3, left: 60 }} />
      <Handle type="target" position={Position.Top} id="in-N" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 80 }} />

      <svg width="120" height="90" viewBox="0 0 120 90">
        {/* Ramka */}
        <rect x="4" y="4" width="112" height="82" fill="none" stroke="#333" strokeWidth="1.5" rx="1" />

        {/* Linie wejsciowe od gory */}
        <line x1="30" y1="4" x2="30" y2="25" stroke="#333" strokeWidth="1.5" />
        <line x1="60" y1="4" x2="60" y2="25" stroke="#333" strokeWidth="1.5" />

        {/* Punkt wspolny */}
        <circle cx="30" cy="25" r="2" fill="#333" />
        <circle cx="60" cy="25" r="2" fill="#333" />

        {/* Styk ruchomy — pozycja 0 (srodek, rozlaczony) */}
        <line x1="30" y1="25" x2="20" y2="50" stroke="#333" strokeWidth="2" />
        <line x1="60" y1="25" x2="50" y2="50" stroke="#333" strokeWidth="2" />

        {/* Styk I (lewo — siec) */}
        <circle cx="20" cy="55" r="2" fill="#333" />
        <line x1="20" y1="57" x2="20" y2="86" stroke="#333" strokeWidth="1.5" />

        {/* Styk II (prawo — falownik) */}
        <circle cx="90" cy="55" r="2" fill="none" stroke="#333" strokeWidth="1" />
        <line x1="90" y1="57" x2="90" y2="86" stroke="#333" strokeWidth="1.5" />

        {/* Etykiety I-0-II */}
        <text x="12" y="70" fontSize="8" fill="#333" fontWeight="bold">I</text>
        <text x="42" y="42" fontSize="8" fill="#333" fontWeight="bold">0</text>
        <text x="95" y="70" fontSize="8" fill="#333" fontWeight="bold">II</text>

        {/* Opis */}
        <text x="60" y="14" textAnchor="middle" fontSize="7" fill="#999" fontFamily="monospace">I-0-II</text>
      </svg>

      <div className="text-xs font-bold text-gray-800">{data.label}</div>
      {data.parameters.model && <div className="text-[10px] text-gray-500">{String(data.parameters.model)}</div>}
      {data.parameters.ratingCurrent && <div className="text-[10px] text-gray-500">{String(data.parameters.ratingCurrent)}A 4P</div>}

      {/* Wyjscie I (siec) — dol lewo */}
      <Handle type="source" position={Position.Bottom} id="out1-L1" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L1, left: 10 }} />
      <Handle type="source" position={Position.Bottom} id="out1-L2" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L2, left: 20 }} />
      <Handle type="source" position={Position.Bottom} id="out1-L3" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L3, left: 30 }} />
      <Handle type="source" position={Position.Bottom} id="out1-N" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 40 }} />

      {/* Wyjscie II (falownik/agregat) — dol prawo */}
      <Handle type="source" position={Position.Bottom} id="out2-L1" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L1, left: 70 }} />
      <Handle type="source" position={Position.Bottom} id="out2-L2" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L2, left: 80 }} />
      <Handle type="source" position={Position.Bottom} id="out2-L3" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L3, left: 90 }} />
      <Handle type="source" position={Position.Bottom} id="out2-N" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 100 }} />
    </div>
  );
}
