import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type BusbarNodeType = Node<SchematicNodeData, 'busbar'>;

// Szyna PE / PEN / N — kolorowana wg typu
const BUSBAR_COLORS: Record<string, string> = {
  PE: WIRE_COLORS.PE,
  PEN: '#228B22',
  N: WIRE_COLORS.N,
};

export function BusbarNode({ data, selected }: NodeProps<BusbarNodeType>) {
  const busbarType = String(data.parameters.busbarType || 'PE');
  const color = BUSBAR_COLORS[busbarType] || '#333';

  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      <Handle type="target" position={Position.Top} id="in" className="!w-2 !h-2" style={{ backgroundColor: color }} />

      <svg width="100" height="16" viewBox="0 0 100 16">
        <rect x="0" y="5" width="100" height="6" fill={color} rx="1" />
      </svg>

      <div className="text-xs font-bold mt-1" style={{ color }}>{data.label}</div>

      <Handle type="source" position={Position.Bottom} id="out-1" className="!w-2 !h-2" style={{ left: '25%', backgroundColor: color }} />
      <Handle type="source" position={Position.Bottom} id="out-2" className="!w-2 !h-2" style={{ left: '50%', backgroundColor: color }} />
      <Handle type="source" position={Position.Bottom} id="out-3" className="!w-2 !h-2" style={{ left: '75%', backgroundColor: color }} />
    </div>
  );
}
