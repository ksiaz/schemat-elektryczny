import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type ContactorNodeType = Node<SchematicNodeData, 'contactor'>;

// Stycznik wg IEC 60617
// Styk ruchomy z cewka elektromagnetyczna (prostokat z polkólkiem wewnatrz)
export function ContactorNode({ data, selected }: NodeProps<ContactorNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      <Handle type="target" position={Position.Top} id="in" className="!bg-gray-700 !w-2 !h-2" />

      <svg width="36" height="70" viewBox="0 0 36 70">
        {/* Linia wejsciowa */}
        <line x1="18" y1="0" x2="18" y2="12" stroke="white" strokeWidth="1.5" />

        {/* Styk gorny nieruchomy */}
        <line x1="14" y1="12" x2="22" y2="12" stroke="white" strokeWidth="1.5" />

        {/* Styk ruchomy */}
        <line x1="18" y1="12" x2="26" y2="28" stroke="white" strokeWidth="2" />

        {/* Styk dolny */}
        <circle cx="18" cy="30" r="2" fill="white" />

        {/* Linia do cewki */}
        <line x1="18" y1="32" x2="18" y2="38" stroke="white" strokeWidth="1.5" />

        {/* Cewka elektromagnetyczna — prostokat z polkolkiem (symbol cewki) */}
        <rect x="8" y="38" width="20" height="16" fill="none" stroke="white" strokeWidth="1.5" rx="1" />
        {/* Polkolko wewnatrz cewki */}
        <path d="M 13,46 Q 18,40 23,46" fill="none" stroke="white" strokeWidth="1" />

        {/* Linia wyjsciowa */}
        <line x1="18" y1="54" x2="18" y2="70" stroke="white" strokeWidth="1.5" />
      </svg>

      <div className="text-xs font-bold mt-1 text-gray-200">{data.label}</div>
      {data.parameters.ratingCurrent && (
        <div className="text-[10px] text-gray-400">{String(data.parameters.ratingCurrent)}A</div>
      )}

      <Handle type="source" position={Position.Bottom} id="out" className="!bg-gray-700 !w-2 !h-2" />
    </div>
  );
}
