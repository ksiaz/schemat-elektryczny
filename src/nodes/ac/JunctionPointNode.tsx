import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type JunctionPointNodeType = Node<SchematicNodeData, 'junctionPoint'>;

// Punkt polaczeniowy — maly punkt z 4 zaciskami
export function JunctionPointNode({ selected }: NodeProps<JunctionPointNodeType>) {
  return (
    <div className={`flex items-center justify-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 10, height: 10 }}>
      <Handle type="source" position={Position.Top} id="top" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 5 }} />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 5 }} />
      <Handle type="source" position={Position.Left} id="left" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', top: 5 }} />
      <Handle type="source" position={Position.Right} id="right" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', top: 5 }} />

      <svg width="10" height="10" viewBox="0 0 10 10">
        <circle cx="5" cy="5" r="4" fill="#333" />
      </svg>
    </div>
  );
}
