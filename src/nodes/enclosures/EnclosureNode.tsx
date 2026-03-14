import { Handle, Position, NodeResizer, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type EnclosureNodeType = Node<SchematicNodeData, 'enclosure'>;

// Rozdzielnica — kreskowany prostokat z tytulem, resizable
export function EnclosureNode({ data, selected }: NodeProps<EnclosureNodeType>) {
  return (
    <div
      className="relative w-full h-full"
      style={{
        border: `2px dashed ${selected ? '#3b82f6' : '#888'}`,
        borderRadius: '4px',
        padding: '24px 8px 8px 8px',
        background: 'transparent',
        minWidth: 160,
        minHeight: 100,
      }}
    >
      {/* Resize handles — widoczne przy zaznaczeniu */}
      <NodeResizer
        isVisible={selected}
        minWidth={160}
        minHeight={100}
        lineStyle={{ stroke: '#3b82f6', strokeWidth: 1 }}
        handleStyle={{ width: 8, height: 8, borderRadius: 2, backgroundColor: '#3b82f6' }}
      />

      <Handle type="target" position={Position.Top} id="in" className="!bg-gray-500 !w-1.5 !h-1.5" />

      {/* Tytul — lewy gorny rog */}
      <div
        className="absolute top-0 left-2 px-1 text-xs font-bold text-gray-700"
        style={{ transform: 'translateY(-50%)', background: 'white' }}
      >
        {data.label}
      </div>

      <Handle type="source" position={Position.Bottom} id="out" className="!bg-gray-500 !w-1.5 !h-1.5" />
    </div>
  );
}
