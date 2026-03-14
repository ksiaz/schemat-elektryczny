import { NodeResizer, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type DoubleWindowNodeType = Node<SchematicNodeData, 'doubleWindow'>;

export function DoubleWindowNode({ data, selected }: NodeProps<DoubleWindowNodeType>) {
  return (
    <div className={`w-full h-full ${selected ? 'ring-1 ring-blue-400' : ''}`} style={{ minWidth: 60, minHeight: 40 }}>
      <NodeResizer isVisible={selected} minWidth={60} minHeight={40}
        lineStyle={{ stroke: '#3b82f6', strokeWidth: 1 }}
        handleStyle={{ width: 6, height: 6, borderRadius: 2, backgroundColor: '#3b82f6', pointerEvents: 'all' }} />

      <svg width="100%" height="100%" viewBox="0 0 60 40" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
        <text x="30" y="-3" textAnchor="middle" fontSize="7" fill="#333">{data.label}</text>
        {/* Rama zewnetrzna */}
        <rect x="2" y="2" width="56" height="36" fill="rgba(200,220,255,0.2)" stroke="#333" strokeWidth="2" />
        {/* Srodkowy slupek */}
        <line x1="30" y1="2" x2="30" y2="38" stroke="#333" strokeWidth="2" />
        {/* Krzyze szprosow — lewe okno */}
        <line x1="2" y1="20" x2="30" y2="20" stroke="#333" strokeWidth="0.8" />
        <line x1="16" y1="2" x2="16" y2="38" stroke="#333" strokeWidth="0.8" />
        {/* Krzyze szprosow — prawe okno */}
        <line x1="30" y1="20" x2="58" y2="20" stroke="#333" strokeWidth="0.8" />
        <line x1="44" y1="2" x2="44" y2="38" stroke="#333" strokeWidth="0.8" />
      </svg>
    </div>
  );
}
