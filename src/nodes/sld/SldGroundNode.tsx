import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type T = Node<SchematicNodeData, 'sldGround'>;

export function SldGroundNode({ data, selected }: NodeProps<T>) {
  const re = data.parameters.re ? `RE=${data.parameters.re}Ω` : '';
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 40, height: 30 }}>
      <Handle type="source" position={Position.Top} id="in" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#228B22', left: 20 }} />
      <svg width="40" height="30" viewBox="0 0 40 30" style={{ overflow: 'visible' }}>
        <line x1="20" y1="0" x2="20" y2="12" stroke="#228B22" strokeWidth="1.5" />
        <line x1="6" y1="12" x2="34" y2="12" stroke="#228B22" strokeWidth="2" />
        <line x1="11" y1="18" x2="29" y2="18" stroke="#228B22" strokeWidth="1.5" />
        <line x1="15" y1="24" x2="25" y2="24" stroke="#228B22" strokeWidth="1" />
        <text x="20" y="38" textAnchor="middle" fontSize="7" fill="#888">{re}</text>
      </svg>
    </div>
  );
}
