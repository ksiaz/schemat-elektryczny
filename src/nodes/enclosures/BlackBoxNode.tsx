import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type BlackBoxNodeType = Node<SchematicNodeData, 'blackBox'>;

// Rozdzielnica uproszczona — prostokat z tytulem i zaciskami, bez wnetrza
// Wchodzisz przewodami, nie rysujesz schematu wewnatrz
export function BlackBoxNode({ data, selected }: NodeProps<BlackBoxNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 120 }}>
      {/* 8 zaciskow u gory: L1, L2, L3, N, PE + 3 zapasowe */}
      <Handle type="source" position={Position.Top} id="in-L1" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L1, left: 10 }} />
      <Handle type="source" position={Position.Top} id="in-L2" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L2, left: 20 }} />
      <Handle type="source" position={Position.Top} id="in-L3" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L3, left: 30 }} />
      <Handle type="source" position={Position.Top} id="in-N" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 40 }} />
      <Handle type="source" position={Position.Top} id="in-PE" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.PE, left: 50 }} />
      <Handle type="source" position={Position.Top} id="in-6" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 70 }} />
      <Handle type="source" position={Position.Top} id="in-7" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 90 }} />
      <Handle type="source" position={Position.Top} id="in-8" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 110 }} />

      <svg width="120" height="50" viewBox="0 0 120 50">
        <rect x="2" y="2" width="116" height="46" fill="none" stroke="#333" strokeWidth="1.5" rx="2" />
        <text x="60" y="30" textAnchor="middle" fontSize="11" fill="#333" fontWeight="bold">{data.label}</text>
      </svg>

      {/* 8 zaciskow na dole */}
      <Handle type="source" position={Position.Bottom} id="out-L1" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L1, left: 10 }} />
      <Handle type="source" position={Position.Bottom} id="out-L2" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L2, left: 20 }} />
      <Handle type="source" position={Position.Bottom} id="out-L3" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L3, left: 30 }} />
      <Handle type="source" position={Position.Bottom} id="out-N" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 40 }} />
      <Handle type="source" position={Position.Bottom} id="out-PE" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.PE, left: 50 }} />
      <Handle type="source" position={Position.Bottom} id="out-6" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 70 }} />
      <Handle type="source" position={Position.Bottom} id="out-7" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 90 }} />
      <Handle type="source" position={Position.Bottom} id="out-8" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 110 }} />

      {/* Zaciski boczne */}
      <Handle type="source" position={Position.Left} id="left-1" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', top: 10 }} />
      <Handle type="source" position={Position.Left} id="left-2" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', top: 30 }} />
      <Handle type="source" position={Position.Right} id="right-1" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', top: 10 }} />
      <Handle type="source" position={Position.Right} id="right-2" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', top: 30 }} />
    </div>
  );
}
