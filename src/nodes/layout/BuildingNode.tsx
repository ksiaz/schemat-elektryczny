import { NodeResizer, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type BuildingNodeType = Node<SchematicNodeData, 'building'>;

// Zarys budynku — resizable, kontur gruba linia
export function BuildingNode({ data, selected }: NodeProps<BuildingNodeType>) {
  const lineWidth = Number(data.parameters.lineWidth) || 3;
  const color = String(data.parameters.color || '#8B4513');

  return (
    <div
      className="w-full h-full relative"
      style={{
        border: `${lineWidth}px solid ${selected ? '#3b82f6' : color}`,
        borderRadius: '2px',
        background: 'rgba(255, 248, 230, 0.3)',
        minWidth: 100,
        minHeight: 60,
      }}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={100}
        minHeight={60}
        lineStyle={{ stroke: '#3b82f6', strokeWidth: 1 }}
        handleStyle={{ width: 8, height: 8, borderRadius: 2, backgroundColor: '#3b82f6', pointerEvents: 'all' }}
      />

      <div className="absolute top-1 left-2 text-xs font-bold" style={{ color }}>
        {data.label}
      </div>
      {data.parameters.floors && (
        <div className="absolute bottom-1 left-2 text-[10px]" style={{ color }}>
          Pięter: {String(data.parameters.floors)}
        </div>
      )}
    </div>
  );
}
