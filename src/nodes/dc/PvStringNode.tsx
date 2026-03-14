import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type PvStringNodeType = Node<SchematicNodeData, 'pvString'>;

export function PvStringNode({ data, selected }: NodeProps<PvStringNodeType>) {
  const panelCount = data.parameters.panelCount || '';
  const model = data.parameters.model || '';

  return (
    <div className={`flex flex-row items-center gap-2 ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 140 }}>
      <svg width="80" height="60" viewBox="0 0 80 60">
        <rect x="2" y="2" width="76" height="56" fill="none" stroke="#333" strokeWidth="2" />
        <polygon points="20,48 60,48 40,12" fill="none" stroke="#333" strokeWidth="1.5" />
        <line x1="30" y1="8" x2="26" y2="2" stroke="#333" strokeWidth="1" />
        <line x1="40" y1="5" x2="40" y2="0" stroke="#333" strokeWidth="1" />
      </svg>
      <div className="flex flex-col text-left">
        <div className="text-xs text-gray-800 font-bold leading-tight">{panelCount && `${String(panelCount)} szt.`}</div>
        {model && <div className="text-[10px] text-gray-500 leading-tight">{String(model)}</div>}
      </div>

      <Handle type="source" position={Position.Bottom} id="dc-plus" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.DC, left: 20 }} />
      <Handle type="source" position={Position.Bottom} id="dc-minus" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 40 }} />
      <Handle type="source" position={Position.Bottom} id="pe" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.PE, left: 60 }} />
    </div>
  );
}
