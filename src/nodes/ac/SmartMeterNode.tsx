import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { WIRE_COLORS } from '../../constants/index.ts';

type SmartMeterNodeType = Node<SchematicNodeData, 'smartMeter'>;

// Smart meter (Pstryk / Fronius / Shelly) — modul DIN z CT i WiFi
// 3 zaciski fazowe (L1/L2/L3) + N u gory, 3 wyjscia CT z prawej
export function SmartMeterNode({ data, selected }: NodeProps<SmartMeterNodeType>) {
  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: 60 }}>
      {/* Zaciski zasilania gora: L1, L2, L3, N */}
      <Handle type="source" position={Position.Top} id="in-L1" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L1, left: 10 }} />
      <Handle type="source" position={Position.Top} id="in-L2" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L2, left: 20 }} />
      <Handle type="source" position={Position.Top} id="in-L3" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L3, left: 30 }} />
      <Handle type="source" position={Position.Top} id="in-N" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.N, left: 40 }} />

      <svg width="60" height="60" viewBox="0 0 60 60" style={{ overflow: 'visible' }}>
        <text x="30" y="-4" textAnchor="middle" fontSize="9" fill="#333" fontWeight="bold">{data.label}</text>

        <rect x="4" y="2" width="52" height="56" fill="none" stroke="#333" strokeWidth="1.5" rx="2" />

        {/* WiFi symbol */}
        <path d="M 22,14 Q 30,8 38,14" fill="none" stroke="#333" strokeWidth="0.8" />
        <path d="M 25,18 Q 30,14 35,18" fill="none" stroke="#333" strokeWidth="0.8" />
        <circle cx="30" cy="20" r="1.5" fill="#333" />

        {/* Napis */}
        <text x="30" y="36" textAnchor="middle" fontSize="8" fill="#333" fontWeight="bold" fontFamily="monospace">METER</text>

        {/* CT symbol — 3 koleczka po prawej */}
        <circle cx="52" cy="20" r="4" fill="none" stroke={WIRE_COLORS.L1} strokeWidth="0.8" />
        <circle cx="52" cy="32" r="4" fill="none" stroke={WIRE_COLORS.L2} strokeWidth="0.8" />
        <circle cx="52" cy="44" r="4" fill="none" stroke={WIRE_COLORS.L3} strokeWidth="0.8" />

        <text x="30" y="50" textAnchor="middle" fontSize="6" fill="#888">CT</text>
      </svg>

      {data.parameters.model && (
        <div className="text-[8px] text-gray-500">{String(data.parameters.model)}</div>
      )}

      {/* Wyjscia CT z prawej — do przekladnikow */}
      <Handle type="source" position={Position.Right} id="ct-L1" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L1, top: 20 }} />
      <Handle type="source" position={Position.Right} id="ct-L2" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L2, top: 30 }} />
      <Handle type="source" position={Position.Right} id="ct-L3" className="!w-1.5 !h-1.5" style={{ backgroundColor: WIRE_COLORS.L3, top: 40 }} />

      {/* COM — do falownika */}
      <Handle type="source" position={Position.Bottom} id="com" className="!w-1.5 !h-1.5" style={{ backgroundColor: '#999', left: 30 }} />
    </div>
  );
}
