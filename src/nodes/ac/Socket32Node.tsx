import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type Socket32NodeType = Node<SchematicNodeData, 'socket32'>;

// Gniazdo 32A 3-faz + N + PE — 5 zaciskow
export function Socket32Node({ data, selected }: NodeProps<Socket32NodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 80 }}>
      <Handle type="target" position={Position.Top} id="in-L1" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L1, left: 10 }} />
      <Handle type="target" position={Position.Top} id="in-L2" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L2, left: 20 }} />
      <Handle type="target" position={Position.Top} id="in-L3" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L3, left: 40 }} />
      <Handle type="target" position={Position.Top} id="in-N" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 60 }} />
      <Handle type="target" position={Position.Top} id="in-PE" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.PE, left: 70 }} />

      <svg width="60" height="55" viewBox="0 0 60 55">
        {/* Polkolko — symbol gniazda */}
        <path d="M 10,40 A 20,20 0 0,1 50,40" fill="none" stroke="#333" strokeWidth="1.5" />
        {/* Linia dolna */}
        <line x1="10" y1="40" x2="50" y2="40" stroke="#333" strokeWidth="1.5" />
        {/* 5 pinow */}
        <circle cx="15" cy="30" r="2" fill={WIRE_COLORS.L1} />
        <circle cx="25" cy="25" r="2" fill={WIRE_COLORS.L2} />
        <circle cx="35" cy="25" r="2" fill={WIRE_COLORS.L3} />
        <circle cx="45" cy="30" r="2" fill={WIRE_COLORS.N} />
        <circle cx="30" cy="35" r="2.5" fill={WIRE_COLORS.PE} />
        {/* Linie od gory */}
        <line x1="30" y1="0" x2="30" y2="15" stroke="#333" strokeWidth="1" />
      </svg>

      <div className="text-xs font-bold text-gray-800">{data.label}</div>
      {data.parameters.ratingCurrent && (
        <div className="text-[10px] text-gray-500">{String(data.parameters.ratingCurrent)}A</div>
      )}
    </div>
  );
}
