import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type RcdNodeType = Node<SchematicNodeData, 'rcd'>;

// Wylacznik roznicowopradowy RCD wg IEC 60617
// Elementy: styk ruchomy, prostokat z wyzwalaczem roznicowym (toroid — kolko z przerywanymi lukami),
// linia testowa
export function RcdNode({ data, selected }: NodeProps<RcdNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      <Handle type="target" position={Position.Top} id="in" className="!bg-gray-700 !w-2 !h-2" />

      <svg width="44" height="75" viewBox="0 0 44 75">
        {/* Linia wejsciowa */}
        <line x1="22" y1="0" x2="22" y2="10" stroke="white" strokeWidth="1.5" />

        {/* Styk ruchomy */}
        <line x1="22" y1="10" x2="30" y2="24" stroke="white" strokeWidth="2" />

        {/* Styk dolny */}
        <circle cx="22" cy="28" r="2" fill="white" />

        {/* Prostokat obudowy wyzwalacza roznicowego */}
        <rect x="6" y="32" width="32" height="28" fill="none" stroke="white" strokeWidth="1.5" rx="1" />

        {/* Toroid — kolko (rdzen przekladnika roznicowego) */}
        <circle cx="22" cy="46" r="8" fill="none" stroke="white" strokeWidth="1" />

        {/* Linie przez toroid (przewody L i N przechodzace przez rdzen) */}
        <line x1="16" y1="38" x2="16" y2="54" stroke="white" strokeWidth="0.8" />
        <line x1="28" y1="38" x2="28" y2="54" stroke="white" strokeWidth="0.8" />

        {/* Przycisk TEST — linia ukosna z litera T */}
        <line x1="34" y1="34" x2="40" y2="56" stroke="white" strokeWidth="0.8" />
        <text x="41" y="48" fontSize="5" fill="#aaa" fontFamily="monospace">T</text>

        {/* Linia wyjsciowa */}
        <line x1="22" y1="60" x2="22" y2="75" stroke="white" strokeWidth="1.5" />
      </svg>

      <div className="text-xs font-bold mt-1 text-gray-200">{data.label}</div>
      {data.parameters.rcdType && (
        <div className="text-[10px] text-gray-400">
          Typ {String(data.parameters.rcdType)} {String(data.parameters.ratingCurrent ?? '')}A {String(data.parameters.sensitivityCurrent ?? '')}mA
        </div>
      )}

      <Handle type="source" position={Position.Bottom} id="out" className="!bg-gray-700 !w-2 !h-2" />
    </div>
  );
}
