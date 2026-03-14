import { type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type PvPanelLayoutNodeType = Node<SchematicNodeData, 'pvPanelLayout'>;

// Panele PV widok z gory — 1m = 50px, panel 2m x 1m
const PANEL_W = 100; // 2m = 100px
const PANEL_H = 50;  // 1m = 50px

export function PvPanelLayoutNode({ data, selected }: NodeProps<PvPanelLayoutNodeType>) {
  const count = Number(data.parameters.count) || 10;
  const cols = Number(data.parameters.cols) || count;
  const rotation = Number(data.parameters.rotation) || 0;
  const vertical = data.parameters.panelOrientation === 'pionowo';
  const rows = Math.ceil(count / cols);

  // Pionowo: panel 1m x 2m (50x100), poziomo: 2m x 1m (100x50)
  const pw = vertical ? PANEL_H : PANEL_W;
  const ph = vertical ? PANEL_W : PANEL_H;

  const totalW = cols * pw + 4;
  const totalH = rows * ph + 4;

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
                x={col * pw + 2}
                y={row * ph + 2}
                width={pw - 2}
                height={ph - 2}
                fill="#1e3a5f"
                fillOpacity="0.7"
                stroke="#0f2440"
                strokeWidth="0.5"
                rx="0.5"
              />
              {/* Przekatna — symbol celi PV */}
              <line
                x1={col * pw + 2}
                y1={row * ph + 2}
                x2={col * pw + pw}
                y2={row * ph + ph}
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
