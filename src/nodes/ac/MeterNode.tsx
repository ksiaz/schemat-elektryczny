import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type MeterNodeType = Node<SchematicNodeData, 'meter'>;

// Licznik energii wg IEC 60617
// Okrag z literami "kWh" i symbolem dwukierunkowym (strzalki <->)
export function MeterNode({ data, selected }: NodeProps<MeterNodeType>) {
  const isBidirectional = data.parameters.bidirectional === 'Tak';

  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      <Handle type="target" position={Position.Top} id="in" className="!bg-gray-700 !w-2 !h-2" />

      <svg width="48" height="56" viewBox="0 0 48 56">
        {/* Linia wejsciowa */}
        <line x1="24" y1="0" x2="24" y2="8" stroke="white" strokeWidth="1.5" />

        {/* Okrag (symbol przyrządu pomiarowego wg IEC) */}
        <circle cx="24" cy="28" r="18" fill="none" stroke="white" strokeWidth="1.5" />

        {/* Tekst kWh */}
        <text x="24" y="26" textAnchor="middle" fontSize="8" fill="white" fontFamily="monospace" fontWeight="bold">kWh</text>

        {/* Symbol dwukierunkowy jesli dotyczy */}
        {isBidirectional && (
          <g>
            <line x1="14" y1="35" x2="34" y2="35" stroke="white" strokeWidth="0.8" />
            <polygon points="14,35 17,33 17,37" fill="white" />
            <polygon points="34,35 31,33 31,37" fill="white" />
          </g>
        )}

        {/* Linia wyjsciowa */}
        <line x1="24" y1="46" x2="24" y2="56" stroke="white" strokeWidth="1.5" />
      </svg>

      <div className="text-xs font-bold mt-1 text-gray-200">{data.label}</div>
      {data.parameters.model && (
        <div className="text-[10px] text-gray-400">{String(data.parameters.model)}</div>
      )}

      <Handle type="source" position={Position.Bottom} id="out" className="!bg-gray-700 !w-2 !h-2" />
    </div>
  );
}
