import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type SpdDcNodeType = Node<SchematicNodeData, 'spdDc'>;

// SPD DC: 3 zaciski — DC+ (wejscie), DC- (wejscie), PE/uziom (wyjscie dol)
export function SpdDcNode({ data, selected }: NodeProps<SpdDcNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      {/* DC+ i DC- na gorze */}
      <Handle type="target" position={Position.Top} id="in-dc-plus" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.DC, left: '30%' }} />
      <Handle type="target" position={Position.Top} id="in-dc-minus" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: '70%' }} />

      <svg width="50" height="55" viewBox="0 0 50 55">
        <line x1="25" y1="0" x2="25" y2="6" stroke="#333" strokeWidth="1.5" />
        <rect x="5" y="6" width="40" height="34" fill="none" stroke="#333" strokeWidth="1.5" rx="1" />
        <polyline points="28,12 22,22 28,22 20,34" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
        <polygon points="20,34 23,30 22,33" fill="#333" />
        <line x1="25" y1="40" x2="25" y2="55" stroke="#333" strokeWidth="1.5" />
      </svg>

      <div className="text-xs font-bold text-gray-800">{data.label}</div>
      {data.parameters.spdType && (
        <div className="text-[10px] text-gray-500">{String(data.parameters.spdType)}</div>
      )}

      {/* PE/uziom na dole */}
      <Handle type="source" position={Position.Bottom} id="out-PE" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.PE }} />
    </div>
  );
}
