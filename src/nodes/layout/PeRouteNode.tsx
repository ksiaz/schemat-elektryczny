import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type PeRouteNodeType = Node<SchematicNodeData, 'peRoute'>;

// Punkt trasy PE — zolto-zielone kolko z 4 handlemi
export function PeRouteNode({ selected }: NodeProps<PeRouteNodeType>) {
  return (
    <div className={`${selected ? 'ring-1 ring-blue-400' : ''}`} style={{ width: 12, height: 12 }}>
      <Handle type="source" position={Position.Top} id="top" style={{ backgroundColor: '#228B22', left: 6, width: 8, height: 8, opacity: 1 }} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ backgroundColor: '#228B22', left: 6, width: 8, height: 8, opacity: 1 }} />
      <Handle type="source" position={Position.Left} id="left" style={{ backgroundColor: '#228B22', top: 6, width: 8, height: 8, opacity: 1 }} />
      <Handle type="source" position={Position.Right} id="right" style={{ backgroundColor: '#228B22', top: 6, width: 8, height: 8, opacity: 1 }} />

      <div style={{
        width: 10, height: 10, borderRadius: '50%',
        background: 'linear-gradient(135deg, #228B22 50%, #FFD700 50%)',
        border: '1px solid #228B22',
        position: 'absolute', top: 1, left: 1,
      }} />
    </div>
  );
}
