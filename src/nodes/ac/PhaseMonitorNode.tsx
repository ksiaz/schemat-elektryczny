import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type PhaseMonitorNodeType = Node<SchematicNodeData, 'phaseMonitor'>;

// Kontrolka faz — 1 pole, 4 zaciski (L1, L2, L3, N)
export function PhaseMonitorNode({ data, selected }: NodeProps<PhaseMonitorNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 50 }}>
      <Handle type="source" position={Position.Top} id="in-L1" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L1, left: 10 }} />
      <Handle type="source" position={Position.Top} id="in-L2" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L2, left: 20 }} />
      <Handle type="source" position={Position.Top} id="in-L3" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L3, left: 30 }} />
      <Handle type="source" position={Position.Top} id="in-N" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 40 }} />

      <svg width="50" height="40" viewBox="0 0 50 40" style={{ overflow: 'visible' }}>
        <text x="25" y="-4" textAnchor="middle" fontSize="9" fill="#333" fontWeight="bold">{data.label}</text>

        <rect x="3" y="2" width="44" height="36" fill="none" stroke="#333" strokeWidth="1.5" rx="2" />

        {/* 3 diody — L1, L2, L3 */}
        <circle cx="13" cy="15" r="4" fill="none" stroke={WIRE_COLORS.L1} strokeWidth="1.5" />
        <circle cx="25" cy="15" r="4" fill="none" stroke={WIRE_COLORS.L2} strokeWidth="1.5" />
        <circle cx="37" cy="15" r="4" fill="none" stroke={WIRE_COLORS.L3} strokeWidth="1.5" />

        {/* Etykiety faz */}
        <text x="13" y="30" textAnchor="middle" fontSize="7" fill={WIRE_COLORS.L1} fontWeight="bold">1</text>
        <text x="25" y="30" textAnchor="middle" fontSize="7" fill={WIRE_COLORS.L2} fontWeight="bold">2</text>
        <text x="37" y="30" textAnchor="middle" fontSize="7" fill={WIRE_COLORS.L3} fontWeight="bold">3</text>
      </svg>
    </div>
  );
}
