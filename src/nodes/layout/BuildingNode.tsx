import { type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type BuildingNodeType = Node<SchematicNodeData, 'building'>;

// Zarys budynku — prostokatny kontener z etykieta
export function BuildingNode({ data, selected }: NodeProps<BuildingNodeType>) {
  return (
    <div
      className={`bg-amber-50 border-2 rounded ${selected ? 'border-blue-500' : 'border-amber-800'}`}
      style={{ width: 300, height: 200, position: 'relative' }}
    >
      <div className="absolute top-1 left-2 text-xs font-bold text-amber-800">
        {data.label}
      </div>
      {data.parameters.floors && (
        <div className="absolute bottom-1 left-2 text-[10px] text-amber-600">
          Pięter: {String(data.parameters.floors)}
        </div>
      )}
    </div>
  );
}
