import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldBattery'>;

export function SldBatteryNode({ data, selected }: NodeProps<T>) {
  const cap = data.parameters.capacity ?? '';
  const v = data.parameters.voltage ?? '';
  const chem = String(data.parameters.chemistry ?? 'LiFePO4');
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 60, height: 50 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 30 }} />
      <svg width="50" height="50" viewBox="0 0 50 50" style={{ overflow: 'visible' }}>
        <text x="25" y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label || 'BAT'}</text>
        {/* doprowadzenie + biegun dodatni */}
        <line x1="25" y1="0" x2="25" y2="9" stroke="#222" strokeWidth="1.5" />
        <rect x="20" y="7" width="10" height="4" rx="1" fill="#222" />
        {/* korpus akumulatora */}
        <rect x="8" y="12" width="34" height="22" rx="3" fill="white" stroke="#222" strokeWidth="1.8" />
        {/* segmenty naladowania */}
        <rect x="12" y="16" width="7" height="14" rx="1.2" fill="#16a34a" />
        <rect x="21.5" y="16" width="7" height="14" rx="1.2" fill="#16a34a" />
        <rect x="31" y="16" width="7" height="14" rx="1.2" fill="#16a34a" />
        {/* odprowadzenie — biegun ujemny */}
        <line x1="25" y1="34" x2="25" y2="50" stroke="#222" strokeWidth="1.5" />
        <text x="25" y="58" textAnchor="middle" fontSize="7" fill="#888">{chem} {cap}kWh {v}V</text>
      </svg>
      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333', left: 30 }} />
    </div>
  );
}
