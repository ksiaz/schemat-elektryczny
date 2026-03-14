import { Handle, Position, useNodes, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type EnclosureNodeType = Node<SchematicNodeData, 'enclosure'>;

const MODULE_WIDTH_PX = 18;

export function EnclosureNode({ id, data, selected }: NodeProps<EnclosureNodeType>) {
  const allNodes = useNodes();
  const childNodes = allNodes.filter((n) => n.parentId === id);
  const childCount = childNodes.length;
  const maxModules = Number(data.parameters.modules) || 24;

  return (
    <div
      className={`relative bg-[#1e1e30] border-2 rounded-sm min-w-[200px] min-h-[120px] ${
        selected ? 'border-blue-500' : 'border-gray-500'
      }`}
      style={{ padding: '32px 12px 12px 12px' }}
    >
      <Handle type="target" position={Position.Top} id="in" className="!bg-gray-400 !w-2 !h-2" />

      <div className="absolute top-0 left-0 right-0 bg-[#2a2a45] px-2 py-1 rounded-t-sm flex items-center justify-between border-b border-[#3a3a5c]">
        <span className="text-xs font-bold text-gray-200">{data.label}</span>
        <span className="text-[10px] text-gray-400">
          {childCount}/{maxModules} mod.
        </span>
      </div>

      <svg width="100%" height="8" className="mb-2">
        <line x1="0" y1="4" x2="100%" y2="4" stroke="#666" strokeWidth="2" />
        {Array.from({ length: Math.min(maxModules, 12) }).map((_, i) => (
          <line
            key={i}
            x1={10 + i * MODULE_WIDTH_PX} y1="0"
            x2={10 + i * MODULE_WIDTH_PX} y2="8"
            stroke="#555" strokeWidth="0.5"
          />
        ))}
      </svg>

      <div className="text-[10px] text-gray-400 mt-1">
        {data.parameters.ip && <span>{String(data.parameters.ip)} </span>}
        {data.parameters.manufacturer && <span>{String(data.parameters.manufacturer)}</span>}
      </div>

      <Handle type="source" position={Position.Bottom} id="out" className="!bg-gray-400 !w-2 !h-2" />
    </div>
  );
}
