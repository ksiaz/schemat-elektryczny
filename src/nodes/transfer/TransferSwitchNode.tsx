import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type TransferSwitchNodeType = Node<SchematicNodeData, 'transferSwitch'>;

// SZR / ATS — przelacznik z dwoma wejsciami
export function TransferSwitchNode({ data, selected }: NodeProps<TransferSwitchNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      {/* Dwa wejscia — siec i generator/falownik */}
      <Handle type="target" position={Position.Top} id="in-1" className="!bg-gray-700 !w-2 !h-2" style={{ left: '30%' }} />
      <Handle type="target" position={Position.Top} id="in-2" className="!bg-gray-700 !w-2 !h-2" style={{ left: '70%' }} />

      <svg width="60" height="50" viewBox="0 0 60 50">
        {/* Dwie linie wejsciowe */}
        <line x1="18" y1="0" x2="18" y2="15" stroke="black" strokeWidth="1.5" />
        <line x1="42" y1="0" x2="42" y2="15" stroke="black" strokeWidth="1.5" />
        {/* Styk ruchomy — przelaczajacy */}
        <line x1="18" y1="15" x2="30" y2="30" stroke="black" strokeWidth="2" />
        {/* Punkt przelaczenia */}
        <circle cx="30" cy="32" r="2" fill="black" />
        {/* Styk dolny (drugi) */}
        <circle cx="42" cy="15" r="2" fill="none" stroke="black" strokeWidth="1" />
        {/* Wyjscie */}
        <line x1="30" y1="34" x2="30" y2="50" stroke="black" strokeWidth="1.5" />
      </svg>

      <div className="text-xs font-bold mt-1">{data.label}</div>
      {data.parameters.switchType && (
        <div className="text-[10px] text-gray-500">
          {String(data.parameters.switchType)} {data.parameters.ratingCurrent ? `${String(data.parameters.ratingCurrent)}A` : ''}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} id="out" className="!bg-gray-700 !w-2 !h-2" />
    </div>
  );
}
