import { type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type PvPanelLayoutNodeType = Node<SchematicNodeData, 'pvPanelLayout'>;

// Panele PV widok z gory — konfigurowalny rzad z obracaniem
const PANEL_W = 20; // szerokosc panelu w px (~1m)
const PANEL_H = 10; // wysokosc panelu w px (~0.5m)

export function PvPanelLayoutNode({ data, selected }: NodeProps<PvPanelLayoutNodeType>) {
  const count = Number(data.parameters.count) || 10;
  const cols = Number(data.parameters.cols) || count; // ile w rzedzie
  const rotation = Number(data.parameters.rotation) || 0;
  const rows = Math.ceil(count / cols);

  const totalW = cols * PANEL_W + 4;
  const totalH = rows * PANEL_H + 4;

  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-1 ring-blue-400' : ''}`} style={{ cursor: 'move' }}>
      <svg
        width={totalW}
        height={totalH}
        viewBox={`0 0 ${totalW} ${totalH}`}
        style={{ overflow: 'visible', transform: `rotate(${rotation}deg)` }}
      >
        {Array.from({ length: count }).map((_, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          return (
            <g key={i}>
              <rect
                x={col * PANEL_W + 2}
                y={row * PANEL_H + 2}
                width={PANEL_W - 2}
                height={PANEL_H - 2}
                fill="#1e3a5f"
                fillOpacity="0.7"
                stroke="#0f2440"
                strokeWidth="0.5"
                rx="0.5"
              />
              {/* Przekatna — symbol celi PV */}
              <line
                x1={col * PANEL_W + 2}
                y1={row * PANEL_H + 2}
                x2={col * PANEL_W + PANEL_W}
                y2={row * PANEL_H + PANEL_H}
                stroke="#0f2440"
                strokeWidth="0.2"
                strokeOpacity="0.4"
              />
            </g>
          );
        })}
      </svg>

      <div className="text-[9px] font-bold text-blue-700 mt-0.5">{data.label}</div>
      {data.parameters.model && (
        <div className="text-[8px] text-gray-500">{String(count)}x {String(data.parameters.model)}</div>
      )}
    </div>
  );
}
