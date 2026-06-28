import { useEffect } from 'react';
import { BaseEdge, type EdgeProps } from '@xyflow/react';
import type { SingleLineCableData } from '../types/index.ts';
import { useSldGeomStore } from '../store/sldGeomStore.ts';

const HATCH_LEN = 6;       // dlugosc ukosnej kreski [px]
const HATCH_SPACING = 3;   // odstep miedzy kreskami
const HATCH_ANGLE_DEG = 60;
const MIN_LINE_LEN_FOR_HATCH = 60;

function buildPath(sx: number, sy: number, tx: number, ty: number, waypoints?: Array<{x:number;y:number}>) {
  if (!waypoints || waypoints.length === 0) {
    return `M ${sx} ${sy} L ${tx} ${ty}`;
  }
  let d = `M ${sx} ${sy}`;
  for (const w of waypoints) d += ` L ${w.x} ${w.y}`;
  d += ` L ${tx} ${ty}`;
  return d;
}

function formatLabel(data: SingleLineCableData): string[] {
  const lines: string[] = [];
  // Bednarka (plaskownik uziemiajacy) — wymiary w mm, bez podzialu na PE.
  const unit = data.cableType === 'bednarka' ? 'mm' : 'mm²';
  const dcSuffix = data.current === 'DC' ? ' (DC)' : '';
  if (data.showCrossSection === 'Nie') {
    // Opis przekroju wylaczony — sama nazwa typu kabla.
    if (data.cableType) lines.push(`${data.cableType}${dcSuffix}`);
  } else {
    const main = `${data.cableType} ${data.cores}×${data.crossSection}`;
    const withPe = unit === 'mm²' && data.peCrossSection && data.peCrossSection !== data.crossSection
      ? `${data.cableType} ${data.cores - 1}×${data.crossSection}+${data.peCrossSection}`
      : main;
    lines.push(`${withPe} ${unit}${dcSuffix}`);
  }
  if (data.circuitId) lines.push(data.circuitId);
  if (data.length !== undefined && data.showLength !== 'Nie') lines.push(`L=${data.length} m`);
  return lines;
}

export function SingleLineCableEdge({
  id, sourceX, sourceY, targetX, targetY, data, selected,
}: EdgeProps) {
  const d = (data ?? {}) as Partial<SingleLineCableData>;
  const cableType = d.cableType ?? 'YDY';
  const cores = d.cores ?? 5;
  const crossSection = d.crossSection ?? 6;
  const wireColor = d.color || '#222';
  const waypoints = (d as { waypoints?: Array<{x:number;y:number}> }).waypoints;

  const path = buildPath(sourceX, sourceY, targetX, targetY, waypoints);

  const labelLines = formatLabel({
    cableType, cores, crossSection,
    peCrossSection: d.peCrossSection,
    circuitId: d.circuitId,
    length: d.length,
    current: d.current,
    showCrossSection: d.showCrossSection,
    showLength: d.showLength,
  });
  const labelKey = labelLines.join('');

  // Raportuj polilinie + opis do ulotnego store'a — nakladki rysuja wezly,
  // omijki i OPISY (globalnie, z unikaniem nakladania).
  useEffect(() => {
    const pts = [{ x: sourceX, y: sourceY }, ...(waypoints ?? []), { x: targetX, y: targetY }];
    useSldGeomStore.getState().report(id, pts, wireColor, labelLines);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, sourceX, sourceY, targetX, targetY, waypoints, wireColor, labelKey]);
  useEffect(() => () => useSldGeomStore.getState().remove(id), [id]);

  // srodek pierwszego segmentu (do rozkladania pęczka kresek liczby zyl)
  const next = waypoints && waypoints.length > 0 ? waypoints[0] : { x: targetX, y: targetY };
  const midX = (sourceX + next.x) / 2;
  const midY = (sourceY + next.y) / 2;
  const dx = next.x - sourceX;
  const dy = next.y - sourceY;
  const segLen = Math.hypot(dx, dy);

  const ux = segLen > 0 ? dx / segLen : 1;
  const uy = segLen > 0 ? dy / segLen : 0;

  // ukosna kreska pod katem 60deg wzgledem linii
  const angleRad = (HATCH_ANGLE_DEG * Math.PI) / 180;
  const hx = ux * Math.cos(angleRad) - uy * Math.sin(angleRad);
  const hy = ux * Math.sin(angleRad) + uy * Math.cos(angleRad);

  const totalWidth = (cores - 1) * HATCH_SPACING;
  const startX = midX - (ux * totalWidth) / 2;
  const startY = midY - (uy * totalWidth) / 2;

  const showHatches = segLen >= MIN_LINE_LEN_FOR_HATCH;

  return (
    <g>
      <BaseEdge id={id} path={path} style={{
        stroke: selected ? '#1d4ed8' : wireColor,
        strokeWidth: selected ? 2.5 : 1.5,
      }} />

      {showHatches && Array.from({ length: cores }).map((_, i) => {
        const cx = startX + ux * (i * HATCH_SPACING);
        const cy = startY + uy * (i * HATCH_SPACING);
        const x1 = cx - (hx * HATCH_LEN) / 2;
        const y1 = cy - (hy * HATCH_LEN) / 2;
        const x2 = cx + (hx * HATCH_LEN) / 2;
        const y2 = cy + (hy * HATCH_LEN) / 2;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={selected ? '#1d4ed8' : wireColor} strokeWidth="1" />;
      })}
    </g>
  );
}
