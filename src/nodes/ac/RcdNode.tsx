import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type RcdNodeType = Node<SchematicNodeData, 'rcd'>;

// RCD 4P: 4 zaciski wejsciowe (L1,L2,L3,N) + 4 wyjsciowe
export function RcdNode({ data, selected }: NodeProps<RcdNodeType>) {
  const poles = String(data.parameters.poles || '4P');
  const is4P = poles === '4P';

  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      {/* Zaciski wejsciowe */}
      <Handle type="target" position={Position.Top} id="in-L1" className="!w-3 !h-3" style={{ backgroundColor: WIRE_COLORS.L1, left: '15%' }} />
      {is4P && <Handle type="target" position={Position.Top} id="in-L2" className="!w-3 !h-3" style={{ backgroundColor: WIRE_COLORS.L2, left: '35%' }} />}
      {is4P && <Handle type="target" position={Position.Top} id="in-L3" className="!w-3 !h-3" style={{ backgroundColor: WIRE_COLORS.L3, left: '55%' }} />}
      <Handle type="target" position={Position.Top} id="in-N" className="!w-3 !h-3" style={{ backgroundColor: WIRE_COLORS.N, left: '75%' }} />

      <svg width="70" height="55" viewBox="0 0 70 55">
        <line x1="35" y1="0" x2="35" y2="10" stroke="#333" strokeWidth="1.5" />
        <line x1="35" y1="10" x2="45" y2="26" stroke="#333" strokeWidth="2" />
        <circle cx="35" cy="30" r="2" fill="#333" />
        {/* Symbol roznicowy */}
        <circle cx="22" cy="20" r="6" fill="none" stroke="#333" strokeWidth="0.8" />
        <line x1="22" y1="14" x2="22" y2="26" stroke="#333" strokeWidth="0.8" />
        <line x1="35" y1="32" x2="35" y2="55" stroke="#333" strokeWidth="1.5" />
      </svg>

      <div className="text-xs font-bold text-gray-800">{data.label}</div>
      {data.parameters.rcdType && (
        <div className="text-[10px] text-gray-500">
          {String(data.parameters.rcdType)} {String(data.parameters.ratingCurrent ?? '')}A {String(data.parameters.sensitivityCurrent ?? '')}mA
        </div>
      )}

      {/* Zaciski wyjsciowe */}
      <Handle type="source" position={Position.Bottom} id="out-L1" className="!w-3 !h-3" style={{ backgroundColor: WIRE_COLORS.L1, left: '15%' }} />
      {is4P && <Handle type="source" position={Position.Bottom} id="out-L2" className="!w-3 !h-3" style={{ backgroundColor: WIRE_COLORS.L2, left: '35%' }} />}
      {is4P && <Handle type="source" position={Position.Bottom} id="out-L3" className="!w-3 !h-3" style={{ backgroundColor: WIRE_COLORS.L3, left: '55%' }} />}
      <Handle type="source" position={Position.Bottom} id="out-N" className="!w-3 !h-3" style={{ backgroundColor: WIRE_COLORS.N, left: '75%' }} />
    </div>
  );
}
