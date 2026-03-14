import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { AcHandles } from './AcHandles.tsx';

type HybridInverterNodeType = Node<SchematicNodeData, 'hybridInverter'>;

// Falownik hybrydowy — DC wejscia (MPPT + bateria), 2 wyjscia AC (grid + backup)
export function HybridInverterNode({ data, selected }: NodeProps<HybridInverterNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      {/* Wejscia DC — gora */}
      <Handle type="target" position={Position.Top} id="dc-mppt1" className="!bg-red-500 !w-2 !h-2" style={{ left: '25%' }} />
      <Handle type="target" position={Position.Top} id="dc-mppt2" className="!bg-red-500 !w-2 !h-2" style={{ left: '50%' }} />
      {/* Bateria — lewy bok */}
      <Handle type="target" position={Position.Left} id="dc-bat" className="!bg-orange-500 !w-2 !h-2" />

      <svg width="120" height="90" viewBox="0 0 120 90">
        {/* Prostokat obudowy */}
        <rect x="4" y="4" width="112" height="82" fill="none" stroke="#333" strokeWidth="1.5" />

        {/* Etykiety MPPT */}
        <text x="30" y="16" textAnchor="middle" fontSize="7" fill="#999" fontFamily="monospace">MPPT1</text>
        <text x="60" y="16" textAnchor="middle" fontSize="7" fill="#999" fontFamily="monospace">MPPT2</text>

        {/* DC u gory */}
        <text x="100" y="16" textAnchor="middle" fontSize="10" fill="#333" fontWeight="bold" fontFamily="monospace">DC</text>

        {/* Linia podzialu */}
        <line x1="4" y1="45" x2="116" y2="45" stroke="#333" strokeWidth="0.5" strokeDasharray="4,3" />

        {/* AC u dolu */}
        <text x="20" y="60" textAnchor="middle" fontSize="10" fill="#333" fontWeight="bold" fontFamily="monospace">AC</text>

        {/* Sinusoida */}
        <path d="M 35,58 Q 45,50 55,58 Q 65,66 75,58" fill="none" stroke="#333" strokeWidth="1" />

        {/* Grid i Backup oznaczenia */}
        <text x="40" y="80" textAnchor="middle" fontSize="7" fill="#666" fontFamily="monospace">GRID</text>
        <text x="90" y="80" textAnchor="middle" fontSize="7" fill="#666" fontFamily="monospace">BACKUP</text>

        {/* Linia podzialu AC grid/backup */}
        <line x1="65" y1="45" x2="65" y2="86" stroke="#333" strokeWidth="0.5" strokeDasharray="2,2" />

        {/* BAT po lewej */}
        <text x="10" y="38" textAnchor="middle" fontSize="7" fill="#c97706" fontFamily="monospace" transform="rotate(-90, 10, 38)">BAT</text>
      </svg>

      <div className="text-xs font-bold text-gray-800 mt-1">{data.label}</div>
      {data.parameters.model && (
        <div className="text-[10px] text-gray-500">{String(data.parameters.model)}</div>
      )}
      {data.parameters.power && (
        <div className="text-[10px] text-gray-500">{String(data.parameters.power)} kW</div>
      )}

      {/* Wyjscie AC Grid — lewy dol, 5 handli */}
      <div className="flex gap-0.5 mt-1">
        <AcHandles type="source" position={Position.Bottom} prefix="grid" />
      </div>

      {/* Wyjscie AC Backup — prawy bok */}
      <Handle type="source" position={Position.Right} id="backup-L1" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#808080', top: '60%' }} />
      <Handle type="source" position={Position.Right} id="backup-L2" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#1a1a1a', top: '65%' }} />
      <Handle type="source" position={Position.Right} id="backup-L3" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#8B4513', top: '70%' }} />
      <Handle type="source" position={Position.Right} id="backup-N" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#0000CD', top: '75%' }} />
      <Handle type="source" position={Position.Right} id="backup-PE" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#228B22', top: '80%' }} />
    </div>
  );
}
