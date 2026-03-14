import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type TransferSwitchNodeType = Node<SchematicNodeData, 'transferSwitch'>;

// Przelacznik I-0-II (Hager SFT440) — 4P, wszystkie 4 tory przelaczane
// Gora: wspolne wyjscie (do odbiorcow)
// Dol lewo: wejscie I (siec)
// Dol prawo: wejscie II (falownik/agregat)
export function TransferSwitchNode({ data, selected }: NodeProps<TransferSwitchNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 160 }}>
      {/* Wyjscie wspolne — gora: L1, L2, L3, N */}
      <Handle type="source" position={Position.Top} id="out-L1" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L1, left: 30 }} />
      <Handle type="source" position={Position.Top} id="out-L2" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L2, left: 50 }} />
      <Handle type="source" position={Position.Top} id="out-L3" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L3, left: 70 }} />
      <Handle type="source" position={Position.Top} id="out-N" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 90 }} />

      <svg width="160" height="100" viewBox="0 0 160 100">
        <rect x="4" y="4" width="152" height="92" fill="none" stroke="#333" strokeWidth="1.5" rx="1" />

        {/* Etykieta I-0-II */}
        <text x="80" y="14" textAnchor="middle" fontSize="8" fill="#999" fontFamily="monospace">I-0-II  4P</text>

        {/* 4 tory — kazdy z 2 stykami ruchomymi (I i II) */}
        {[
          { x: 25, color: WIRE_COLORS.L1, label: 'L1' },
          { x: 55, color: WIRE_COLORS.L2, label: 'L2' },
          { x: 85, color: WIRE_COLORS.L3, label: 'L3' },
          { x: 115, color: WIRE_COLORS.N, label: 'N' },
        ].map((tor) => (
          <g key={tor.label}>
            {/* Punkt wspolny u gory */}
            <line x1={tor.x} y1="4" x2={tor.x} y2="28" stroke={tor.color} strokeWidth="1" />
            <circle cx={tor.x} cy="28" r="2" fill={tor.color} />

            {/* Styk ruchomy — pozycja 0 */}
            <line x1={tor.x} y1="28" x2={tor.x - 8} y2="55" stroke="#333" strokeWidth="1.5" />

            {/* Styk I (lewo) */}
            <circle cx={tor.x - 12} cy="60" r="2" fill="#333" />
            <line x1={tor.x - 12} y1="62" x2={tor.x - 12} y2="96" stroke={tor.color} strokeWidth="1" />

            {/* Styk II (prawo) */}
            <circle cx={tor.x + 12} cy="60" r="2" fill="none" stroke="#333" strokeWidth="1" />
            <line x1={tor.x + 12} y1="62" x2={tor.x + 12} y2="96" stroke={tor.color} strokeWidth="1" />
          </g>
        ))}

        {/* Oznaczenia I i II */}
        <text x="8" y="80" fontSize="9" fill="#333" fontWeight="bold">I</text>
        <text x="142" y="80" fontSize="9" fill="#333" fontWeight="bold">II</text>
      </svg>

      <div className="text-xs font-bold text-gray-800">{data.label}</div>
      {data.parameters.model && <div className="text-[10px] text-gray-500">{String(data.parameters.model)}</div>}
      {data.parameters.ratingCurrent && <div className="text-[10px] text-gray-500">{String(data.parameters.ratingCurrent)}A</div>}

      {/* Wejscie I (siec) — dol lewo: L1, L2, L3, N */}
      <Handle type="target" position={Position.Bottom} id="in1-L1" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L1, left: 10 }} />
      <Handle type="target" position={Position.Bottom} id="in1-L2" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L2, left: 30 }} />
      <Handle type="target" position={Position.Bottom} id="in1-L3" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L3, left: 50 }} />
      <Handle type="target" position={Position.Bottom} id="in1-N" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 70 }} />

      {/* Wejscie II (falownik) — dol prawo: L1, L2, L3, N */}
      <Handle type="target" position={Position.Bottom} id="in2-L1" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L1, left: 90 }} />
      <Handle type="target" position={Position.Bottom} id="in2-L2" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L2, left: 110 }} />
      <Handle type="target" position={Position.Bottom} id="in2-L3" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L3, left: 130 }} />
      <Handle type="target" position={Position.Bottom} id="in2-N" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 150 }} />
    </div>
  );
}
