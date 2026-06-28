import { useStore } from '@xyflow/react';
import { useSldGeomStore, type Pt } from '../../store/sldGeomStore.ts';
import { useProjectStore } from '../../store/projectStore.ts';

// Opisy przewodow rysowane WZDLUZ przewodow (rownolegle), z globalna
// optymalizacja pozycji (zachlanne unikanie nakladania) i pomijaniem opisu
// na odcinkach krotszych niz sam opis.

const PERP_GAP = 4;      // odsuniecie opisu od osi przewodu
const SHIFT = 16;        // krok przesuwania wzdluz przewodu przy kolizji
const SHIFTS = [0, 1, -1, 2, -2, 3, -3].map((k) => k * SHIFT);

interface Box { x1: number; y1: number; x2: number; y2: number }
function overlaps(a: Box, b: Box) {
  return a.x1 < b.x2 && a.x2 > b.x1 && a.y1 < b.y2 && a.y2 > b.y1;
}
function unit(dx: number, dy: number) { const l = Math.hypot(dx, dy) || 1; return { x: dx / l, y: dy / l }; }

interface Placed { anchor: Pt; angle: number; perpBase: number; lines: string[]; color: string }

export function SldLabelOverlay() {
  const geom = useSldGeomStore((s) => s.geom);
  const [tx, ty, zoom] = useStore((s) => s.transform);

  // Globalna wielkosc czcionki opisow (projectInfo, edytowalna w Toolbarze).
  const FONT = useProjectStore((s) => s.projectInfo.sldLabelFontSize) ?? 7;
  const LINE_H = FONT + 2;        // odstep linii
  const CHAR_W = FONT * 0.56;     // przyblizona szerokosc znaku

  // Stabilna kolejnosc (po id) — deterministyczne ukladanie.
  const edges = Object.entries(geom)
    .filter(([, g]) => g.label.length > 0)
    .sort(([a], [b]) => (a < b ? -1 : 1));

  const placedBoxes: Box[] = [];
  const placed: Placed[] = [];

  for (const [, g] of edges) {
    // Najdluzszy segment kabla = miejsce na opis.
    let best = { len: -1, a: g.pts[0], b: g.pts[0] };
    for (let i = 0; i < g.pts.length - 1; i++) {
      const a = g.pts[i], b = g.pts[i + 1];
      const len = Math.hypot(b.x - a.x, b.y - a.y);
      if (len > best.len) best = { len, a, b };
    }

    const lines = g.label;
    const blockW = Math.max(...lines.map((l) => l.length)) * CHAR_W;
    const blockH = lines.length * LINE_H;

    // Odcinek krotszy niz opis → likwidujemy opis.
    if (best.len < blockW) continue;

    // Kierunek wzdluz przewodu, znormalizowany do czytelnosci (nie do gory nogami).
    let angle = (Math.atan2(best.b.y - best.a.y, best.b.x - best.a.x) * 180) / Math.PI;
    if (angle > 90) angle -= 180; else if (angle <= -90) angle += 180;
    const ar = (angle * Math.PI) / 180;
    const u = { x: Math.cos(ar), y: Math.sin(ar) };
    const perp = unit(-u.y, u.x);
    const mid = { x: (best.a.x + best.b.x) / 2, y: (best.a.y + best.b.y) / 2 };

    // Pasy prostopadle: gorna krawedz bloku odsunieta od przewodu. Najpierw blisko
    // (po obu stronach), potem coraz dalej — dzieki temu przy duzej czcionce opisy
    // maja gdzie uciec (sam przesuw wzdluz przewodu juz nie wystarcza).
    const G = 3;
    const lanes = [
      PERP_GAP,
      -(PERP_GAP + blockH),
      PERP_GAP + blockH + G,
      -(2 * blockH + PERP_GAP + G),
      PERP_GAP + 2 * (blockH + G),
      -(3 * blockH + PERP_GAP + 2 * G),
    ];

    // Kandydaci: pas × przesuniecie wzdluz przewodu. Pierwszy bez kolizji wygrywa.
    const maxShift = (best.len - blockW) / 2;
    let chosen: { anchor: Pt; box: Box; perpBase: number } | null = null;
    outer:
    for (const perpBase of lanes) {
      for (const sh of SHIFTS) {
        if (Math.abs(sh) > maxShift) continue;
        const anchor = { x: mid.x + u.x * sh, y: mid.y + u.y * sh };
        const corners: Pt[] = [
          [-blockW / 2, perpBase], [blockW / 2, perpBase],
          [-blockW / 2, perpBase + blockH], [blockW / 2, perpBase + blockH],
        ].map(([lx, ly]) => ({ x: anchor.x + lx * u.x + ly * perp.x, y: anchor.y + lx * u.y + ly * perp.y }));
        const box: Box = {
          x1: Math.min(...corners.map((c) => c.x)), y1: Math.min(...corners.map((c) => c.y)),
          x2: Math.max(...corners.map((c) => c.x)), y2: Math.max(...corners.map((c) => c.y)),
        };
        if (!placedBoxes.some((pb) => overlaps(pb, box))) { chosen = { anchor, box, perpBase }; break outer; }
        if (!chosen) chosen = { anchor, box, perpBase }; // fallback (baza)
      }
    }
    if (!chosen) continue;
    placedBoxes.push(chosen.box);
    placed.push({ anchor: chosen.anchor, angle, perpBase: chosen.perpBase, lines, color: g.color });
  }

  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none', zIndex: 6 }}>
      <g transform={`translate(${tx} ${ty}) scale(${zoom})`}>
        {placed.map((p, idx) => (
          <g key={idx} transform={`translate(${p.anchor.x} ${p.anchor.y}) rotate(${p.angle})`}>
            {p.lines.map((t, i) => (
              <text key={i} x={0} y={p.perpBase + FONT + i * LINE_H} textAnchor="middle"
                fontSize={FONT} fill="#222"
                style={{ paintOrder: 'stroke', stroke: 'white', strokeWidth: 2, strokeLinejoin: 'round' }}>
                {t}
              </text>
            ))}
          </g>
        ))}
      </g>
    </svg>
  );
}
