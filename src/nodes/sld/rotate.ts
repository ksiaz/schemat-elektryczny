import { Position } from '@xyflow/react';

// Pomocnicze do natywnego obrotu symboli SLD o wielokrotnosc 90°.
// Grafika obraca sie przez SVG <g transform>, a uchwyty sa deklarowane
// na realnych, obroconych krawedziach — React Flow widzi zwykly wezel.

export type Rot = 0 | 90 | 180 | 270;

export function normRot(v: unknown): Rot {
  const r = ((Math.round(Number(v ?? 0) / 90) * 90) % 360 + 360) % 360;
  return r as Rot;
}

// Rozmiar pudelka po obrocie (90/270 zamienia szerokosc z wysokoscia).
export function boxDims(rot: Rot, w: number, h: number): { w: number; h: number } {
  return rot === 90 || rot === 270 ? { w: h, h: w } : { w, h };
}

// Transform dla <g> obracajacy grafike rysowana w ukladzie 0 0 w h.
export function gTransform(rot: Rot, w: number, h: number): string {
  if (rot === 90) return `translate(${h} 0) rotate(90)`;
  if (rot === 180) return `translate(${w} ${h}) rotate(180)`;
  if (rot === 270) return `translate(0 ${w}) rotate(270)`;
  return '';
}

const ORDER = [Position.Top, Position.Right, Position.Bottom, Position.Left];

export interface BaseHandle {
  id: string;
  pos: Position;
  x: number;
  y: number;
  color?: string;
}

export interface RotHandle {
  id: string;
  position: Position;
  left?: number;
  top?: number;
  color: string;
}

// Przelicza uchwyt bazowy (uklad 0 0 w h) na pozycje po obrocie.
export function rotHandle(b: BaseHandle, rot: Rot, w: number, h: number): RotHandle {
  let x = b.x;
  let y = b.y;
  if (rot === 90) { x = h - b.y; y = b.x; }
  else if (rot === 180) { x = w - b.x; y = h - b.y; }
  else if (rot === 270) { x = b.y; y = w - b.x; }
  const position = ORDER[(ORDER.indexOf(b.pos) + rot / 90) % 4];
  const color = b.color ?? '#333';
  return position === Position.Top || position === Position.Bottom
    ? { id: b.id, position, left: x, color }
    : { id: b.id, position, top: y, color };
}
