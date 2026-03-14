import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type CornerPointNodeType = Node<SchematicNodeData, 'cornerPoint'>;

// Punkt naroznikowy — do rysowania ksztaltow dachu, polacz kablem
export function CornerPointNode({ data, selected }: NodeProps<CornerPointNodeType>) {
  const color = String(data.parameters.color || '#333');

  return (
    <div
      className={`${selected ? 'ring-2 ring-blue-400' : ''}`}
      style={{ width: 12, height: 12, position: 'relative' }}
    >
      {/* Handle zawsze widoczne — nadpisuje opacity:0 */}
      <Handle type="source" position={Position.Top} id="top"
        style={{ backgroundColor: color, left: 6, width: 8, height: 8, opacity: 1 }} />
      <Handle type="source" position={Position.Bottom} id="bottom"
        style={{ backgroundColor: color, left: 6, width: 8, height: 8, opacity: 1 }} />
      <Handle type="source" position={Position.Left} id="left"
        style={{ backgroundColor: color, top: 6, width: 8, height: 8, opacity: 1 }} />
      <Handle type="source" position={Position.Right} id="right"
        style={{ backgroundColor: color, top: 6, width: 8, height: 8, opacity: 1 }} />

      <div style={{
        width: 10, height: 10, backgroundColor: color, border: '1px solid #333',
        position: 'absolute', top: 1, left: 1,
      }} />
    </div>
  );
}
