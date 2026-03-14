import { BaseEdge, type EdgeProps } from '@xyflow/react';

// Prosta linia punkt-punkt — do rysowania dachu, krawedzi, polaci
export function StraightLineEdge({
  id, sourceX, sourceY, targetX, targetY, data, selected,
}: EdgeProps) {
  const d = (data ?? {}) as Record<string, unknown>;
  const color = (d.color as string) || '#333';
  const lineWidth = Number(d.lineWidth) || 2;
  const dashed = d.style === 'kreskowana';

  const path = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;

  return (
    <g>
      <BaseEdge id={id} path={path} style={{
        stroke: color,
        strokeWidth: selected ? lineWidth + 1 : lineWidth,
        strokeDasharray: dashed ? '6,4' : 'none',
      }} />
    </g>
  );
}
