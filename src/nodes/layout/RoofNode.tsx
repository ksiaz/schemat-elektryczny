import { NodeResizer, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type RoofNodeType = Node<SchematicNodeData, 'roof'>;

// Zarys dachu — resizable, kontur
export function RoofNode({ data, selected }: NodeProps<RoofNodeType>) {
  const roofType = String(data.parameters.roofType || 'dwuspadowy');
  const color = String(data.parameters.color || '#8B4513');

  return (
    <div
      className={`roof-node w-full h-full relative ${selected ? 'ring-1 ring-blue-400' : ''}`}
      style={{ minWidth: 100, minHeight: 40 }}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={100}
        minHeight={40}
        lineStyle={{ stroke: '#3b82f6', strokeWidth: 1 }}
        handleStyle={{ width: 8, height: 8, borderRadius: 2, backgroundColor: '#3b82f6', pointerEvents: 'all' }}
      />

      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
        <text x="50" y="-4" textAnchor="middle" fontSize="8" fill={color} fontWeight="bold">{data.label}</text>

        {roofType === 'płaski' ? (
          <rect x="2" y="2" width="96" height="96" fill="rgba(210, 105, 30, 0.1)" stroke={color} strokeWidth="2" />
        ) : roofType === 'jednospadowy' ? (
          <polygon points="2,98 2,20 98,2 98,98" fill="rgba(210, 105, 30, 0.1)" stroke={color} strokeWidth="2" />
        ) : (
          <polygon points="50,2 2,98 98,98" fill="rgba(210, 105, 30, 0.1)" stroke={color} strokeWidth="2" />
        )}
      </svg>
    </div>
  );
}
