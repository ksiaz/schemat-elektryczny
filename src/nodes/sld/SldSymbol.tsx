import { Handle, useNodeId } from '@xyflow/react';
import { useRef, type ReactNode, type PointerEvent as ReactPointerEvent } from 'react';
import { boxDims, gTransform, rotHandle, type BaseHandle, type Rot } from './rotate.ts';
import { FONT, LABEL, RATING, SCALE, GAP } from './sldStyle.ts';
import { useProjectStore } from '../../store/projectStore.ts';
import type { LabelPos } from '../../types/index.ts';

// Wspolny szkielet symbolu SLD: div + ring zaznaczenia + uchwyty + svg + grafika
// + opis. Skala (SCALE) powieksza caly symbol; opis (oznaczenie + dane) ma
// edytowalna lokalizacje: strona (labelPos) + dostrojenie przeciaganiem (labelOffset),
// oba czytane/zapisywane w danych wezla (przez useNodeId, bez przekazywania propsow).

interface Props {
  selected?: boolean;
  rot: Rot;
  w: number;
  h: number;
  handles: BaseHandle[];
  label?: string;
  rating?: string | string[];
  children: ReactNode;
}

export function SldSymbol({ selected, rot, w, h, handles, label, rating, children }: Props) {
  const box = boxDims(rot, w, h); // jednostki projektowe (po obrocie)
  const pxW = box.w * SCALE;
  const pxH = box.h * SCALE;
  const svgRef = useRef<SVGSVGElement>(null);

  // Lokalizacja opisu z danych wezla (useNodeId — id biezacego wezla).
  const id = useNodeId();
  const node = useProjectStore((s) => (id ? s.singleLineNodes.find((n) => n.id === id) : undefined));
  const labelPos: LabelPos = (node?.data.labelPos as LabelPos) ?? 'right';
  const off = (node?.data.labelOffset as { x: number; y: number }) ?? { x: 0, y: 0 };

  // Blok tekstu: oznaczenie (bold) + linie opisu.
  const ratingLines = rating == null ? [] : Array.isArray(rating) ? rating : [rating];
  const lines = [
    ...(label ? [{ t: label, size: LABEL.size, weight: LABEL.weight, fill: LABEL.fill }] : []),
    ...ratingLines.map((t) => ({ t, size: RATING.size, weight: RATING.weight, fill: RATING.fill })),
  ];
  const LINE_GAP = 2;
  const blockH = lines.reduce((s, l) => s + l.size, 0) + Math.max(0, lines.length - 1) * LINE_GAP;

  // Punkt zaczepienia bloku wg strony — etykieta poza osia przewodu (IEC 61082-1).
  const cy = box.h / 2;
  let ax: number;
  let anchor: 'start' | 'middle' | 'end';
  let blockTop: number;
  if (labelPos === 'left') {
    ax = -GAP; anchor = 'end'; blockTop = cy - blockH / 2;
  } else if (labelPos === 'top') {
    ax = box.w / 2; anchor = 'middle'; blockTop = -GAP - blockH;
  } else if (labelPos === 'bottom') {
    ax = box.w / 2; anchor = 'middle'; blockTop = box.h + GAP;
  } else {
    ax = box.w + GAP; anchor = 'start'; blockTop = cy - blockH / 2;
  }
  ax += off.x;
  blockTop += off.y;

  // Przeciaganie opisu — aktualizuje labelOffset (live, jeden wpis historii na gest).
  const onLabelPointerDown = (e: ReactPointerEvent) => {
    if (!id || !svgRef.current) return;
    // Bez stopPropagation — klasa `nodrag` blokuje przeciaganie wezla, a klik
    // nadal zaznacza symbol. Historie zapisujemy dopiero przy realnym ruchu.
    const pxPerDesign = svgRef.current.getBoundingClientRect().width / box.w; // = SCALE × zoom
    const startX = e.clientX;
    const startY = e.clientY;
    const startOff = { ...off };
    let pushed = false;
    const move = (ev: PointerEvent) => {
      const dx = (ev.clientX - startX) / pxPerDesign;
      const dy = (ev.clientY - startY) / pxPerDesign;
      const s = useProjectStore.getState();
      if (!pushed) { s.pushSingleLineHistory(); pushed = true; }
      s.setSingleLineNodes(
        s.singleLineNodes.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, labelOffset: { x: startOff.x + dx, y: startOff.y + dy } } } : n,
        ),
      );
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  let cursor = blockTop;

  return (
    <div className={selected ? 'ring-2 ring-blue-500' : ''} style={{ width: pxW, height: pxH, position: 'relative' }}>
      {handles.map((b) => {
        const r = rotHandle(b, rot, w, h);
        return (
          <Handle key={b.id} type="source" id={r.id} position={r.position}
            className="!w-1.5 !h-1.5"
            style={{
              backgroundColor: r.color,
              left: r.left != null ? r.left * SCALE : undefined,
              top: r.top != null ? r.top * SCALE : undefined,
            }} />
        );
      })}
      <svg ref={svgRef} width={pxW} height={pxH} viewBox={`0 0 ${box.w} ${box.h}`}
        style={{ overflow: 'visible', display: 'block' }} fontFamily={FONT}>
        <g transform={gTransform(rot, w, h)}>{children}</g>
        {lines.length > 0 && (
          <g className="nodrag" style={{ cursor: 'move' }} onPointerDown={onLabelPointerDown}>
            {lines.map((l, i) => {
              const baseline = (cursor += l.size, cursor - 1);
              cursor += LINE_GAP;
              return (
                <text key={i} x={ax} y={baseline} textAnchor={anchor}
                  fontSize={l.size} fontWeight={l.weight} fill={l.fill}>{l.t}</text>
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
}
