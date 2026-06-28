import { useStore } from '@xyflow/react';
import { useSldGeomStore, type Pt } from '../../store/sldGeomStore.ts';

// Automatyczne znaczniki czytelnosci na schemacie jednokreskowym (IEC 61082-1):
//  - KOLKO w wezle: gdzie >=2 kable spotykaja sie w jednym punkcie (lub kabel
//    dochodzi na srodek innego kabla = odgalezienie) → wypelniona kropka.
//  - OMIJKA (polkole) w skrzyzowaniu BEZ polaczenia: kabel „przeskakuje" drugi.
// Nakladka liczy to globalnie z geometrii raportowanej przez kable (store flow).

const HOP_R = 5;     // promien omijki
const DOT_R = 5;     // promien kolka polaczenia (puste, ~ jak omijka)
const EPS = 1e-6;

function key(x: number, y: number) { return `${Math.round(x)},${Math.round(y)}`; }
function unit(dx: number, dy: number) { const l = Math.hypot(dx, dy) || 1; return { x: dx / l, y: dy / l }; }

// Przeciecie odcinkow a-b i c-d (tylko wnetrze obu) → punkt albo null.
function intersect(a: Pt, b: Pt, c: Pt, d: Pt): Pt | null {
  const rx = b.x - a.x, ry = b.y - a.y;
  const sx = d.x - c.x, sy = d.y - c.y;
  const denom = rx * sy - ry * sx;
  if (Math.abs(denom) < EPS) return null; // rownolegle
  const t = ((c.x - a.x) * sy - (c.y - a.y) * sx) / denom;
  const u = ((c.x - a.x) * ry - (c.y - a.y) * rx) / denom;
  const e = 0.02;
  if (t > e && t < 1 - e && u > e && u < 1 - e) return { x: a.x + t * rx, y: a.y + t * ry };
  return null;
}

export function SldConnectionOverlay() {
  const geom = useSldGeomStore((s) => s.geom);
  const [tx, ty, zoom] = useStore((s) => s.transform);

  const edges = Object.entries(geom).map(([id, g]) => ({ id, ...g }));

  // --- segmenty wszystkich kabli ---
  const segs: { id: string; a: Pt; b: Pt; color: string }[] = [];
  for (const e of edges) {
    for (let i = 0; i < e.pts.length - 1; i++) {
      segs.push({ id: e.id, a: e.pts[i], b: e.pts[i + 1], color: e.color });
    }
  }

  // --- KROPKA POLACZENIA: na kazdym koncu kabla = w miejscu dojscia do zacisku ---
  // (dedup po wspolrzednej — kilka kabli na jednym zacisku = jedna kropka).
  const junctions: Pt[] = [];
  const junctionKeys = new Set<string>();
  for (const e of edges) {
    for (const p of [e.pts[0], e.pts[e.pts.length - 1]]) {
      const k = key(p.x, p.y);
      if (!junctionKeys.has(k)) { junctionKeys.add(k); junctions.push(p); }
    }
  }

  // --- SKRZYZOWANIA (omijki): przeciecie wnetrz dwoch kabli, NIE w wezle ---
  type Hop = { x: number; y: number; hop: { a: Pt; b: Pt }; jumped: { a: Pt; b: Pt; color: string }; color: string };
  const hops: Hop[] = [];
  const hopKeys = new Set<string>();
  for (let i = 0; i < segs.length; i++) {
    for (let j = i + 1; j < segs.length; j++) {
      if (segs[i].id === segs[j].id) continue;
      const X = intersect(segs[i].a, segs[i].b, segs[j].a, segs[j].b);
      if (!X) continue;
      const k = key(X.x, X.y);
      if (hopKeys.has(k) || junctionKeys.has(k)) continue;
      // pomin jesli blisko wezla
      if ([...junctionKeys].some((jk) => { const [jx, jy] = jk.split(',').map(Number); return Math.hypot(jx - X.x, jy - X.y) < HOP_R; })) continue;
      hopKeys.add(k);
      // Kabel bardziej poziomy „przeskakuje" pionowy (konwencja).
      const di = { x: segs[i].b.x - segs[i].a.x, y: segs[i].b.y - segs[i].a.y };
      const iHorizontal = Math.abs(di.x) >= Math.abs(di.y);
      const hopSeg = iHorizontal ? segs[i] : segs[j];
      const jumpedSeg = iHorizontal ? segs[j] : segs[i];
      hops.push({ x: X.x, y: X.y, hop: { a: hopSeg.a, b: hopSeg.b }, jumped: { a: jumpedSeg.a, b: jumpedSeg.b, color: jumpedSeg.color }, color: hopSeg.color });
    }
  }

  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none', zIndex: 6 }}
    >
      <g transform={`translate(${tx} ${ty}) scale(${zoom})`}>
        {/* 1) maski — wymaz kabel „przeskakujacy" pod lukiem */}
        {hops.map((h, idx) => {
          const u = unit(h.hop.b.x - h.hop.a.x, h.hop.b.y - h.hop.a.y);
          const a = { x: h.x - u.x * HOP_R, y: h.y - u.y * HOP_R };
          const b = { x: h.x + u.x * HOP_R, y: h.y + u.y * HOP_R };
          return <line key={`m${idx}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="white" strokeWidth={3} />;
        })}
        {/* 2) odtworz kabel przeskakiwany (ciagly pod lukiem) */}
        {hops.map((h, idx) => {
          const v = unit(h.jumped.b.x - h.jumped.a.x, h.jumped.b.y - h.jumped.a.y);
          const a = { x: h.x - v.x * HOP_R, y: h.y - v.y * HOP_R };
          const b = { x: h.x + v.x * HOP_R, y: h.y + v.y * HOP_R };
          return <line key={`j${idx}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={h.jumped.color} strokeWidth={1.5} />;
        })}
        {/* 3) luk omijki na kablu przeskakujacym */}
        {hops.map((h, idx) => {
          const u = unit(h.hop.b.x - h.hop.a.x, h.hop.b.y - h.hop.a.y);
          const a = { x: h.x - u.x * HOP_R, y: h.y - u.y * HOP_R };
          const b = { x: h.x + u.x * HOP_R, y: h.y + u.y * HOP_R };
          return <path key={`h${idx}`} d={`M ${a.x} ${a.y} A ${HOP_R} ${HOP_R} 0 0 1 ${b.x} ${b.y}`} fill="none" stroke={h.color} strokeWidth={1.5} />;
        })}
        {/* kropki polaczen */}
        {junctions.map((p, idx) => (
          <circle key={`d${idx}`} cx={p.x} cy={p.y} r={DOT_R} fill="white" stroke="#222" strokeWidth={1.5} />
        ))}
      </g>
    </svg>
  );
}
