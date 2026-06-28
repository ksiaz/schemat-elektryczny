import { Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { normRot, type BaseHandle } from './rotate.ts';
import { SldSymbol } from './SldSymbol.tsx';
import { INK, STROKE, FINE, GLYPH } from './sldStyle.ts';

type T = Node<SchematicNodeData, 'sldInverter'>;

const H = 60;

export function SldInverterNode({ data, selected }: NodeProps<T>) {
  const typ = String(data.parameters.type ?? 'string');
  const desc = String(data.parameters.description ?? '');
  const isHybrid = typ === 'hybrid';

  // Liczba stringow PV — steruje liczba uchwytow wejsciowych (zlacz)
  const strings = Math.max(1, Math.min(8, Math.round(Number(data.parameters.strings ?? 2))));

  // Szerokosc rosnie z liczba stringow — kazde zlacze = 20 px
  const W = Math.max(isHybrid ? 60 : 40, strings * 20 + 20);
  const cx = W / 2;
  const pvX = Array.from({ length: strings }, (_, i) => (i + 1) * 20);

  const rot = normRot(data.rotation);

  // Uchwyty bazowe (uklad 0 0 W H) — monochrom, neutralne kropki
  const base: BaseHandle[] = pvX.map((x, i) => ({
    id: `pv${i + 1}`, pos: Position.Top, x, y: 0,
  }));
  if (isHybrid) {
    base.push({ id: 'bat', pos: Position.Left, x: 0, y: 30 });
    base.push({ id: 'ac1', pos: Position.Right, x: W, y: 20 });
    base.push({ id: 'ac2', pos: Position.Right, x: W, y: 40 });
  } else {
    base.push({ id: 'ac', pos: Position.Bottom, x: cx, y: H });
  }

  return (
    <SldSymbol selected={selected} rot={rot} w={W} h={H} handles={base}
      label={data.label} rating={desc || undefined}>
      {isHybrid ? (
        <>
          {pvX.map((x, i) => (
            <line key={i} x1={x} y1="0" x2={x} y2="6" stroke={INK} strokeWidth={STROKE} />
          ))}
          <rect x="8" y="6" width={W - 16} height="48" rx="2" fill="white" stroke={INK} strokeWidth={STROKE} />
          <line x1={cx - 12} y1="42" x2={cx + 12} y2="18" stroke={INK} strokeWidth={FINE} />
          <text x={cx - 9} y="26" textAnchor="middle" fontSize={GLYPH.size + 3} fontWeight="bold" fill={INK}>═</text>
          <text x={cx + 9} y="44" textAnchor="middle" fontSize={GLYPH.size + 3} fontWeight="bold" fill={INK}>∼</text>
          <line x1="8" y1="30" x2="-2" y2="30" stroke={INK} strokeWidth={STROKE} />
          <text x="-4" y="27" textAnchor="end" fontSize="6" fill={INK}>BAT</text>
          <line x1={W - 8} y1="20" x2={W + 2} y2="20" stroke={INK} strokeWidth={STROKE} />
          <line x1={W - 8} y1="40" x2={W + 2} y2="40" stroke={INK} strokeWidth={STROKE} />
        </>
      ) : (
        <>
          {pvX.map((x, i) => (
            <line key={i} x1={x} y1="0" x2={x} y2="10" stroke={INK} strokeWidth={STROKE} />
          ))}
          <rect x="8" y="10" width={W - 16} height="40" rx="2" fill="white" stroke={INK} strokeWidth={STROKE} />
          <line x1={cx - 12} y1="44" x2={cx + 12} y2="16" stroke={INK} strokeWidth={FINE} />
          <text x={cx - 9} y="28" textAnchor="middle" fontSize={GLYPH.size + 3} fontWeight="bold" fill={INK}>═</text>
          <text x={cx + 9} y="44" textAnchor="middle" fontSize={GLYPH.size + 3} fontWeight="bold" fill={INK}>∼</text>
          <line x1={cx} y1="50" x2={cx} y2="60" stroke={INK} strokeWidth={STROKE} />
        </>
      )}
    </SldSymbol>
  );
}
