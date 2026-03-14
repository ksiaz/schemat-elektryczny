import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type RcboNodeType = Node<SchematicNodeData, 'rcbo'>;

// RCBO (RCD+MCB) wg IEC 60617
// Polaczenie: styk ruchomy + wyzwalacz termiczny + polkole elektromagnetyczne + toroid roznicowy
export function RcboNode({ data, selected }: NodeProps<RcboNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      <Handle type="target" position={Position.Top} id="in" className="!bg-gray-700 !w-2 !h-2" />

      <svg width="44" height="85" viewBox="0 0 44 85">
        {/* Linia wejsciowa */}
        <line x1="22" y1="0" x2="22" y2="10" stroke="#333" strokeWidth="1.5" />

        {/* Styk ruchomy MCB */}
        <line x1="22" y1="10" x2="30" y2="24" stroke="#333" strokeWidth="2" />

        {/* Wyzwalacz termiczny — prostokat */}
        <rect x="26" y="18" width="5" height="4" fill="none" stroke="#333" strokeWidth="1" />

        {/* Wyzwalacz elektromagnetyczny — polkole */}
        <path d="M 18,28 A 5,5 0 0,1 26,28" fill="none" stroke="#333" strokeWidth="1" />

        {/* Styk dolny */}
        <circle cx="22" cy="30" r="2" fill="#333" />

        {/* Prostokat wyzwalacza roznicowego */}
        <rect x="6" y="34" width="32" height="26" fill="none" stroke="#333" strokeWidth="1.5" rx="1" />

        {/* Toroid */}
        <circle cx="22" cy="47" r="7" fill="none" stroke="#333" strokeWidth="1" />
        <line x1="16" y1="40" x2="16" y2="54" stroke="#333" strokeWidth="0.8" />
        <line x1="28" y1="40" x2="28" y2="54" stroke="#333" strokeWidth="0.8" />

        {/* Linia wyjsciowa */}
        <line x1="22" y1="60" x2="22" y2="85" stroke="#333" strokeWidth="1.5" />
      </svg>

      <div className="text-xs font-bold mt-1 text-gray-800">{data.label}</div>
      {data.parameters.ratingCurrent && (
        <div className="text-[10px] text-gray-500">
          {data.parameters.curve ? `${String(data.parameters.curve)}` : ''}{String(data.parameters.ratingCurrent)}A {data.parameters.sensitivityCurrent ? `${String(data.parameters.sensitivityCurrent)}mA` : ''}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} id="out" className="!bg-gray-700 !w-2 !h-2" />
    </div>
  );
}
