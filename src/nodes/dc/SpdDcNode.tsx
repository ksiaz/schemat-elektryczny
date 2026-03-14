import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type SpdDcNodeType = Node<SchematicNodeData, 'spdDc'>;

// SPD DC: wiele punktow polaczeniowych DC+ i DC- z kazdej strony
// Kazdy punkt moze byc zrodlem lub celem — source na wszystkich
export function SpdDcNode({ data, selected }: NodeProps<SpdDcNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      {/* GORA: DC+ i DC- */}
      <Handle type="source" position={Position.Top} id="top-dc-plus" className="!w-3 !h-3" style={{ backgroundColor: WIRE_COLORS.DC, left: '30%' }} />
      <Handle type="source" position={Position.Top} id="top-dc-minus" className="!w-3 !h-3" style={{ backgroundColor: WIRE_COLORS.N, left: '70%' }} />

      {/* DOL: DC+ i DC- */}
      <Handle type="source" position={Position.Bottom} id="bot-dc-plus" className="!w-3 !h-3" style={{ backgroundColor: WIRE_COLORS.DC, left: '30%' }} />
      <Handle type="source" position={Position.Bottom} id="bot-dc-minus" className="!w-3 !h-3" style={{ backgroundColor: WIRE_COLORS.N, left: '70%' }} />

      {/* LEWO: DC+ */}
      <Handle type="source" position={Position.Left} id="left-dc-plus" className="!w-3 !h-3" style={{ backgroundColor: WIRE_COLORS.DC, top: '35%' }} />
      {/* PRAWO: DC- */}
      <Handle type="source" position={Position.Right} id="right-dc-minus" className="!w-3 !h-3" style={{ backgroundColor: WIRE_COLORS.N, top: '35%' }} />

      {/* PE — uziom na dole srodek lub lewy bok */}
      <Handle type="source" position={Position.Left} id="pe" className="!w-3 !h-3" style={{ backgroundColor: WIRE_COLORS.PE, top: '65%' }} />

      <svg width="50" height="50" viewBox="0 0 50 50">
        <line x1="15" y1="0" x2="15" y2="6" stroke="#FF0000" strokeWidth="1" />
        <line x1="35" y1="0" x2="35" y2="6" stroke="#0000CD" strokeWidth="1" />
        <rect x="5" y="6" width="40" height="34" fill="none" stroke="#333" strokeWidth="1.5" rx="1" />
        <polyline points="28,12 22,22 28,22 20,34" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
        <polygon points="20,34 23,30 22,33" fill="#333" />
        <line x1="15" y1="40" x2="15" y2="50" stroke="#FF0000" strokeWidth="1" />
        <line x1="35" y1="40" x2="35" y2="50" stroke="#0000CD" strokeWidth="1" />
      </svg>

      <div className="text-xs font-bold text-gray-800">{data.label}</div>
      {data.parameters.spdType && (
        <div className="text-[10px] text-gray-500">{String(data.parameters.spdType)}</div>
      )}
    </div>
  );
}
