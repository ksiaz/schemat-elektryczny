import { NodeResizer, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type BuildingNodeType = Node<SchematicNodeData, 'building'>;

// Budynek — prostokat resizable, uzyj wielu budynkow + linii dla ksztaltow L/T
// Lub wpisz punkty recznie w Properties
export function BuildingNode({ data, selected }: NodeProps<BuildingNodeType>) {
  const lineWidth = Number(data.parameters.lineWidth) || 2;
  const color = String(data.parameters.color || '#333');
  const fill = String(data.parameters.fill || 'none');

  return (
    <div
      className="building-node w-full h-full relative"
      style={{
        border: `${lineWidth}px solid ${selected ? '#3b82f6' : color}`,
        minWidth: 20,
        minHeight: 20,
        background: fill === 'none' ? 'transparent' : fill,
      }}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={20}
        minHeight={20}
        lineStyle={{ stroke: '#3b82f6', strokeWidth: 1 }}
        handleStyle={{ width: 6, height: 6, borderRadius: 2, backgroundColor: '#3b82f6', pointerEvents: 'all' }}
      />

      {data.label && (
        <div className="absolute top-0 left-1 text-[9px] font-bold" style={{ color, pointerEvents: 'all', cursor: 'grab' }}>
          {data.label}
        </div>
      )}
    </div>
  );
}
