import { type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type RoofNodeType = Node<SchematicNodeData, 'roof'>;

// Zarys dachu — trojkat/trapez
export function RoofNode({ data, selected }: NodeProps<RoofNodeType>) {
  const roofType = String(data.parameters.roofType || 'dwuspadowy');

  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      <svg width="300" height="60" viewBox="0 0 300 60">
        {roofType === 'plaski' ? (
          <rect x="10" y="20" width="280" height="30" fill="#D2691E" fillOpacity="0.2" stroke="#8B4513" strokeWidth="2" />
        ) : (
          <polygon points="150,5 10,55 290,55" fill="#D2691E" fillOpacity="0.2" stroke="#8B4513" strokeWidth="2" />
        )}
      </svg>
      <div className="text-xs font-bold text-amber-800">{data.label}</div>
    </div>
  );
}
