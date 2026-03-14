import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type SpdAcNodeType = Node<SchematicNodeData, 'spdAc'>;

// SPD AC 3-faz: 4 pola (L1, L2, L3, N) na gorze + uziom (PE) na dole
export function SpdAcNode({ data, selected }: NodeProps<SpdAcNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      {/* 4 zaciski wejsciowe: L1, L2, L3, N */}
      <Handle type="target" position={Position.Top} id="in-L1" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L1, left: '15%' }} />
      <Handle type="target" position={Position.Top} id="in-L2" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L2, left: '35%' }} />
      <Handle type="target" position={Position.Top} id="in-L3" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L3, left: '55%' }} />
      <Handle type="target" position={Position.Top} id="in-N" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: '75%' }} />

      <svg width="70" height="55" viewBox="0 0 70 55">
        <line x1="35" y1="0" x2="35" y2="6" stroke="#333" strokeWidth="1.5" />
        <rect x="10" y="6" width="50" height="34" fill="none" stroke="#333" strokeWidth="1.5" rx="1" />
        <polyline points="38,12 32,22 38,22 30,34" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
        <polygon points="30,34 33,30 32,33" fill="#333" />
        <line x1="35" y1="40" x2="35" y2="55" stroke="#333" strokeWidth="1.5" />
      </svg>

      <div className="text-xs font-bold text-gray-800">{data.label}</div>
      {data.parameters.spdType && (
        <div className="text-[10px] text-gray-500">{String(data.parameters.spdType)}</div>
      )}

      {/* Uziom (PE) na dole — 1 zacisk */}
      <Handle type="source" position={Position.Bottom} id="out-PE" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.PE }} />
    </div>
  );
}
