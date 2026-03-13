import { Handle, Position, useNodes, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type EnclosureNodeType = Node<SchematicNodeData, 'enclosure'>;

// Szerokosc jednego modulu DIN w px
const MODULE_WIDTH_PX = 18;

export function EnclosureNode({ id, data, selected }: NodeProps<EnclosureNodeType>) {
  const allNodes = useNodes();

  // Policz dzieci wewnatrz tej rozdzielnicy
  const childNodes = allNodes.filter((n) => n.parentId === id);
  const childCount = childNodes.length;

  // Maksymalna liczba modulow z parametrow
  const maxModules = Number(data.parameters.modules) || 24;

  return (
    <div
      className={`relative bg-gray-50 border-2 rounded-sm min-w-[200px] min-h-[120px] ${
        selected ? 'border-blue-500' : 'border-gray-400'
      }`}
      style={{ padding: '32px 12px 12px 12px' }}
    >
      {/* Handle wejsciowy (gora) */}
      <Handle type="target" position={Position.Top} id="in" className="!bg-gray-700 !w-2 !h-2" />

      {/* Naglowek rozdzielnicy */}
      <div className="absolute top-0 left-0 right-0 bg-gray-200 px-2 py-1 rounded-t-sm flex items-center justify-between">
        <span className="text-xs font-bold text-gray-700">{data.label}</span>
        <span className="text-[10px] text-gray-500">
          {childCount}/{maxModules} mod.
        </span>
      </div>

      {/* Szyna DIN — pozioma linia z otwartymi slotami */}
      <svg width="100%" height="8" className="mb-2">
        <line x1="0" y1="4" x2="100%" y2="4" stroke="#666" strokeWidth="2" />
        {/* Znaczniki modulow */}
        {Array.from({ length: Math.min(maxModules, 12) }).map((_, i) => (
          <line
            key={i}
            x1={10 + i * MODULE_WIDTH_PX}
            y1="0"
            x2={10 + i * MODULE_WIDTH_PX}
            y2="8"
            stroke="#999"
            strokeWidth="0.5"
          />
        ))}
      </svg>

      {/* Parametry */}
      <div className="text-[10px] text-gray-500 mt-1">
        {data.parameters.ip && <span>{String(data.parameters.ip)} </span>}
        {data.parameters.manufacturer && <span>{String(data.parameters.manufacturer)}</span>}
      </div>

      {/* Handle wyjsciowy (dol) */}
      <Handle type="source" position={Position.Bottom} id="out" className="!bg-gray-700 !w-2 !h-2" />
    </div>
  );
}
