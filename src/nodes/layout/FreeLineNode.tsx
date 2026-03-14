import { NodeResizer, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type FreeLineNodeType = Node<SchematicNodeData, 'freeLine'>;

// Linia prosta z obracaniem — ustaw dlugosc (resize szerokosc) i kat (Properties)
export function FreeLineNode({ data, selected }: NodeProps<FreeLineNodeType>) {
  const color = String(data.parameters.color || '#333');
  const lineWidth = Number(data.parameters.lineWidth) || 2;
  const rotation = Number(data.parameters.rotation) || 0;
  const dashed = data.parameters.style === 'kreskowana';

  return (
    <div
      className="w-full relative"
      style={{
        height: lineWidth + 8,
        minWidth: 20,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'left center',
      }}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={20}
        minHeight={lineWidth + 8}
        lineStyle={{ stroke: '#3b82f6', strokeWidth: 1 }}
        handleStyle={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#3b82f6', pointerEvents: 'all' }}
      />

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: lineWidth,
          marginTop: -lineWidth / 2,
          backgroundColor: color,
          backgroundImage: dashed ? `repeating-linear-gradient(90deg, ${color} 0px, ${color} 6px, transparent 6px, transparent 10px)` : 'none',
          background: dashed ? undefined : color,
        }}
      />

      {data.label && (
        <div
          className="absolute text-[8px] font-bold"
          style={{ color, top: -12, left: 0, whiteSpace: 'nowrap' }}
        >
          {data.label}
        </div>
      )}
    </div>
  );
}
