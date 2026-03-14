import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type DcRouteNodeType = Node<SchematicNodeData, 'dcRoute'>;

// Punkt trasy DC — czerwone kolko z 4 handlemi, laczy sie z innymi tworząc trase
export function DcRouteNode({ data, selected }: NodeProps<DcRouteNodeType>) {
  return (
    <div className={`${selected ? 'ring-1 ring-blue-400' : ''}`} style={{ width: 12, height: 12 }}>
      <Handle type="source" position={Position.Top} id="top" style={{ backgroundColor: '#FF0000', left: 6, width: 8, height: 8, opacity: 1 }} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ backgroundColor: '#FF0000', left: 6, width: 8, height: 8, opacity: 1 }} />
      <Handle type="source" position={Position.Left} id="left" style={{ backgroundColor: '#FF0000', top: 6, width: 8, height: 8, opacity: 1 }} />
      <Handle type="source" position={Position.Right} id="right" style={{ backgroundColor: '#FF0000', top: 6, width: 8, height: 8, opacity: 1 }} />

      <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#FF0000', border: '1px solid #CC0000', position: 'absolute', top: 1, left: 1 }} />
    </div>
  );
}
