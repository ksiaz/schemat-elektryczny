import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type CableRouteNodeType = Node<SchematicNodeData, 'cableRoute'>;

// Punkt trasy kablowej — laczy sie z innymi tworząc trase
export function CableRouteNode({ data, selected }: NodeProps<CableRouteNodeType>) {
  const color = String(data.parameters.routeColor || '#FF6600');

  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      <Handle type="target" position={Position.Top} id="in" className="!w-3 !h-3" style={{ backgroundColor: color }} />
      <Handle type="target" position={Position.Left} id="in-left" className="!w-3 !h-3" style={{ backgroundColor: color }} />

      <div
        className="w-4 h-4 rounded-full border-2"
        style={{ borderColor: color, backgroundColor: selected ? color : 'white' }}
      />

      {data.label && (
        <div className="text-[10px] font-bold mt-0.5" style={{ color }}>{data.label}</div>
      )}

      <Handle type="source" position={Position.Bottom} id="out" className="!w-3 !h-3" style={{ backgroundColor: color }} />
      <Handle type="source" position={Position.Right} id="out-right" className="!w-3 !h-3" style={{ backgroundColor: color }} />
    </div>
  );
}
