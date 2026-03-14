import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type TransferSwitchNodeType = Node<SchematicNodeData, 'transferSwitch'>;

// Przelacznik I-0-II 4P — na dole: L1-I obok L1-II, L2-I obok L2-II itd.
export function TransferSwitchNode({ data, selected }: NodeProps<TransferSwitchNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 180 }}>
      {/* Wyjscie wspolne — gora */}
      <Handle type="source" position={Position.Top} id="out-L1" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L1, left: 20 }} />
      <Handle type="source" position={Position.Top} id="out-L2" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L2, left: 60 }} />
      <Handle type="source" position={Position.Top} id="out-L3" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L3, left: 100 }} />
      <Handle type="source" position={Position.Top} id="out-N" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 140 }} />

      <div className="text-xs font-bold text-gray-800">{data.label}</div>
      {data.parameters.model && <div className="text-[10px] text-gray-500">{String(data.parameters.model)}</div>}
      {data.parameters.ratingCurrent && <div className="text-[10px] text-gray-500">{String(data.parameters.ratingCurrent)}A</div>}

      <svg width="180" height="100" viewBox="0 0 180 100">
        <rect x="4" y="4" width="172" height="92" fill="none" stroke="#333" strokeWidth="1.5" rx="1" />
        <text x="90" y="16" textAnchor="middle" fontSize="8" fill="#999" fontFamily="monospace">I-0-II  4P</text>

        {/* 4 tory — kazdy ma punkt wspolny gora, styk I (lewo) i II (prawo) na dole */}
        {[
          { cx: 20, color: WIRE_COLORS.L1 },
          { cx: 60, color: WIRE_COLORS.L2 },
          { cx: 100, color: WIRE_COLORS.L3 },
          { cx: 140, color: WIRE_COLORS.N },
        ].map((t, i) => (
          <g key={i}>
            {/* Punkt wspolny gora */}
            <line x1={t.cx} y1="4" x2={t.cx} y2="30" stroke={t.color} strokeWidth="1" />
            <circle cx={t.cx} cy="30" r="2" fill={t.color} />

            {/* Styk ruchomy — pozycja 0 */}
            <line x1={t.cx} y1="30" x2={t.cx - 6} y2="55" stroke="#333" strokeWidth="1.5" />

            {/* Styk I (lewo) */}
            <circle cx={t.cx - 10} cy="60" r="2" fill="#333" />
            <line x1={t.cx - 10} y1="62" x2={t.cx - 10} y2="96" stroke={t.color} strokeWidth="1" />

            {/* Styk II (prawo) */}
            <circle cx={t.cx + 10} cy="60" r="2" fill="none" stroke="#333" strokeWidth="1" />
            <line x1={t.cx + 10} y1="62" x2={t.cx + 10} y2="96" stroke={t.color} strokeWidth="1" />
          </g>
        ))}
      </svg>

      {/* Dol: L1-I obok L1-II, L2-I obok L2-II, L3-I obok L3-II, N-I obok N-II */}
      <Handle type="source" position={Position.Bottom} id="in1-L1" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L1, left: 10 }} />
      <Handle type="source" position={Position.Bottom} id="in2-L1" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L1, left: 30 }} />

      <Handle type="source" position={Position.Bottom} id="in1-L2" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L2, left: 50 }} />
      <Handle type="source" position={Position.Bottom} id="in2-L2" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L2, left: 70 }} />

      <Handle type="source" position={Position.Bottom} id="in1-L3" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L3, left: 90 }} />
      <Handle type="source" position={Position.Bottom} id="in2-L3" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L3, left: 110 }} />

      <Handle type="source" position={Position.Bottom} id="in1-N" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 130 }} />
      <Handle type="source" position={Position.Bottom} id="in2-N" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 150 }} />
    </div>
  );
}
