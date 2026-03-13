import { type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type PvPanelLayoutNodeType = Node<SchematicNodeData, 'pvPanelLayout'>;

// Panel PV widok z gory — prostokat z wymiarami
export function PvPanelLayoutNode({ data, selected }: NodeProps<PvPanelLayoutNodeType>) {
  const count = Number(data.parameters.count) || 1;
  const cols = Math.min(count, 6);
  const rows = Math.ceil(count / 6);

  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      <svg width={cols * 30 + 4} height={rows * 50 + 4} viewBox={`0 0 ${cols * 30 + 4} ${rows * 50 + 4}`}>
        {Array.from({ length: count }).map((_, i) => {
          const col = i % 6;
          const row = Math.floor(i / 6);
          return (
            <rect
              key={i}
              x={col * 30 + 2} y={row * 50 + 2}
              width={28} height={48}
              fill="#1e3a5f" fillOpacity="0.7"
              stroke="#0f2440" strokeWidth="1"
              rx="1"
            />
          );
        })}
        {/* Linie cel PV */}
        {Array.from({ length: count }).map((_, i) => {
          const col = i % 6;
          const row = Math.floor(i / 6);
          return (
            <line
              key={`line-${i}`}
              x1={col * 30 + 2} y1={row * 50 + 2}
              x2={col * 30 + 30} y2={row * 50 + 50}
              stroke="#0f2440" strokeWidth="0.3" strokeOpacity="0.5"
            />
          );
        })}
      </svg>
      <div className="text-xs font-bold mt-1 text-blue-800">{data.label}</div>
      {data.parameters.model && (
        <div className="text-[10px] text-gray-500">{String(count)}x {String(data.parameters.model)}</div>
      )}
    </div>
  );
}
