import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type CtNodeType = Node<SchematicNodeData, 'ct'>;

// Przekladnik pradowy CT — przelotowy (1 zacisk gora + 1 dol) + 2 wyjscia sygnalowe
export function CtNode({ data, selected }: NodeProps<CtNodeType>) {
  const color = String(data.parameters.color || '#333');

  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 40 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: color, left: 20 }} />

      <svg width="40" height="40" viewBox="0 0 40 40" style={{ overflow: 'visible' }}>
        <text x="20" y="-4" textAnchor="middle" fontSize="9" fill="#333" fontWeight="bold">{data.label}</text>

        {/* Przewod przelotowy */}
        <line x1="20" y1="0" x2="20" y2="40" stroke={color} strokeWidth="1.5" />

        {/* Rdzen — kolko (przekladnik) */}
        <circle cx="20" cy="20" r="10" fill="white" stroke="#333" strokeWidth="1.5" />

        {/* Symbol uzwojenia wtornego */}
        <path d="M 15,16 Q 20,12 25,16" fill="none" stroke="#333" strokeWidth="1" />
        <path d="M 15,20 Q 20,24 25,20" fill="none" stroke="#333" strokeWidth="1" />

        {/* Wyjscia sygnalowe — prawy bok */}
        <line x1="30" y1="16" x2="40" y2="16" stroke="#333" strokeWidth="0.8" />
        <line x1="30" y1="24" x2="40" y2="24" stroke="#333" strokeWidth="0.8" />
      </svg>

      {data.parameters.ratio && (
        <div className="text-[9px] text-gray-500">{String(data.parameters.ratio)}</div>
      )}

      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: color, left: 20 }} />
      {/* Wyjscia sygnalowe */}
      <Handle type="source" position={Position.Right} id="sig-1" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', top: 16 }} />
      <Handle type="source" position={Position.Right} id="sig-2" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', top: 26 }} />
    </div>
  );
}
