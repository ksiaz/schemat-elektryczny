import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldMeter'>;

export function SldMeterNode({ data, selected }: NodeProps<T>) {
  const bidir = String(data.parameters.direction ?? '1-kier') === '2-kier';
  const phases = String(data.parameters.phases ?? '1');
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 50, height: 50 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333' }} />
      <svg width="50" height="50" viewBox="0 0 50 50" style={{ overflow: 'visible' }}>
        <text x="25" y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#333">{data.label || 'P1'}</text>
        <circle cx="25" cy="25" r="18" fill="white" stroke="#222" strokeWidth="1.5" />
        <text x="25" y="29" textAnchor="middle" fontSize="10" fill="#222">{bidir ? 'kWh' : 'Wh'}</text>
        {bidir && (
          <>
            <path d="M 8,20 L 4,24 L 8,28" fill="none" stroke="#222" strokeWidth="1" />
            <path d="M 42,20 L 46,24 L 42,28" fill="none" stroke="#222" strokeWidth="1" />
          </>
        )}
        <text x="25" y="58" textAnchor="middle" fontSize="7" fill="#888">{phases}P {bidir ? '2-kier' : '1-kier'}</text>
      </svg>
      <Handle type="source" position={Position.Bottom} id="out" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#333' }} />
    </div>
  );
}
