import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type TransferSwitchNodeType = Node<SchematicNodeData, 'transferSwitch'>;

// Przelacznik I-0-II 4P — 4 tory, styki I po lewej, II po prawej
export function TransferSwitchNode({ data, selected }: NodeProps<TransferSwitchNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 180 }}>
      {/* Wyjscie wspolne — gora */}
      <Handle type="source" position={Position.Top} id="out-L1" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L1, left: 50 }} />
      <Handle type="source" position={Position.Top} id="out-L2" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L2, left: 70 }} />
      <Handle type="source" position={Position.Top} id="out-L3" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L3, left: 90 }} />
      <Handle type="source" position={Position.Top} id="out-N" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 110 }} />

      <svg width="180" height="110" viewBox="0 0 180 110">
        <rect x="4" y="4" width="172" height="102" fill="none" stroke="#333" strokeWidth="1.5" rx="1" />

        <text x="90" y="16" textAnchor="middle" fontSize="8" fill="#999" fontFamily="monospace">I-0-II  4P</text>

        {/* 4 tory */}
        {[
          { cx: 50, color: WIRE_COLORS.L1, label: 'L1', idxI: 10, idxII: 110 },
          { cx: 70, color: WIRE_COLORS.L2, label: 'L2', idxI: 30, idxII: 130 },
          { cx: 90, color: WIRE_COLORS.L3, label: 'L3', idxI: 50, idxII: 150 },
          { cx: 110, color: WIRE_COLORS.N, label: 'N', idxI: 70, idxII: 170 },
        ].map((t) => (
          <g key={t.label}>
            {/* Punkt wspolny gora */}
            <line x1={t.cx} y1="4" x2={t.cx} y2="30" stroke={t.color} strokeWidth="1" />
            <circle cx={t.cx} cy="30" r="2" fill={t.color} />

            {/* Styk ruchomy — pozycja 0 */}
            <line x1={t.cx} y1="30" x2={t.cx - 6} y2="55" stroke="#333" strokeWidth="1.5" />

            {/* Linia do styku I (lewo) */}
            <circle cx={t.cx - 15} cy="60" r="2" fill="#333" />
            <line x1={t.cx - 15} y1="62" x2={t.idxI} y2="106" stroke={t.color} strokeWidth="1" />

            {/* Styk II (prawo) */}
            <circle cx={t.cx + 15} cy="60" r="2" fill="none" stroke="#333" strokeWidth="1" />
            <line x1={t.cx + 15} y1="62" x2={t.idxII} y2="106" stroke={t.color} strokeWidth="1" />
          </g>
        ))}

        {/* Oznaczenia I i II */}
        <text x="10" y="98" fontSize="10" fill="#333" fontWeight="bold">I</text>
        <text x="160" y="98" fontSize="10" fill="#333" fontWeight="bold">II</text>
        {/* Linia podzialu I/II */}
        <line x1="90" y1="70" x2="90" y2="106" stroke="#333" strokeWidth="0.5" strokeDasharray="2,2" />
      </svg>

      <div className="text-xs font-bold text-gray-800">{data.label}</div>
      {data.parameters.model && <div className="text-[10px] text-gray-500">{String(data.parameters.model)}</div>}
      {data.parameters.ratingCurrent && <div className="text-[10px] text-gray-500">{String(data.parameters.ratingCurrent)}A</div>}

      {/* Wejscie I (siec) — dol lewo: L1 L2 L3 N */}
      <Handle type="target" position={Position.Bottom} id="in1-L1" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L1, left: 10 }} />
      <Handle type="target" position={Position.Bottom} id="in1-L2" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L2, left: 30 }} />
      <Handle type="target" position={Position.Bottom} id="in1-L3" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L3, left: 50 }} />
      <Handle type="target" position={Position.Bottom} id="in1-N" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 70 }} />

      {/* Wejscie II (falownik) — dol prawo: L1 L2 L3 N */}
      <Handle type="target" position={Position.Bottom} id="in2-L1" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L1, left: 110 }} />
      <Handle type="target" position={Position.Bottom} id="in2-L2" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L2, left: 130 }} />
      <Handle type="target" position={Position.Bottom} id="in2-L3" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L3, left: 150 }} />
      <Handle type="target" position={Position.Bottom} id="in2-N" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 170 }} />
    </div>
  );
}
