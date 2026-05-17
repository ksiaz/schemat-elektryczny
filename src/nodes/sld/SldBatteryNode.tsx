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
        {/* doprowadzenie — jeden punkt polaczeniowy od gory */}
        <line x1="25" y1="0" x2="25" y2="12" stroke="#222" strokeWidth="1.5" />
        {/* prostokat — obudowa magazynu */}
        <rect x="6" y="12" width="38" height="26" rx="2" fill="white" stroke="#222" strokeWidth="1.8" />
        {/* symbol baterii wewnatrz */}
        <rect x="14" y="19" width="19" height="13" rx="1.5" fill="white" stroke="#222" strokeWidth="1.4" />
        <rect x="33" y="22.5" width="3" height="6" rx="0.8" fill="#222" />
        <rect x="16.5" y="21.5" width="13" height="8" rx="0.8" fill="#16a34a" />
        <text x="25" y="47" textAnchor="middle" fontSize="7" fill="#888">{chem} {cap}kWh {v}V</text>
      </svg>
    </div>
  );
}
