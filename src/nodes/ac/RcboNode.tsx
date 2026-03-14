import { Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { AcHandles } from './AcHandles.tsx';

type RcboNodeType = Node<SchematicNodeData, 'rcbo'>;

// RCBO = MCB + RCD: krzywki z wyzwalaczami + toroid
export function RcboNode({ data, selected }: NodeProps<RcboNodeType>) {
  // RCBO typowo 2P (L+N) — ale zostawiamy handle AC dla kompatybilnosci
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 80 }}>
      <AcHandles type="target" position={Position.Top} prefix="in" />

      <svg width="80" height="80" viewBox="0 0 80 80">
        {/* Krzywka z wyzwalaczami (jak MCB) */}
        <line x1="40" y1="0" x2="40" y2="10" stroke="#333" strokeWidth="1.5" />
        <line x1="40" y1="10" x2="50" y2="26" stroke="#333" strokeWidth="2" />
        {/* Wyzwalacz termiczny */}
        <rect x="46" y="18" width="5" height="4" fill="none" stroke="#333" strokeWidth="0.8" />
        {/* Wyzwalacz elektromagnetyczny */}
        <path d="M 37,30 A 4,4 0 0,1 45,30" fill="none" stroke="#333" strokeWidth="0.8" />
        <circle cx="40" cy="33" r="1.5" fill="#333" />

        {/* Toroid — symbol roznicowy */}
        <circle cx="40" cy="50" r="10" fill="none" stroke="#333" strokeWidth="1.2" />
        {/* Przewody przez toroid */}
        <line x1="35" y1="40" x2="35" y2="60" stroke="#333" strokeWidth="0.8" />
        <line x1="45" y1="40" x2="45" y2="60" stroke="#333" strokeWidth="0.8" />

        <line x1="40" y1="60" x2="40" y2="80" stroke="#333" strokeWidth="1.5" />

        {/* T */}
        <text x="75" y="52" fontSize="7" fill="#999" fontFamily="monospace">T</text>
      </svg>

      <div className="text-xs font-bold text-gray-800">{data.label}</div>
      {data.parameters.ratingCurrent && (
        <div className="text-[10px] text-gray-500">
          {data.parameters.curve ? `${String(data.parameters.curve)}` : ''}{String(data.parameters.ratingCurrent)}A {data.parameters.sensitivityCurrent ? `${String(data.parameters.sensitivityCurrent)}mA` : ''}
        </div>
      )}

      <AcHandles type="source" position={Position.Bottom} prefix="out" />
    </div>
  );
}
