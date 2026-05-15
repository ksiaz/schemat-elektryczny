import { type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldOsdBoundary'>;

export function SldOsdBoundaryNode({ data, selected }: NodeProps<T>) {
  const labelText = String(data.parameters.label ?? 'Granica własności OSD');
  return (
    <div className={`${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 200, height: 80, pointerEvents: 'all' }}>
      <svg width="200" height="80" viewBox="0 0 200 80" style={{ overflow: 'visible' }}>
        <line x1="100" y1="0" x2="100" y2="80" stroke="#b91c1c" strokeWidth="1.2" strokeDasharray="6,4" />
        <text x="100" y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#b91c1c">{labelText}</text>
        <text x="105" y="40" fontSize="8" fill="#b91c1c">→ OSD</text>
        <text x="95" y="40" textAnchor="end" fontSize="8" fill="#b91c1c">odbiorca ←</text>
      </svg>
    </div>
  );
}
