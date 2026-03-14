import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type CornerPointNodeType = Node<SchematicNodeData, 'cornerPoint'>;

// Punkt naroznikowy — maly kwadracik z 4 handle'ami, do rysowania ksztaltow
export function CornerPointNode({ data, selected }: NodeProps<CornerPointNodeType>) {
  const color = String(data.parameters.color || '#333');

  return (
    <div className={`${selected ? 'ring-1 ring-blue-400' : ''}`} style={{ width: 8, height: 8 }}>
      <Handle type="source" position={Position.Top} id="top" className="!w-1 !h-1" style={{ backgroundColor: color, left: 4 }} />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!w-1 !h-1" style={{ backgroundColor: color, left: 4 }} />
      <Handle type="source" position={Position.Left} id="left" className="!w-1 !h-1" style={{ backgroundColor: color, top: 4 }} />
      <Handle type="source" position={Position.Right} id="right" className="!w-1 !h-1" style={{ backgroundColor: color, top: 4 }} />

      <div style={{ width: 6, height: 6, backgroundColor: color, border: '1px solid #333' }} />
    </div>
  );
}
