import { NodeResizer, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type DoorNodeType = Node<SchematicNodeData, 'door'>;

// Drzwi 2D — luk otwarcia + linia sciany
export function DoorNode({ data, selected }: NodeProps<DoorNodeType>) {
  const rotation = Number(data.parameters.rotation) || 0;
  const width = Number(data.parameters.doorWidth) || 90;

  return (
    <div
      className={`${selected ? 'ring-1 ring-blue-400' : ''}`}
      style={{ width: width, height: width, cursor: 'move' }}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={40}
        minHeight={40}
        lineStyle={{ stroke: '#3b82f6', strokeWidth: 1 }}
        handleStyle={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#3b82f6', pointerEvents: 'all' }}
      />

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        style={{ overflow: 'visible', transform: `rotate(${rotation}deg)`, transformOrigin: '0 100%' }}
      >
        {/* Linia sciany (przerwa na drzwi) */}
        <line x1="0" y1="100" x2="0" y2="0" stroke="#333" strokeWidth="3" />

        {/* Skrzydlo drzwi */}
        <line x1="0" y1="100" x2="100" y2="100" stroke="#333" strokeWidth="1.5" />

        {/* Luk otwarcia 90 stopni */}
        <path d="M 100,100 A 100,100 0 0,0 0,0" fill="none" stroke="#333" strokeWidth="1" strokeDasharray="4,3" />
      </svg>
    </div>
  );
}
