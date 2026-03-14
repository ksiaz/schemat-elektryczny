import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type SpdAcNodeType = Node<SchematicNodeData, 'spdAc'>;

// Ogranicznik przepiec SPD wg IEC 60617 (IEC 61643)
// Prostokat z symbolem blyskawicy (zygzak zakończony strzalka) i linia uziemienia
export function SpdAcNode({ data, selected }: NodeProps<SpdAcNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      <Handle type="target" position={Position.Top} id="in" className="!bg-gray-700 !w-2 !h-2" />

      <svg width="36" height="60" viewBox="0 0 36 60">
        {/* Linia wejsciowa */}
        <line x1="18" y1="0" x2="18" y2="8" stroke="white" strokeWidth="1.5" />

        {/* Prostokat */}
        <rect x="4" y="8" width="28" height="34" fill="none" stroke="white" strokeWidth="1.5" rx="1" />

        {/* Blyskawica (zygzak) — symbol przepiecia */}
        <polyline
          points="21,14 15,22 21,22 13,34"
          fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        />
        {/* Grot blyskawicy */}
        <polygon points="13,34 16,30 15,33" fill="white" />

        {/* Linia wyjsciowa do uziemienia */}
        <line x1="18" y1="42" x2="18" y2="60" stroke="white" strokeWidth="1.5" />
      </svg>

      <div className="text-xs font-bold mt-1 text-gray-200">{data.label}</div>
      {data.parameters.spdType && (
        <div className="text-[10px] text-gray-400">{String(data.parameters.spdType)}</div>
      )}

      <Handle type="source" position={Position.Bottom} id="out" className="!bg-gray-700 !w-2 !h-2" />
    </div>
  );
}
