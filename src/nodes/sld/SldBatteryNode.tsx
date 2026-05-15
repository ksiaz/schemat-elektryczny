import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldBattery'>;

export function SldBatteryNode({ data, selected }: NodeProps<T>) {
  const cap = data.parameters.capacity ?? '';
  const v = data.parameters.voltage ?? '';
  const chem = String(data.parameters.chemistry ?? 'LiFePO4');
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 50, height: 50 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 25 }} />
      <svg width="50" height="50" viewBox="0 0 50 50" style={{ overflow: 'visible' }}>
        <text x="25" y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label || 'BAT'}</text>
        <line x1="25" y1="0" x2="25" y2="14" stroke="#222" strokeWidth="1.5" />
        <line x1="10" y1="18" x2="40" y2="18" stroke="#222" strokeWidth="2.5" />
        <line x1="16" y1="22" x2="34" y2="22" stroke="#222" strokeWidth="1" />
        <line x1="10" y1="26" x2="40" y2="26" stroke="#222" strokeWidth="2.5" />
        <line x1="16" y1="30" x2="34" y2="30" stroke="#222" strokeWidth="1" />
        <text x="6" y="20" fontSize="9" fontWeight="bold" fill="#222">+</text>
        <text x="6" y="32" fontSize="9" fontWeight="bold" fill="#222">−</text>
        <line x1="25" y1="32" x2="25" y2="50" stroke="#222" strokeWidth="1.5" />
        <text x="25" y="58" textAnchor="middle" fontSize="7" fill="#888">{chem} {cap}kWh {v}V</text>
      </svg>
      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 25 }} />
    </div>
  );
}
