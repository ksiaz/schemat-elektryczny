import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type InverterNodeType = Node<SchematicNodeData, 'inverter'>;

// Falownik — prostokat z "3~" (AC) i "=" (DC), sinusoida
// Styl jak na schematach blokowych polskich instalatorow
export function InverterNode({ data, selected }: NodeProps<InverterNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <Handle type="target" position={Position.Top} id="dc-in" className="!bg-red-500 !w-2 !h-2" />
      <Handle type="target" position={Position.Left} id="dc-in-left" className="!bg-red-500 !w-2 !h-2" />

      <svg width="80" height="80" viewBox="0 0 80 80">
        {/* Prostokat obudowy */}
        <rect x="4" y="4" width="72" height="72" fill="none" stroke="white" strokeWidth="1.5" />

        {/* Sinusoida AC u gory */}
        <path d="M 20,25 Q 30,15 40,25 Q 50,35 60,25" fill="none" stroke="white" strokeWidth="1.2" />

        {/* 3~ — trojfazowy AC */}
        <text x="40" y="45" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold" fontFamily="monospace">3~</text>

        {/* = — DC */}
        <line x1="25" y1="58" x2="55" y2="58" stroke="white" strokeWidth="1.5" />
        <line x1="25" y1="63" x2="55" y2="63" stroke="white" strokeWidth="1.5" />

        {/* Kreski hatching w rogu (styl z Budziszynskiej) */}
        <line x1="60" y1="4" x2="76" y2="20" stroke="white" strokeWidth="0.5" />
        <line x1="65" y1="4" x2="76" y2="15" stroke="white" strokeWidth="0.5" />
        <line x1="70" y1="4" x2="76" y2="10" stroke="white" strokeWidth="0.5" />
      </svg>

      <div className="text-xs font-bold mt-1 text-gray-200">{data.label}</div>
      {data.parameters.model && (
        <div className="text-[10px] text-gray-400">{String(data.parameters.model)}</div>
      )}
      {data.parameters.power && (
        <div className="text-[10px] text-gray-400">{String(data.parameters.power)} kW</div>
      )}

      <Handle type="source" position={Position.Bottom} id="ac-out" className="!bg-gray-500 !w-2 !h-2" />
      <Handle type="source" position={Position.Right} id="ac-out-right" className="!bg-gray-500 !w-2 !h-2" />
    </div>
  );
}
