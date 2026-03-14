import { Handle, Position, NodeResizer, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type BlackBoxNodeType = Node<SchematicNodeData, 'blackBox'>;

export function BlackBoxNode({ data, selected }: NodeProps<BlackBoxNodeType>) {
  const fontSize = Number(data.parameters.fontSize) || 12;

  return (
    <div className={`flex items-center justify-center w-full h-full ${selected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        border: '2px solid #333',
        borderRadius: '2px',
        minWidth: 80,
        minHeight: 40,
      }}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={80}
        minHeight={40}
        lineStyle={{ stroke: '#3b82f6', strokeWidth: 1 }}
        handleStyle={{ width: 8, height: 8, borderRadius: 2, backgroundColor: '#3b82f6', pointerEvents: 'all' }}
      />

      {/* Gora: L1, L2, L3, N, PE + 3 zapasowe */}
      <Handle type="source" position={Position.Top} id="in-L1" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L1, left: 10 }} />
      <Handle type="source" position={Position.Top} id="in-L2" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L2, left: 20 }} />
      <Handle type="source" position={Position.Top} id="in-L3" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L3, left: 30 }} />
      <Handle type="source" position={Position.Top} id="in-N" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 40 }} />
      <Handle type="source" position={Position.Top} id="in-PE" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.PE, left: 50 }} />
      <Handle type="source" position={Position.Top} id="in-6" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 70 }} />
      <Handle type="source" position={Position.Top} id="in-7" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 90 }} />
      <Handle type="source" position={Position.Top} id="in-8" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 110 }} />

      {/* Tytul */}
      <span style={{ fontSize: `${fontSize}px`, fontWeight: 'bold', color: '#333', pointerEvents: 'all' }}>
        {data.label}
      </span>

      {/* Dol */}
      <Handle type="source" position={Position.Bottom} id="out-L1" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L1, left: 10 }} />
      <Handle type="source" position={Position.Bottom} id="out-L2" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L2, left: 20 }} />
      <Handle type="source" position={Position.Bottom} id="out-L3" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L3, left: 30 }} />
      <Handle type="source" position={Position.Bottom} id="out-N" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 40 }} />
      <Handle type="source" position={Position.Bottom} id="out-PE" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.PE, left: 50 }} />
      <Handle type="source" position={Position.Bottom} id="out-6" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 70 }} />
      <Handle type="source" position={Position.Bottom} id="out-7" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 90 }} />
      <Handle type="source" position={Position.Bottom} id="out-8" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 110 }} />

      {/* Boki */}
      <Handle type="source" position={Position.Left} id="left-1" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', top: 10 }} />
      <Handle type="source" position={Position.Left} id="left-2" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', top: 30 }} />
      <Handle type="source" position={Position.Right} id="right-1" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', top: 10 }} />
      <Handle type="source" position={Position.Right} id="right-2" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', top: 30 }} />
    </div>
  );
}
