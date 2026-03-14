import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type Socket32NodeType = Node<SchematicNodeData, 'socket32'>;

export function Socket32Node({ data, selected }: NodeProps<Socket32NodeType>) {
  const stykiDol = data.parameters.orientation === 'dół';

  if (stykiDol) {
    return (
      <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 80 }}>
        <svg width="60" height="55" viewBox="0 0 60 55" style={{ overflow: 'visible' }}>
          <text x="30" y="-4" textAnchor="middle" fontSize="9" fill="#333" fontWeight="bold">{data.label}</text>

          {/* Polkolko odwrocone */}
          <path d="M 10,15 A 20,20 0 0,0 50,15" fill="none" stroke="#333" strokeWidth="1.5" />
          <line x1="10" y1="15" x2="50" y2="15" stroke="#333" strokeWidth="1.5" />
          {/* 5 pinow */}
          <circle cx="15" cy="25" r="2" fill={WIRE_COLORS.L1} />
          <circle cx="25" cy="30" r="2" fill={WIRE_COLORS.L2} />
          <circle cx="35" cy="30" r="2" fill={WIRE_COLORS.L3} />
          <circle cx="45" cy="25" r="2" fill={WIRE_COLORS.N} />
          <circle cx="30" cy="20" r="2.5" fill={WIRE_COLORS.PE} />
          <line x1="30" y1="40" x2="30" y2="55" stroke="#333" strokeWidth="1" />
        </svg>

        {data.parameters.ratingCurrent && (
          <div className="text-[10px] text-gray-500">{String(data.parameters.ratingCurrent)}A</div>
        )}

        <Handle type="source" position={Position.Bottom} id="in-L1" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L1, left: 10 }} />
        <Handle type="source" position={Position.Bottom} id="in-L2" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L2, left: 20 }} />
        <Handle type="source" position={Position.Bottom} id="in-L3" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L3, left: 40 }} />
        <Handle type="source" position={Position.Bottom} id="in-N" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 60 }} />
        <Handle type="source" position={Position.Bottom} id="in-PE" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.PE, left: 70 }} />
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 80 }}>
      <Handle type="source" position={Position.Top} id="in-L1" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L1, left: 10 }} />
      <Handle type="source" position={Position.Top} id="in-L2" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L2, left: 20 }} />
      <Handle type="source" position={Position.Top} id="in-L3" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L3, left: 40 }} />
      <Handle type="source" position={Position.Top} id="in-N" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 60 }} />
      <Handle type="source" position={Position.Top} id="in-PE" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.PE, left: 70 }} />

      <svg width="60" height="55" viewBox="0 0 60 55" style={{ overflow: 'visible' }}>
        <text x="30" y="-4" textAnchor="middle" fontSize="9" fill="#333" fontWeight="bold">{data.label}</text>

        <path d="M 10,40 A 20,20 0 0,1 50,40" fill="none" stroke="#333" strokeWidth="1.5" />
        <line x1="10" y1="40" x2="50" y2="40" stroke="#333" strokeWidth="1.5" />
        <circle cx="15" cy="30" r="2" fill={WIRE_COLORS.L1} />
        <circle cx="25" cy="25" r="2" fill={WIRE_COLORS.L2} />
        <circle cx="35" cy="25" r="2" fill={WIRE_COLORS.L3} />
        <circle cx="45" cy="30" r="2" fill={WIRE_COLORS.N} />
        <circle cx="30" cy="35" r="2.5" fill={WIRE_COLORS.PE} />
        <line x1="30" y1="0" x2="30" y2="15" stroke="#333" strokeWidth="1" />
      </svg>

      {data.parameters.ratingCurrent && (
        <div className="text-[10px] text-gray-500">{String(data.parameters.ratingCurrent)}A</div>
      )}
    </div>
  );
}
