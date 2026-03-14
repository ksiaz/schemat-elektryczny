import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type McbNodeType = Node<SchematicNodeData, 'mcb'>;

// Wylacznik nadpradowy MCB wg IEC 60617
// Elementy: styk ruchomy, wyzwalacz termiczny (prostokat), wyzwalacz elektromagnetyczny (polkole)
export function McbNode({ data, selected }: NodeProps<McbNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      <Handle type="target" position={Position.Top} id="in" className="!bg-gray-700 !w-2 !h-2" />

      <svg width="30" height="70" viewBox="0 0 30 70">
        {/* Linia wejsciowa (gora) */}
        <line x1="15" y1="0" x2="15" y2="12" stroke="white" strokeWidth="1.5" />

        {/* Styk gorny (nieruchomy) — mala kreska */}
        <line x1="11" y1="12" x2="19" y2="12" stroke="white" strokeWidth="1.5" />

        {/* Styk ruchomy — linia pod katem ~30 stopni */}
        <line x1="15" y1="12" x2="23" y2="30" stroke="white" strokeWidth="2" />

        {/* Wyzwalacz termiczny — maly prostokat na styku */}
        <rect x="18" y="20" width="6" height="4" fill="none" stroke="white" strokeWidth="1" />

        {/* Wyzwalacz elektromagnetyczny — polkole */}
        <path d="M 12,35 A 6,6 0 0,1 18,35" fill="none" stroke="white" strokeWidth="1" />

        {/* Styk dolny (nieruchomy) */}
        <circle cx="15" cy="38" r="2" fill="white" />

        {/* Linia wyjsciowa (dol) */}
        <line x1="15" y1="40" x2="15" y2="70" stroke="white" strokeWidth="1.5" />
      </svg>

      <div className="text-xs font-bold mt-1 text-gray-200">{data.label}</div>
      {data.parameters.curve && (
        <div className="text-[10px] text-gray-400">
          {String(data.parameters.curve)}{String(data.parameters.ratingCurrent ?? '')}A
        </div>
      )}

      <Handle type="source" position={Position.Bottom} id="out" className="!bg-gray-700 !w-2 !h-2" />
    </div>
  );
}
