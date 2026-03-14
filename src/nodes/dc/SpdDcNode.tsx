import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type SpdDcNodeType = Node<SchematicNodeData, 'spdDc'>;

// SPD DC: 2x DC+ i 2x DC- u gory z oznaczeniami, symbol pod spodem, PE na dole
export function SpdDcNode({ data, selected }: NodeProps<SpdDcNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      {/* 4 zaciski u gory: +  +  -  - */}
      <Handle type="source" position={Position.Top} id="dc-plus-1" className="!w-3 !h-3" style={{ backgroundColor: WIRE_COLORS.DC, left: '15%' }} />
      <Handle type="source" position={Position.Top} id="dc-plus-2" className="!w-3 !h-3" style={{ backgroundColor: WIRE_COLORS.DC, left: '35%' }} />
      <Handle type="source" position={Position.Top} id="dc-minus-1" className="!w-3 !h-3" style={{ backgroundColor: WIRE_COLORS.N, left: '65%' }} />
      <Handle type="source" position={Position.Top} id="dc-minus-2" className="!w-3 !h-3" style={{ backgroundColor: WIRE_COLORS.N, left: '85%' }} />

      <svg width="90" height="70" viewBox="0 0 90 70">
        {/* Oznaczenia + + - - pod zaciskami */}
        <text x="14" y="10" textAnchor="middle" fontSize="11" fill="#FF0000" fontWeight="bold">+</text>
        <text x="32" y="10" textAnchor="middle" fontSize="11" fill="#FF0000" fontWeight="bold">+</text>
        <text x="58" y="10" textAnchor="middle" fontSize="11" fill="#0000CD" fontWeight="bold">−</text>
        <text x="76" y="10" textAnchor="middle" fontSize="11" fill="#0000CD" fontWeight="bold">−</text>

        {/* Linie od zaciskow do obudowy */}
        <line x1="14" y1="12" x2="14" y2="20" stroke="#FF0000" strokeWidth="1" />
        <line x1="32" y1="12" x2="32" y2="20" stroke="#FF0000" strokeWidth="1" />
        <line x1="58" y1="12" x2="58" y2="20" stroke="#0000CD" strokeWidth="1" />
        <line x1="76" y1="12" x2="76" y2="20" stroke="#0000CD" strokeWidth="1" />

        {/* Prostokat SPD */}
        <rect x="5" y="20" width="80" height="34" fill="none" stroke="#333" strokeWidth="1.5" rx="1" />

        {/* Blyskawica */}
        <polyline points="50,26 42,38 50,38 40,50" fill="none" stroke="#333" strokeWidth="1.8" strokeLinecap="round" />
        <polygon points="40,50 44,45 42,49" fill="#333" />

        {/* Linia PE */}
        <line x1="45" y1="54" x2="45" y2="70" stroke="#228B22" strokeWidth="1.5" />
      </svg>

      <div className="text-xs font-bold text-gray-800">{data.label}</div>
      {data.parameters.spdType && (
        <div className="text-[10px] text-gray-500">{String(data.parameters.spdType)}</div>
      )}

      {/* PE na dole */}
      <Handle type="source" position={Position.Bottom} id="pe" className="!w-3 !h-3" style={{ backgroundColor: WIRE_COLORS.PE }} />
    </div>
  );
}
