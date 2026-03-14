import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type WirePointNodeType = Node<SchematicNodeData, 'wirePoint'>;

const POINT_COLORS: Record<string, string> = {
  L1: WIRE_COLORS.L1,
  L2: WIRE_COLORS.L2,
  L3: WIRE_COLORS.L3,
  N: WIRE_COLORS.N,
  PE: WIRE_COLORS.PE,
};

// Punkt przewodu — maly koleczko z etykieta, 4 zaciski (gora/dol/lewo/prawo)
export function WirePointNode({ data, selected }: NodeProps<WirePointNodeType>) {
  const wireType = String(data.parameters.wireType || 'L1');
  const color = POINT_COLORS[wireType] || '#333';

  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 20 }}>
      <Handle type="source" position={Position.Top} id="top" className="!w-1.5 !h-1.5" style={{ backgroundColor: color, left: 10 }} />
      <Handle type="source" position={Position.Left} id="left" className="!w-1.5 !h-1.5" style={{ backgroundColor: color, top: 10 }} />

      <svg width="20" height="20" viewBox="0 0 20 20" style={{ overflow: 'visible' }}>
        <circle cx="10" cy="10" r="5" fill={color} stroke="#333" strokeWidth="1" />
        <text x="10" y="-3" textAnchor="middle" fontSize="8" fill={color} fontWeight="bold">{wireType}</text>
      </svg>

      <Handle type="source" position={Position.Right} id="right" className="!w-1.5 !h-1.5" style={{ backgroundColor: color, top: 10 }} />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!w-1.5 !h-1.5" style={{ backgroundColor: color, left: 10 }} />
    </div>
  );
}
