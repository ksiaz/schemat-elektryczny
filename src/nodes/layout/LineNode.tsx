import { Handle, Position, NodeResizer, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type LineNodeType = Node<SchematicNodeData, 'layoutLine'>;

// Linia prosta — pionowa lub pozioma, resizable
export function LineNode({ data, selected }: NodeProps<LineNodeType>) {
  const orientation = String(data.parameters.orientation || 'pozioma');
  const color = String(data.parameters.color || '#333');
  const lineWidth = Number(data.parameters.lineWidth) || 2;
  const isHorizontal = orientation === 'pozioma';

  return (
    <div
      className={`${selected ? 'ring-1 ring-blue-400' : ''}`}
      style={{
        width: '100%',
        height: '100%',
        minWidth: isHorizontal ? 50 : 4,
        minHeight: isHorizontal ? 4 : 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={isHorizontal ? 50 : 4}
        minHeight={isHorizontal ? 4 : 50}
        lineStyle={{ stroke: '#3b82f6', strokeWidth: 1 }}
        handleStyle={{ width: 6, height: 6, borderRadius: 2, backgroundColor: '#3b82f6', pointerEvents: 'all' }}
      />

      {isHorizontal ? (
        <>
          <Handle type="source" position={Position.Left} id="left" className="!w-1.5 !h-1.5" style={{ backgroundColor: color }} />
          <div style={{ width: '100%', height: lineWidth, backgroundColor: color }} />
          <Handle type="source" position={Position.Right} id="right" className="!w-1.5 !h-1.5" style={{ backgroundColor: color }} />
        </>
      ) : (
        <>
          <Handle type="source" position={Position.Top} id="top" className="!w-1.5 !h-1.5" style={{ backgroundColor: color }} />
          <div style={{ width: lineWidth, height: '100%', backgroundColor: color }} />
          <Handle type="source" position={Position.Bottom} id="bottom" className="!w-1.5 !h-1.5" style={{ backgroundColor: color }} />
        </>
      )}
    </div>
  );
}
