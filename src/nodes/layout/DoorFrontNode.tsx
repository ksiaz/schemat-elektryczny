import { NodeResizer, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type DoorFrontNodeType = Node<SchematicNodeData, 'doorFront'>;

export function DoorFrontNode({ data, selected }: NodeProps<DoorFrontNodeType>) {
  return (
    <div className={`w-full h-full ${selected ? 'ring-1 ring-blue-400' : ''}`} style={{ minWidth: 40, minHeight: 60 }}>
      <NodeResizer isVisible={selected} minWidth={40} minHeight={60}
        lineStyle={{ stroke: '#3b82f6', strokeWidth: 1 }}
        handleStyle={{ width: 6, height: 6, borderRadius: 2, backgroundColor: '#3b82f6', pointerEvents: 'all' }} />

      <svg width="100%" height="100%" viewBox="0 0 40 70" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
        <text x="20" y="-3" textAnchor="middle" fontSize="7" fill="#333">{data.label}</text>
        {/* Rama */}
        <rect x="2" y="2" width="36" height="66" fill="none" stroke="#333" strokeWidth="2" />
        {/* Panele */}
        <rect x="6" y="6" width="28" height="28" fill="none" stroke="#333" strokeWidth="1" />
        <rect x="6" y="38" width="28" height="26" fill="none" stroke="#333" strokeWidth="1" />
        {/* Klamka */}
        <circle cx="30" cy="42" r="2" fill="#333" />
      </svg>
    </div>
  );
}
