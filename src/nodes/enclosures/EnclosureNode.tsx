import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type EnclosureNodeType = Node<SchematicNodeData, 'enclosure'>;

// Rozdzielnica — prostokat z kreskowana linia i tytulem
// Elementy wewnatrz okresla parentId (GroupNode React Flow)
export function EnclosureNode({ data, selected }: NodeProps<EnclosureNodeType>) {
  return (
    <div
      className={`relative min-w-[160px] min-h-[100px] ${
        selected ? 'ring-2 ring-blue-500' : ''
      }`}
      style={{
        border: `2px dashed ${selected ? '#3b82f6' : '#888'}`,
        borderRadius: '4px',
        padding: '24px 8px 8px 8px',
        background: 'transparent',
      }}
    >
      <Handle type="target" position={Position.Top} id="in" className="!bg-gray-400 !w-2 !h-2" />

      {/* Tytul rozdzielnicy — lewy gorny rog */}
      <div
        className="absolute top-0 left-2 px-1 text-xs font-bold text-gray-700"
        style={{ transform: 'translateY(-50%)', background: 'inherit' }}
      >
        {data.label}
      </div>

      <Handle type="source" position={Position.Bottom} id="out" className="!bg-gray-400 !w-2 !h-2" />
    </div>
  );
}
