import { type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, boxDims, gTransform } from './rotate.ts';
import { INK, STROKE, FONT } from './sldStyle.ts';

type T = Node<SchematicNodeData, 'sldOsdBoundary'>;

const W = 200;
const H = 80;

// Granica wlasnosci OSD — duza, kreskowana linia z opisem stron. To region/adnotacja,
// nie symbol aparatu: brak uchwytow, wlasny uklad. <SldSymbol> tu nie pasuje —
// zostawiam wlasny szkielet, monochrom INK + wspolny font (bylo semantyczne czerwone,
// teraz mono wg decyzji „Monochrom CAD"; kreskowanie samo niesie znaczenie granicy).
export function SldOsdBoundaryNode({ data, selected }: NodeProps<T>) {
  const labelText = String(data.parameters.label ?? 'Granica własności OSD');

  const rot = normRot(data.rotation);
  const box = boxDims(rot, W, H);

  return (
    <div className={`${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ width: box.w, height: box.h, pointerEvents: 'all' }}>
      <svg width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`} style={{ overflow: 'visible', display: 'block' }} fontFamily={FONT}>
        <text x={box.w / 2} y="-4" textAnchor="middle" fontSize="9" fontWeight="bold" fill={INK}>{labelText}</text>
        <g transform={gTransform(rot, W, H)}>
          <line x1="100" y1="0" x2="100" y2="80" stroke={INK} strokeWidth={STROKE} strokeDasharray="6,4" />
          <text x="105" y="40" fontSize="8" fill={INK}>→ OSD</text>
          <text x="95" y="40" textAnchor="end" fontSize="8" fill={INK}>odbiorca ←</text>
        </g>
      </svg>
    </div>
  );
}
