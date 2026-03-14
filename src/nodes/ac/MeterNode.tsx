import { Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { AcHandles } from './AcHandles.tsx';

type MeterNodeType = Node<SchematicNodeData, 'meter'>;

export function MeterNode({ data, selected }: NodeProps<MeterNodeType>) {
  const isBidirectional = data.parameters.bidirectional === 'Tak';
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <AcHandles type="target" position={Position.Top} prefix="in" />
      <svg width="70" height="44" viewBox="0 0 70 44">
        <rect x="5" y="2" width="60" height="40" fill="none" stroke="#333" strokeWidth="1.5" />
        <text x="35" y="20" textAnchor="middle" fontSize="12" fill="#333" fontWeight="bold" fontFamily="monospace">kWh</text>
        {isBidirectional && (
          <g>
            <line x1="16" y1="32" x2="54" y2="32" stroke="#333" strokeWidth="0.8" />
            <polygon points="16,32 20,30 20,34" fill="#333" />
            <polygon points="54,32 50,30 50,34" fill="#333" />
          </g>
        )}
      </svg>
      <div className="text-xs font-bold mt-1 text-gray-800">{data.label}</div>
      {data.parameters.meterType && (
        <div className="text-[10px] text-gray-500">{String(data.parameters.meterType)}</div>
      )}
      <AcHandles type="source" position={Position.Bottom} prefix="out" />
    </div>
  );
}
